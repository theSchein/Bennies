import db from "../../../lib/db";
import uploadFileToSpaces from "../../../lib/crawl/uploadFileToSpaces";


async function processNftImages() {
    try {
        // Fetch NFTs with images that haven't been uploaded to Spaces yet
        // Adjust the query based on your database schema and conditions
        const nftsToProcess = await db.any(`
            SELECT * FROM nfts WHERE media_url NOT LIKE 'https://shuk.nyc3.cdn.digitaloceanspaces.com/%'
        `);

        for (const nft of nftsToProcess) {
            const newImageUrl = await uploadFileToSpaces(nft.media_url, `${nft.contract_address}/${nft.token_id}`);
            // Update the NFT entry with the new image URL
            await db.none(`
                UPDATE nfts SET media_url = $1 WHERE nft_id = $2
            `, [newImageUrl, nft.nft_id]);
            console.log(`Updated NFT ${nft.nft_id} with new image URL: ${newImageUrl}`);
        }
    } catch (error) {
        console.error("Failed to process NFT images:", error);
    }
}

processNftImages().then(() => console.log("Finished processing NFT images."));