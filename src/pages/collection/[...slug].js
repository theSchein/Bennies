// pages/collection/[...slug].js
// This file is used to display the Collection page.
// It grabs the collection data and shows the nfts as part of a grid.

import { useState } from "react";
import db from "../../lib/db";
import CommentSection from "../../components/comment/CommentSection";
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
        <div>
            <CollectionSidebar collection={collection} onNftsFetched={setNftData} />
            <NftGrid nftData={nftData} />
        </div>
    );
}
