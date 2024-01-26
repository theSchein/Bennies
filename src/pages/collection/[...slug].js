// pages/collection/[...slug].js
// This file is used to display the Collection page.
// It grabs the collection data and shows the nfts as part of a grid.

import db from "../../lib/db";
import CommentSection from "../../components/comment/CommentSection";
import Image from "next/image";
import NftGrid from "../../components/collections/nftGrid";
import EditPageButton from "../../components/edit/editPageButton";
import IsOwner from "../../components/check/isOwner";
import IsDeployer from "@/components/check/isDeployer";

export async function getServerSideProps({ params }) {
    const { slug } = params;
    const collection = await db.one(
        "SELECT * FROM collections WHERE collection_id = $1",
        [slug[0]],
    );

    const nftData = await db.query("SELECT * FROM nfts WHERE collection_id = $1", [
        slug[0],
    ]);

    if (!collection) {
        return { notFound: true };
    }

    return { props: { collection, nftData } };
}

export default function CollectionPage({ collection, nftData }) {
    const allOwnerAddresses = nftData.map((nft) => nft.owners).flat();
    const isOwner = IsOwner(allOwnerAddresses);
    const isDeployer = IsDeployer(collection.deployer_address);

    return (
        <div
            className="min-h-screen bg-primary flex flex-col items-center justify-center
        py-6 px-4 sm:px-6 lg:px-8 space-y-6 bg-gradient-light dark:bg-gradient-dark
         text-light-quaternary dark:text-dark-quaternary"
        >
            <div className="flex bg-light-primary dark:bg-dark-primary flex-col items-center justify-center mt-5 space-y-4">
                <h1 className="font-heading text-3xl sm:text-4xl m-8 break-words">
                    {collection.collection_name}
                </h1>
                <h2 className="text-xl sm:text-2xl break-words">
                    <EditPageButton
                        isOwner={isOwner}
                        isDeployer={isDeployer}
                        pageData={collection}
                    />
                </h2>
                <h1 className="font-heading text-3xl sm:text-4xl mb-8 break-words">
                    {collection.num_collection_items}
                </h1>
                <p className="font-body text-base sm:text-lg break-words">
                    {collection.collection_description}
                </p>
                <div className="font-bold">
                    <NftGrid nftData={nftData} />
                </div>
            </div>
        </div>
    );
}
