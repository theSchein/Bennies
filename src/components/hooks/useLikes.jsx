import { useState, useEffect, useCallback } from "react";

const useLikes = (nft_id, comment_id) => {
    const [likes, setLikes] = useState(0);
    const [dislikes, setDislikes] = useState(0);
    const [userLiked, setUserLiked] = useState(false);
    const [userDisliked, setUserDisliked] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    // Handle like action
    const fetchLikes = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await fetch(
                `/api/likes/fetchLikes?${nft_id ? `nft_id=${nft_id}` : `comment_id=${comment_id}`}`,
            );
            const data = await response.json();
            if (response.ok) {
                setLikes(data.likes);
                setDislikes(data.dislikes);
                // Update userLiked and userDisliked based on the response
                // This depends on how your API indicates the current user's like/dislike status
            } else {
                throw new Error(data.error || "Failed to fetch likes/dislikes");
            }
        } catch (error) {
            console.error("Fetch Likes Error:", error);
        }
        setIsLoading(false);
    }, [nft_id, comment_id]);

    useEffect(() => {
        fetchLikes();
    }, [fetchLikes]);

    const handleLike = async () => {
        setIsLoading(true);
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
                // Assuming the API returns the updated likes count
                setLikes(data.likes);
                setUserLiked(true);
                setUserDisliked(false);
                fetchLikes();
            } else {
                throw new Error(data.error || "Failed to add like");
            }
        } catch (error) {
            console.error("Add Like Error:", error);
        }
        setIsLoading(false);
    };

    // Handle dislike action
    const handleDislike = async () => {
        setIsLoading(true);
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
                // Update dislikes count and userDisliked status
                // Adjust the count based on the response
            } else {
                throw new Error(data.error || "Failed to add dislike");
            }
        } catch (error) {
            console.error("Add Dislike Error:", error);
        }
        setIsLoading(false);
    };

    return {
        likes,
        dislikes,
        userLiked,
        userDisliked,
        isLoading,
        handleLike,
        handleDislike,
    };
};

export default useLikes;
