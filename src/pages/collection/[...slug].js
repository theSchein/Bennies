// pages/collection/[...slug].js
// This file is used to display the Collection page.
// It grabs the collection data and shows the nfts as part of a grid.

import { useState } from "react";
import db from "../../lib/db";
import CollectionSidebar from "../../components/collections/collectionSidebar";
import NftGrid from "../../components/collections/nftGrid";

export async function getServerSideProps({ params }) {
    const { slug } = params;
    const collection = await db.one(
        "SELECT * FROM collections WHERE collection_id = $1",
        [slug[0]],
    );

    if (!collection) {
        return { notFound: true };
    }

    return { props: { collection } };
}

export default function CollectionPage({ collection }) {
    const [nftData, setNftData] = useState([]);

    return (
        <div className="min-h-screen bg-primary flex flex-col sm:flex-row items-start justify-start py-6 px-4 sm:px-6 lg:px-8 space-y-6 sm:space-y-0 sm:space-x-6 bg-gradient-light dark:bg-gradient-dark text-light-quaternary dark:text-dark-quaternary">
            <div className="flex-none w-full sm:w-72 md:w-80 lg:w-96">
                <CollectionSidebar
                    collection={collection}
                    onNftsFetched={setNftData}
                />
            </div>
            <div className="flex-grow">
                <NftGrid nftData={nftData} />
            </div>
        </div>
    );
}
