// pages/collection/[...slug].js
// This file is used to display the Collection page.
// It grabs the collection data and shows the nfts as part of a grid.


import db from "../../lib/db";
import CommentSection from "../../components/comment/CommentSection";
import Image from "next/image";
import NftGrid from "../../components/collections/nftGrid";



export async function getServerSideProps({ params }) {
    const { slug } = params;
    const collection = await db.one(
        "SELECT * FROM collections WHERE collection_id = $1",
        [slug[0]],
    );

    const nftData = await db.query(
        "SELECT * FROM nfts WHERE collection_id = $1",
        [slug[0]],
    );

    if (!collection) {
        return { notFound: true };
    }

    return { props: { collection, nftData } };
}


export default function CollectionPage({ collection, nftData }) {
    return (
        <div>
            <div className="text-center w-full">
                <h1 className="text-quaternary font-heading text-3xl sm:text-4xl mb-8 break-words">
                    {collection.collection_name}
                </h1>
                <p className="text-quaternary font-body text-base sm:text-lg break-words">
                    {collection.collection_description}
                </p>
            </div>
            <div>
            <NftGrid nftData={nftData} />            </div>

        </div>
    );
}
