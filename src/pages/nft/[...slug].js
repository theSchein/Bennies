// pages/nft/[...slug].js
// This file is used to display the NFT page.
// It grabs the nft metadata by slug from the database.

import db from "../../lib/db";
import NftDetails from "../../components/nft/nftDetails"; // Import the new component

export async function getServerSideProps({ params }) {
    const { slug } = params;
    const nftDataQuery = `
    SELECT nfts.*, 
    collections.collection_name, 
    collections.collection_description AS collection_description,
    collections.collection_utility AS collection_utility,
    collections.category AS collection_category,
    collections.nft_licence AS collection_licence
    FROM nfts
    LEFT JOIN collections ON nfts.collection_id = collections.collection_id
    WHERE nft_id = $1;
    `;
    try {
        let nft = await db.one(nftDataQuery, [slug[0]]);
        nft = {
            ...nft,
            nft_description: nft.nft_description || nft.collection_description,
            nft_utility: nft.nft_utility || nft.collection_utility,
            nft_category: nft.category || nft.collection_category,
            nft_licence: nft.nft_licence || nft.collection_licence,
        };
        delete nft.collection_description;
        delete nft.collection_utility;
        delete nft.collection_category;
        delete nft.collection_licence;

        return { props: { nft } };
    } catch (error) {
        console.error("Error fetching NFT data:", error);
        return { props: { error: "NFT not found" } };
    }
}

export default function NftPage({ nft }) {

    return (
        <div
            className=" 
    bg-gradient-light dark:bg-gradient-dark
    text-light-font dark:text-dark-quaternary"
        >
            <NftDetails nft={nft} />
        </div>
    );
}
