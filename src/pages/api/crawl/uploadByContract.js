// pages/api/crawl/uploadByContract.js
// This nifty api takes a contract address and adds the nft and collection data to the database.

import { tokenIdFinder, fetchTokenMetadata } from "./nodeCalls";
import  { addCollectionToDatabase, addNftToDatabase } from "./databaseOperations";
import {fetchCollectionData} from "./externalApiCalls";

async function sleep(milliseconds) {
    return new Promise(resolve => setTimeout(resolve, milliseconds));
}

export default async function uploadByContract(req, res) {
    if (req.method !== "GET") {
        return res.status(405).json({ message: "Method Not Allowed" });
    }

    const contract = req.query.contract;
    if (!contract) {
        return res.status(400).json({ message: "Contract address query parameter is required." });
    }

    const contractType = req.query.contractType;
    if (!contractType) {
        return res.status(400).json({ message: "Contract type query parameter is required." });
    }
    console.log("Processing contract:", contractType);




    try {

        const collectionData = await fetchCollectionData(contract);
        if (!collectionData) {
            console.error("Failed to fetch collection data");
            return res.status(500).json({ message: "Failed to fetch collection data" });
        }
    
        const collectionId = await addCollectionToDatabase(collectionData);
        if (!collectionId) {
            console.error("Failed to add or find collection in database");
            return res.status(500).json({ message: "Failed to process collection" });
        }


        

        // Fetch token IDs for the contract
        const  tokenIds  = await tokenIdFinder(contract, contractType);
        if (!tokenIds || tokenIds.length === 0) {
            return res.status(404).json({ message: "No token IDs found for the given contract address." });
        }

        // Process each token ID
        for (const tokenId of tokenIds) {
            console.log(`Processing token ${tokenId} of contract ${contract}`);
            const metadata = await fetchTokenMetadata(contract, tokenId, contractType);
            if (!metadata) {
                console.error(`Failed to fetch metadata for token ${tokenId} of contract ${contract}`);
                continue; // Skip to the next token if metadata could not be fetched
            }


            // Prepare and add NFT data to the database
            const nftData = {
                contract_address: contract,
                token_id: tokenId.toString(),
                nft_name: metadata.name,
                token_type: contractType,
                token_uri: metadata.tokenURI,
                media_link: metadata.image,
                deployer_address:  collectionData.deployer, 
                nft_description: metadata.description,
                owner: metadata.owner, 
                collection_id: collectionId, 
            };

            await addNftToDatabase(nftData);
            await sleep(50); //50ms respite to avoid rate limiting
        }

        return res.status(200).json({
            success: true,
            message: "NFTs processed and added to database",
        });
    } catch (error) {
        console.error("Error processing contract:", error);
        return res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
}