import Image from "next/image";
import Link from "next/link";
import { getImageSource } from "@/components/utils/getImageSource";
import fallbackImageUrl from "../../../public/placeholder.png";

function NftTile({ nft }) {
    // Default to collection's license and utility if NFT's are null
    const license = nft.license || nft.collection_licence;
    const utility = nft.utility || nft.collection_utility;
    const category = nft.category || nft.collection_category;

    return (
        <div className="bg-white bg-opacity-75 dark:bg-dark-tertiary dark:text-dark-primary rounded-lg shadow overflow-hidden hover:shadow-lg transition-shadow duration-300 ease-in-out min-w-0 m-2 w-full ">
            <div className="p-4">
                <Link href={`/collection/${nft.collection_id}`} passHref legacyBehavior>
                    <a className="text-md font-bold truncate">{nft.collection_name}</a>
                </Link>
            </div>
            <Link href={`/nft/${nft.nft_id}/${nft.nft_name}`} passHref legacyBehavior>
                <a className="block h-full">
                    <div className="w-full h-64 relative">
                        <Image
                            src={getImageSource(nft.media_url, fallbackImageUrl)}
                            alt={nft.nft_name || "Fallback Image"}
                            layout="fill"
                            objectFit="cover"
                        />
                    </div>
                    <div className="p-4">
                        <p className="text-lg font-semibold truncate">{nft.nft_name}</p>
                        <p>{nft.nft_description}</p>
                        <p>Licence: {license}</p>
                        <p>Utility: {utility}</p>
                        <p>Category: {category}</p>
                    </div>
                </a>
            </Link>
        </div>
    );
}

export default NftTile;
