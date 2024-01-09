// components/comment/CommentList.jsx
// This component renders the comments

import React from "react";
import Comment from "./Comment";

function structureComments(comments, parentId = null, currentDepth = 0) {
    // Filter comments based on whether their parent_comment_id matches the current parentId
    const filteredComments = comments.filter(
        (comment) => comment.parent_comment_id === parentId,
    );
    // Map over these filtered comments
    return filteredComments.map((comment) => {
        // For each comment, find its replies by recursively calling structureComments
        const replies = structureComments(
            comments,
            comment.comment_id,
            currentDepth + 1,
        );

        return {
            ...comment,
            depth: currentDepth,
            replies: replies,
        };
    });
}

function CommentList({ comments, nft, toggleReloadComments }) {
    const renderComments = (comments, depth = 0) => {
        return comments.map((comment) => (
            <div key={comment.comment_id} style={{ marginLeft: `${depth * 20}px` }}>
                <Comment comment={comment} nft={nft} depth={depth} toggleReloadComments={toggleReloadComments} />
            </div>
        ));
    };

    return <div className="comment-list">{renderComments(comments)}</div>;
}

export default CommentList;
