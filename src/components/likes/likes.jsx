import React from 'react';
import IconButton from '@mui/material/IconButton';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import useLikes from '../hooks/useLikes';

const Likes = ({ nft_id, comment_id }) => {
    const { likes, dislikes, userLiked, userDisliked, isLoading, handleLike, handleDislike } = useLikes(nft_id, comment_id);

    return (
        <div>
            <IconButton onClick={handleLike} disabled={isLoading} color={userLiked ? "primary" : "default"}>
                <ThumbUpIcon /> {likes}
            </IconButton>
            <IconButton onClick={handleDislike} disabled={isLoading} color={userDisliked ? "secondary" : "default"}>
                <ThumbDownIcon /> {dislikes}
            </IconButton>
        </div>
    );
};

export default Likes;
