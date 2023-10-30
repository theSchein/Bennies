import db from "../../../lib/db";
const { Alchemy, Network } = require("alchemy-sdk");

const config = {
    apiKey: process.env.ALCHEMY_API_KEY,
    network: Network.ETH_MAINNET,
};

const alchemy = new Alchemy(config);
let isMoralisStarted = false;

// to get around the rate limit
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
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
                return res.status(500).json({ message: "Internal Server Error.", error: error.message });
            }
        }
    }

    const contract = req.query.contract;

    if (!contract) {
        return res.status(400).json({ message: "contract address query parameter is required." });
    }

    try {
        let cursor = null;
        let nftDetails = [];
    
        do {
            const response = await Moralis.EvmApi.nft.getContractNFTs({
              address: contract,
              chain,
              cursor: cursor,
            });


    
            for (const NFT of response.result) {
                const metadata = typeof NFT.metadata === 'string' ? JSON.parse(NFT.metadata) : NFT.metadata;
                let image = NFT && NFT.metadata ? NFT.metadata.image : "Blank";
                if (image.startsWith("ipfs://")) {
                    image = image.replace("ipfs://", "https://ipfs.io/ipfs/");
                }


                const load = await alchemy.nft.getNftMetadata(String(contract), String(NFT.tokenId),String(NFT.contract_type));
                const deployer = load.contract.contractDeployer
                const description = load.description

                const owners = await alchemy.nft.getOwnersForNft(String(contract), String(NFT.tokenId));

                nftDetails.push({
                    contract_address: contract,
                    token_id: NFT.tokenId,
                    nft_name: load.title,
                    token_type: NFT.contractType,
                    token_uri: NFT.tokenUri,
                    media_link: image,
                    deployer_address: deployer,
                    nft_description: description,
                    spam: NFT.possibleSpam,
                    owner: owners.owners
                });
                await sleep(3000);
            }
            cursor = response.pagination.cursor;
        } while (cursor != "" && cursor != null);
        
        // Add/Update NFT data in database
        for (let nft of nftDetails) {
            const existingEntry = await db.oneOrNone(
                "SELECT contract_address_token_id FROM nfts WHERE contract_address_token_id = $1",
                [nft.contract_address + nft.token_id],
            );
            if (!existingEntry) {
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
                        token_id)
                        VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
                    `,
                    [
                        nft.contract_address + nft.token_id,
                        nft.contract_address,
                        nft.owner,
                        nft.nft_name,
                        nft.token_type,
                        nft.token_uri,
                        nft.media_link,
                        nft.deployer_address,
                        nft.nft_description,
                        nft.token_id,
                    ],
                );
            }
        }
        // Send the response after processing all the NFTs
        return res.status(200).json({
            success: true,
            message: "NFTs added to database",
        });
    
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal Server Error.", error: error.message });
    }
}
