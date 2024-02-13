// components/collections/collectionSidebar.jsx
// Holds data for collection presentation and allows user to filter search and sort nft grid componenet

import { useEffect, useState } from "react";
import IsOwner from "../../components/check/isOwner";
import IsDeployer from "../../components/check/isDeployer";
import EditPageButton from "../../components/edit/editPageButton";
import MakeNews from "../newsfeed/makeNews";
import NewsFeed from "../newsfeed/newsfeed";

const CollectionSidebar = ({ collection, onNftsFetched }) => {
    const [nftData, setNftData] = useState([]);
    const [sortOrder, setSortOrder] = useState("ASC");
    const [sortBy, setSortBy] = useState("token_id");
    const [page, setPage] = useState(1);

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
    const isDeployer = IsDeployer(collection.deployer_address);

    // Call fetchNfts when sortOrder, sortBy, or page changes
    useEffect(() => {
        fetchNfts();
    }, [sortOrder, sortBy, page, collection.collection_id]);

    return (
        <div>
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
                Items {collection.num_collection_items}
            </h1>
            <h1 className="font-heading text-3xl sm:text-4xl mb-8 break-words">
                Holders {uniqueOwnerAddresses.length}
            </h1>
            <p className="font-body text-base sm:text-lg break-words">
                {collection.collection_description}
            </p>
            <div>
                <label htmlFor="sortBy">Sort By:</label>
                <select
                    id="sortBy"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                >
                    <option value="token_id">Token ID</option>
                    <option value="like_count">Likes</option>
                    <option value="comment_count">Comments</option>
                </select>
            </div>
            <div>
                <label htmlFor="sortOrder">Order:</label>
                <select
                    id="sortOrder"
                    value={sortOrder}
                    onChange={(e) => setSortOrder(e.target.value)}
                >
                    <option value="ASC">Low to High</option>
                    <option value="DESC">High to Low</option>
                </select>
            </div>
            {isDeployer && <MakeNews collectionId={collection.collection_id} />}
            <NewsFeed collectionId={collection.collection_id} />
        </div>
    );
};

export default CollectionSidebar;
