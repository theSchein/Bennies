import db from "../../../lib/db";

async function addCollectionToDatabase(collectionData) {
    console.log("Collection Data:", collectionData);

    // Attempt to find an existing collection entry
    let collection = await db.oneOrNone(
        "SELECT collection_id FROM collections WHERE contract_address = $1",
        [collectionData.contract_address]
    );

    // If the collection doesn't exist, insert it
    if (!collection) {
        await db.none(
            `INSERT INTO collections (contract_address, collection_name, token_type, num_collection_items, deployer_address)
             VALUES ($1, $2, $3, $4, $5)`,
            [
                collectionData.contract_address,
                collectionData.collection_name,
                collectionData.token_type,
                collectionData.num_collection,
                collectionData.deployer,
            ]
        );

        // Retrieve the collection_id of the newly inserted collection
        collection = await db.one(
            "SELECT collection_id FROM collections WHERE contract_address = $1",
            [collectionData.contract_address]
        );
    }

    console.log("Processed collection in database:", collectionData.collection_name);
    return collection.collection_id; // Ensure this returns the actual collection_id
}


async function addNftToDatabase(nftData) {
    // Check if the entry already exists in the database
    const existingEntry = await db.oneOrNone(
        "SELECT contract_address_token_id FROM nfts WHERE contract_address_token_id = $1",
        [nftData.contract_address + nftData.token_id],
    );
    console.log("Existing Entry:", existingEntry);  

    if (!existingEntry) {

        const ownersArray = Array.isArray(nftData.owner) ? nftData.owner : [nftData.owner];
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
                ownersArray,
                nftData.nft_name,
                nftData.token_type,
                nftData.token_uri,
                nftData.media_link,
                nftData.deployer_address,
                nftData.nft_description,
                nftData.token_id,
                nftData.collectionId,
            ],
        );
    }
    console.log("Added NFT to database:", nftData);
}

export { addCollectionToDatabase, addNftToDatabase };
