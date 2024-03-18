// pages/api/processNftImages.js
import db from "../../../lib/db";
import uploadFileToSpaces from "./uploadFileToSpaces"; 

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).end("Method Not Allowed");
    }

    try {
        const nftsToProcess = await db.any(`
            SELECT * FROM nfts WHERE media_url NOT LIKE 'https://shuk.nyc3.cdn.digitaloceanspaces.com/%'
        `);

        let processedCount = 0;
        const maxProcessCount = 10000; // Limit to 5000 NFTs to avoid timeouts

        for (const nft of nftsToProcess) {
            if (processedCount >= maxProcessCount) {
                break; // Stop processing if the limit is reached
            }

            const newImageUrl = await uploadFileToSpaces(nft.media_url, `${nft.contract_address}/${nft.token_id}`);
            await db.none(`
                UPDATE nfts SET media_url = $1 WHERE nft_id = $2
            `, [newImageUrl, nft.nft_id]);

            processedCount++; // Increment the counter after each successful process
        }

        res.status(200).json({ message: `Processed ${processedCount} NFT images successfully.` });
    } catch (error) {
        console.error("Failed to process NFT images:", error);
        res.status(500).json({ error: "Failed to process NFT images" });
    }
}
