// pages/api/crawl/uploadByContract.js
// This nifty api takes a contract address and adds the nft and collection data to the database.
// Uses alchemy and moralis, may need upgraded in the future.
// Currently only on ethereum chain but can be expanded to other chains.

import db from "../../../lib/db";
import retry from 'async-retry';
const { Alchemy, Network } = require("alchemy-sdk");

const config = {
    apiKey: process.env.ALCHEMY_API_KEY,
    network: Network.ETH_MAINNET,
};

const alchemy = new Alchemy(config);
let isMoralisStarted = false;

// to get around the rate limit
function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

export default async function (req, res) {
    if (req.method !== "GET") {
        return res.status(405).json({ message: "Method Not Allowed" });
    }

    const Moralis = require("moralis").default;
    const { EvmChain } = require("@moralisweb3/common-evm-utils");
    const chain = EvmChain.ETHEREUM;

    if (!isMoralisStarted) {
        try {
            await Moralis.start({
                apiKey: process.env.MORALIS_API_KEY,
            });
            isMoralisStarted = true;
        } catch (error) {
            if (!error.message.includes("Modules are started already")) {
                console.error("Error initializing Moralis:", error);
                return res.status(500).json({
                    message: "Internal Server Error.",
                    error: error.message,
                });
            }
        }
    }

    const contract = req.query.contract;

    if (!contract) {
        return res
            .status(400)
            .json({ message: "contract address query parameter is required." });
    }

    // // helper function to enable exponential backoff retries with alchemy
    async function getNftMetadataWithRetry(contract, tokenId, contractType) {
        return await retry(async () => {
            return await alchemy.nft.getNftMetadata(String(contract), String(tokenId), String(contractType));
        }, {
            retries: 100,
            factor: 3,
            minTimeout: 3000,
            maxTimeout: 60000,
            onRetry: (error, attempt) => {
                console.log(`Retry attempt ${attempt} for getNftMetadata due to error: ${error.message}`);
            },
        });
    }
    async function getNftOwnersWithRetry(contract, tokenId) {
        return await retry(async () => {
            return await alchemy.nft.getOwnersForNft(String(contract), String(tokenId));
        }, {
            retries: 100,
            factor: 3,
            minTimeout: 3000,
            maxTimeout: 60000,
            onRetry: (error, attempt) => {
                console.log(`Retry attempt ${attempt} for getNftOwners due to error: ${error.message}`);
            },
        });
    }


    try {
        let cursor = null;

        do {
            // Add Collection to database
            const coll_response = await alchemy.nft.getContractMetadata(
                String(contract),
            );

            const collData = {
                contract_address: coll_response.address,
                collection_name: coll_response.name,
                token_type: coll_response.tokenType,
                num_collection: coll_response.totalSupply,
                deployer: coll_response.contractDeployer,
            };

            console.log("Collection Data:", collData); 

            // Check if the entry already exists in the database
            const existingEntry = await db.oneOrNone(
                "SELECT contract_address FROM collections WHERE contract_address = $1",
                [collData.contract_address],
            );

            if (!existingEntry) {
                // Add the NFT data to the database
                await db.none(
                    `
          INSERT INTO collections(
              contract_address, 
              collection_name,
              token_type,
              num_collection_items,
              deployer_address
              )
              VALUES($1, $2, $3, $4, $5)
                        `,
                    [
                        collData.contract_address,
                        collData.collection_name,
                        collData.token_type,
                        collData.num_collection,
                        collData.deployer,
                    ],
                );
                console.log(
                    "Added collection to database:",
                    collData.collection_name,
                );
            }

            let collectionId = null;

            const collectionResult = await db.oneOrNone(
                "SELECT collection_id FROM collections WHERE contract_address = $1",
                [collData.contract_address],
            );

            if (collectionResult) {
                collectionId = collectionResult.collection_id;
            }

            // Add NFTs to database
            const response = await Moralis.EvmApi.nft.getContractNFTs({
                address: contract,
                chain,
                cursor: cursor,
            });

            for (const NFT of response.result) {
                const metadata =
                    typeof NFT.metadata === "string"
                        ? JSON.parse(NFT.metadata)
                        : NFT.metadata;
                let image = NFT && NFT.metadata ? NFT.metadata.image : "Blank";
                if (image.startsWith("ipfs://")) {
                    image = image.replace("ipfs://", "https://ipfs.io/ipfs/");
                }

                const load = await getNftMetadataWithRetry(
                    String(contract),
                    String(NFT.tokenId),
                    String(NFT.contract_type),
                );
                const deployer = load.contract.contractDeployer;
                const description = load.description;

                const owners = await getNftOwnersWithRetry(
                    String(contract),
                    String(NFT.tokenId),
                );

                const nftData = {
                    contract_address: contract,
                    token_id: NFT.tokenId,
                    nft_name: load.title,
                    token_type: NFT.contractType,
                    token_uri: NFT.tokenUri,
                    media_link: image,
                    deployer_address: deployer,
                    nft_description: description,
                    spam: NFT.possibleSpam,
                    owner: owners.owners,
                };

                // Check if the entry already exists in the database
                const existingEntry = await db.oneOrNone(
                    "SELECT contract_address_token_id FROM nfts WHERE contract_address_token_id = $1",
                    [nftData.contract_address + nftData.token_id],
                );

                if (!existingEntry) {
                    // Add the NFT data to the database
                    await db.none(
                        `
            INSERT INTO nfts(
                contract_address_token_id,
                contract_address, 
                owners,
                nft_name,
                token_type, 
                token_uri_gateway,
                media_url, 
                deployer_address,
                nft_description,
                token_id,
                collection_id)
                VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
            `,
                        [
                            nftData.contract_address + nftData.token_id,
                            nftData.contract_address,
                            nftData.owner,
                            nftData.nft_name,
                            nftData.token_type,
                            nftData.token_uri,
                            nftData.media_link,
                            nftData.deployer_address,
                            nftData.nft_description,
                            nftData.token_id,
                            collectionId,
                        ],
                    );
                }
                console.log("Added NFT to database:", nftData.token_id);
                await sleep(1750);
            }
            cursor = response.pagination.cursor;
        } while (cursor != "" && cursor != null);

        // Send the response after processing all the NFTs
        return res.status(200).json({
            success: true,
            message: "NFTs added to database",
        });
    } catch (error) {
        console.error(error);
        return res
            .status(500)
            .json({ message: "Internal Server Error.", error: error.message });
    }
}
