import React from "react";
import { useSession } from "next-auth/react";
import IconButton from "@mui/material/IconButton";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ThumbDownIcon from "@mui/icons-material/ThumbDown";
import useLikes from "../hooks/useLikes";

const Likes = ({ nft_id, comment_id }) => {
    const { likes, dislikes, userStatus, handleLike, handleDislike, handleUnlike } =
        useLikes(nft_id, comment_id);
    const { data: session } = useSession();

    const isUserLoggedIn = session !== null;

    const handleLikeClick = () => {
        if (userStatus === "like") {
            handleUnlike();
        } else {
            handleLike();
        }
    };

    const handleDislikeClick = () => {
        if (userStatus === "dislike") {
            handleUnlike();
        } else {
            handleDislike();
        }
    };

    return (
        <div>
            <IconButton
                onClick={handleLikeClick}
                disabled={!isUserLoggedIn || userStatus === "dislike"}
                color={userStatus === "like" ? "primary" : "default"}
            >
                <ThumbUpIcon /> {likes}
            </IconButton>
            <IconButton
                onClick={handleDislikeClick}
                disabled={!isUserLoggedIn || userStatus === "like"}
                color={userStatus === "dislike" ? "secondary" : "default"}
            >
                <ThumbDownIcon /> {dislikes}
            </IconButton>
        </div>
    );
};

export default Likes;
