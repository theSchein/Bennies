// components/collections/collectionSidebar.jsx
// Holds data for collection presentation and allows user to filter search and sort nft grid componenet

import { useEffect, useState } from "react";
import IsOwner from "../../components/check/isOwner";
import IsDeployer from "../../components/check/isDeployer";
import EditPageButton from "../../components/edit/editPageButton";


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
    console.log(allOwnerAddresses);

    // Call fetchNfts when sortOrder, sortBy, or page changes
    useEffect(() => {
        fetchNfts();
    }, [sortOrder, sortBy, page]);

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
                Owners {uniqueOwnerAddresses.length}
            </h1>

            <p className="font-body text-base sm:text-lg break-words">
                {collection.collection_description}
            </p>
        </div>
    );
};

export default CollectionSidebar;