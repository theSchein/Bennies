// pages/nft/[...slug].js
import { useState } from "react";
import db from "../../lib/db";
import CommentSection from "../../components/comment/Comments";
import Image from 'next/image';  


export async function getServerSideProps({ params }) {
    const { slug } = params;
    const nft = await db.one("SELECT * FROM nfts WHERE nft_id = $1", [slug[0]]);
    return { props: { nft } };
}

export default function NftPage({ nft }) {
    const [isModalOpen, setModalOpen] = useState(false);

    const handleModalToggle = () => {
        setModalOpen(!isModalOpen);
    };


    return (
        <div className="min-h-screen bg-primary flex flex-col items-center justify-center py-6 px-4 sm:px-6 lg:px-8 space-y-6"> {/* Added flex-col and space-y-6 */}
            <div className="text-center"> {/* Added text-center */}
                <h1 className="text-quaternary font-heading text-3xl mb-6"> {/* Increased margin-bottom */}
                    {nft.artist_name}
                </h1>
            </div>
            <div className="bg-secondary p-6 rounded shadow-md space-y-4 w-full max-w-2xl">
                <h1 className="text-quaternary font-heading text-3xl mb-4">
                    {nft.nft_name}
                </h1>
                <p className="text-quaternary font-body text-lg">
                    {nft.nft_description}
                </p>
                <div className="relative w-full h-[500px]">  {/* Adjust height as needed */}
                    <Image src={nft.media_url} alt={nft.nft_name} layout="fill" objectFit="contain" /> 
                </div>
                <div>
            <h2 className="text-quaternary font-heading text-2xl mb-4">
                    {nft.owners.length === 1 ? "Owner:" : "Owners:"}
                            {nft.owners.length > 5 ? (
                    <span onClick={handleModalToggle} className="cursor-pointer underline">
                        {nft.owners.length} owners (Click to view all)
                    </span>
                ) : (
                    nft.owners.join(', ')
                )}
            </h2>

            {isModalOpen && (
                <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white p-4 rounded shadow-lg max-w-xl w-full max-h-[400px] overflow-y-auto relative">
                        <button 
                            onClick={handleModalToggle} 
                            className="absolute top-2 right-2 text-xl font-bold"
                        >
                            &times;
                        </button>
                        <h3 className="text-2xl mb-4">Owners</h3>
                        <ul>
                            {nft.owners.map((owner, index) => (
                                <li key={index} className="mb-2">{owner}</li>
                            ))}
                        </ul>
                    </div>
                </div>
            )}
        </div>

                <h2 className="text-quaternary font-heading text-2xl mb-4">
                    Deployer: {nft.deployer_address}
                </h2>
                <CommentSection nft={nft} />
            </div>
        </div>
    );
}

