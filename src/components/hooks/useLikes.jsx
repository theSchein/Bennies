import { useState, useEffect, useCallback } from "react";


const useLikes = (nft_id, comment_id) => {
    const [likes, setLikes] = useState(0);
    const [dislikes, setDislikes] = useState(0);
    const [userStatus, setUserStatus] = useState(null);


    const fetchLikes = useCallback(async () => {
        try {
            const response = await fetch(
                `/api/likes/fetchLikes?${nft_id ? `nft_id=${nft_id}` : `comment_id=${comment_id}`}`,
            );
            const data = await response.json();
            if (response.ok) {
                setLikes(data.likes);
                setDislikes(data.dislikes);
                setUserStatus(data.userStatus); 
            } else {
                throw new Error(data.error || "Failed to fetch likes/dislikes");
            }
        } catch (error) {
            console.error("Fetch Likes Error:", error);
        }
    }, [nft_id, comment_id]);

    useEffect(() => {
        fetchLikes();
    }, [fetchLikes]);

    const handleLike = async () => {
        try {
            const bodyData = {
                like_dislike: "like",
            };
            if (nft_id) {
                bodyData.nft_id = nft_id;
            } else if (comment_id) {
                bodyData.comment_id = comment_id;
            } else {
                throw new Error("No valid identifier provided for like action");
            }

            const response = await fetch("/api/likes/addLike", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(bodyData),
            });

            const data = await response.json();
            if (response.ok) {
                fetchLikes();
            } else {
                throw new Error(data.error || "Failed to add like");
            }
        } catch (error) {
            console.error("Add Like Error:", error);
        }
    };

    const handleDislike = async () => {
        try {
            const response = await fetch("/api/likes/addLike", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    nft_id,
                    comment_id,
                    like_dislike: "dislike",
                }),
            });
            const data = await response.json();
            if (response.ok) {
                fetchLikes();
            } else {
                throw new Error(data.error || "Failed to add dislike");
            }
        } catch (error) {
            console.error("Add Dislike Error:", error);
        }
    };

    const handleUnlike = async () => {
        try {
            const response = await fetch("/api/likes/removeLike", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    nft_id,
                    comment_id,
                }),
            });
            const data = await response.json();
            if (response.ok) {
                fetchLikes();
            } else {
                throw new Error(data.error || "Failed to remove like");
            }
        } catch (error) {
            console.error("Remove Like Error:", error);
        }

    };

    return {
        likes,
        dislikes,
        userStatus,
        handleLike,
        handleDislike,
        handleUnlike
    };
};

export default useLikes;
