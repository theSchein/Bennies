import Image from "next/image";
import Link from "next/link";
import { getImageSource } from "@/components/utils/getImageSource";
import fallbackImageUrl from "../../../public/placeholder.png";
import EditPageButton from "../edit/editPageButton";
import IsOwner from "../check/isOwner";
import IsDeployer from "../check/isDeployer";
import NewsFeed from "../newsfeed/newsfeed";
import { useTheme } from "@mui/material/styles";

function NftTile({ nft }) {
    const theme = useTheme();
    const license = nft.license || nft.collection_licence;
    const utility = nft.utility || nft.collection_utility;
    const category = nft.category || nft.collection_category;

    const isOwner = IsOwner(nft.owners);
    const isDeployer = IsDeployer(nft.deployer_address);

    return (
        <div
            className={`bg-light-secondary dark:bg-dark-secondary bg-opacity-90 text-light-quaternary dark:text-dark-quaternary rounded-lg shadow-lg overflow-hidden transition-shadow duration-300 ease-in-out m-4`}
            style={{ width: '100%' }} // Set a minimum width and maximum width
        >
            <div className="p-4 font-heading text-lg">
                <Link
                    href={`/collection/${nft.collection_id}`}
                    passHref
                    legacyBehavior
                >
                    <a className="text-lg font-semibold text-primary hover:underline">
                        {nft.collection_name}
                    </a>
                </Link>
            </div>
            <Link
                href={`/nft/${nft.nft_id}/${nft.nft_name}`}
                passHref
                legacyBehavior
            >
                <a className="block">
                    <div className="relative w-full h-64">
                        <Image
                            src={getImageSource(nft.media_url, fallbackImageUrl)}
                            alt={nft.nft_name || "NFT Image"}
                            layout="fill"
                            objectFit="cover"
                            className="transition duration-300 ease-in-out transform hover:scale-105"
                        />
                    </div>
                    <div className="p-4 space-y-2">
                        <h2 className="text-xl font-bold break-words">
                            {nft.nft_name}
                        </h2>
                        <div className="flex justify-between items-center p-4">
                            <div className="flex items-center bg-light-tertiary dark:bg-dark-tertiary text-light-quaternary dark:text-dark-primary rounded-lg shadow px-3 py-1">
                            <p className="text-sm sm:text-md">
                                    Category:{" "}
                                    <span className="font-bold text-sm sm:text-md ">
                                        {category}
                                        </span>
                                </p>
                            </div>
                            <div className="flex items-center bg-light-tertiary dark:bg-dark-tertiary text-light-quaternary dark:text-dark-primary rounded-lg shadow px-3 py-1">
                                <p className="text-sm sm:text-md">
                                    License:{" "}
                                    <span className="font-bold text-sm sm:text-md ">
                                        {license}
                                        </span>
                                </p>
                            </div>
                        </div>

                        <div className="bg-light-tertiary dark:bg-dark-tertieary shadow-xl p-3 rounded-xl">
                            <p className="font-bold text-light-quaternary dark:text-dark-quaternary m-3">
                                Utility
                            </p>
                            <p className="font-body  text-light-quaternary dark:text-dark-quaternary break-words m-3">
                                {nft.nft_utility}
                            </p>
                        </div>
                        {isOwner || isDeployer ? (
                            <EditPageButton pageData={nft} />
                        ) : null}
                    </div>
                </a>
            </Link>
            <div className="px-4 pb-4">
                <NewsFeed
                    collectionIds={[nft.collection_id]}
                    viewingGroup="holders"
                />
            </div>
        </div>
    );
}

export default NftTile;
