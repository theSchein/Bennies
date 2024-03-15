// createUniverse.js
// API that creates a universe and updates NFTs accordingly

import db from "../../../lib/db";
import fetchMetadata from "../../../components/utils/fetchMetadata";

function getCollectionNameFromMetadata(metadata) {
    if (!metadata || !Array.isArray(metadata.attributes)) {
        console.error("Invalid metadata or missing attributes");
        return null;
    }

    const collectionAttribute = metadata.attributes.find(attr => attr.trait_type === "Collection Name");
    return collectionAttribute ? collectionAttribute.value : null;
}

export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).end("Method Not Allowed");
    }

    const { address, name, separator } = req.body;

    try {
        let universe = await db.oneOrNone(
            "INSERT INTO universes (contract_address, name) VALUES ($1, $2) ON CONFLICT (contract_address) DO UPDATE SET name = EXCLUDED.name RETURNING universe_id",
            [address, name],
        );

        const universeId = universe.universe_id;

        const nftsToUpdate = await db.manyOrNone(
            "SELECT nft_id, token_uri_gateway FROM nfts WHERE contract_address = $1",
            [address],
        );

        const collectionCache = {};

        for (const nft of nftsToUpdate) {
            const metadata = await fetchMetadata(nft.token_uri_gateway);
            if (!metadata) {
                console.log(`Skipping NFT ${nft.nft_id} due to failed metadata fetch.`);
                continue; // Skip this NFT if metadata couldn't be fetched
            }

            const collectionName = getCollectionNameFromMetadata(metadata);
            if (!collectionName) {
                console.log(`Skipping NFT ${nft.nft_id} due to missing collection name.`);
                continue;
            }

            if (!collectionCache[collectionName]) {
                console.log(`Creating collection ${collectionName} for universe ${universeId}`);
                let collection = await db.oneOrNone(
                    "INSERT INTO collections (collection_name, universe_id, contract_address, deployer_address, token_type) VALUES ($1, $2, $3, $4, $5) ON CONFLICT (collection_name, universe_id) DO NOTHING RETURNING collection_id",
                    [collectionName, universeId, address, nft.deployer_address, nft.token_type],
                );

                if (!collection) {
                    collection = await db.one(
                        "SELECT collection_id FROM collections WHERE collection_name = $1 AND universe_id = $2",
                        [collectionName, universeId],
                    );
                }
                collectionCache[collectionName] = collection.collection_id;
            }

            await db.none(
                "UPDATE nfts SET collection_id = $1, universe_id = $2 WHERE nft_id = $3",
                [collectionCache[collectionName], universeId, nft.nft_id],
            );
            console.log(`NFT ${nft.nft_id} updated to collection ${collectionName}`);
        }

        res.status(200).json({
            message: "Universe and NFTs updated successfully",
            universeId,
        });
    } catch (error) {
        console.error("Failed to process universe:", error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
}
