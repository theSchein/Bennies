// components/collections/collectionSidebar.jsx
// Holds data for collection presentation and allows user to filter search and sort nft grid componenet

import { useEffect, useState } from "react";
import IsOwner from "../../components/check/isOwner";
import IsCollector from "../check/isCollector";
import IsDeployer from "../../components/check/isDeployer";
import EditPageButton from "../../components/edit/editPageButton";
import MakeNews from "../newsfeed/makeNews";
import NewsFeed from "../newsfeed/newsfeed";

const CollectionSidebar = ({ collection, onNftsFetched }) => {
    const [nftData, setNftData] = useState([]);
    const [sortOrder, setSortOrder] = useState("ASC");
    const [sortBy, setSortBy] = useState("token_id");
    const [page, setPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState("");

    const fetchNfts = async () => {
        const query = `?collection_id=${collection.collection_id}&sort_by=${sortBy}&sort_order=${sortOrder}&page=${page}`;
        const response = await fetch(`/api/nft/fetchCollectionNfts${query}`);
        if (response.ok) {
            const data = await response.json();
            onNftsFetched(data);
            setNftData(data);
        }
    };
    const allOwnerAddresses = nftData.map((nft) => nft.owners).flat();
    const uniqueOwnerAddresses = [...new Set(allOwnerAddresses)];
    const isOwner = IsOwner(uniqueOwnerAddresses);
    const isCollector = IsCollector(allOwnerAddresses);
    const isDeployer = IsDeployer(collection.deployer_address);

    let viewingGroup = "public"; // Default viewing group
    if (isOwner) {
        viewingGroup = "holders";
    }
    if (isDeployer || isCollector) {
        viewingGroup = "collectors";
    }

    // Call fetchNfts when sortOrder, sortBy, or page changes
    useEffect(() => {
        fetchNfts();
    }, [sortOrder, sortBy, page, collection.collection_id]);

    return (
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow space-y-4">
            <h1 className="font-heading text-3xl sm:text-4xl text-center mb-4">
                {collection.collection_name}
            </h1>
            <div className="text-center">
                <EditPageButton
                    isOwner={isOwner}
                    isDeployer={isDeployer}
                    pageData={collection}
                />
            </div>
            <h2 className="font-heading text-xl sm:text-2xl text-center mb-4">
                Items: {collection.num_collection_items}
            </h2>
            <h3 className="font-heading text-xl sm:text-2xl text-center mb-4">
                Holders: {collection.num_owners}
            </h3>
            <h3 className="font-heading text-xl sm:text-2xl text-center mb-4">
                Likes: {collection.num_likes}
            </h3>
            <p className="font-body text-base sm:text-lg text-center mb-4">
                {collection.collection_description}
            </p>
            <div className="space-y-2">
                <div className="flex justify-between items-center">
                    <label
                        htmlFor="sortBy"
                        className="block text-gray-700 dark:text-gray-300"
                    >
                        Sort By:
                    </label>
                    <select
                        id="sortBy"
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    >
                        <option value="token_id">Token ID</option>
                        <option value="like_count">Likes</option>
                        <option value="comment_count">Comments</option>
                    </select>
                </div>
                <div className="flex justify-between items-center">
                    <label
                        htmlFor="sortOrder"
                        className="block text-gray-700 dark:text-gray-300"
                    >
                        Order:
                    </label>
                    <select
                        id="sortOrder"
                        value={sortOrder}
                        onChange={(e) => setSortOrder(e.target.value)}
                        className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    >
                        <option value="ASC">Low to High</option>
                        <option value="DESC">High to Low</option>
                    </select>
                </div>
                <div className="mb-4">
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search within collection..."
                        className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                    <button
                        onClick={() => fetchNfts()}
                        className="mt-2 w-full btn"
                    >
                        Search
                    </button>
                </div>
            </div>
            {isDeployer && <MakeNews collectionId={collection.collection_id} />}
            <NewsFeed
                collectionIds={[collection.collection_id]}
                viewingGroup={viewingGroup}
            />
        </div>
    );
};

export default CollectionSidebar;
