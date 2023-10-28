// pages/nft/[...slug].js
import db from "../../lib/db";
import CommentSection from "../../components/comment/Comments";
import Image from 'next/image';  // <-- Import the Image component

export async function getServerSideProps({ params }) {
    const { slug } = params;
    const nft = await db.one("SELECT * FROM nfts WHERE nft_id = $1", [slug[0]]);
    return { props: { nft } };
}

export default function NftPage({ nft }) {
    return (
        <div className="min-h-screen bg-primary flex items-center justify-center py-6 px-4 sm:px-6 lg:px-8">
            <div className="bg-secondary p-6 rounded shadow-md space-y-4 w-full max-w-2xl">
                <h1 className="text-quaternary font-heading text-3xl mb-4">
                    {nft.nft_name}
                </h1>
                <p className="text-quaternary font-body text-lg">
                    Description: {nft.nft_description}
                </p>
                <div className="relative w-full h-[500px]">  {/* Adjust height as needed */}
                <Image src={nft.media_url} alt={nft.nft_name} layout="fill" objectFit="contain" /> 
               </div>
                <CommentSection nft={nft} />
            </div>
        </div>
    );
}
