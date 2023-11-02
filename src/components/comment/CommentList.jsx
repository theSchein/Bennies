import React from "react";
import Comment from "./Comment";
import { structureComments } from './CommentUtils';


function CommentList({ comments, nft, addReply }) {
    const structuredComments = structureComments(comments);

    return (
        <div className="comment-list">
            {structuredComments.map((comment) => (
                <Comment key={comment.comment_id} comment={comment} nft={nft} addReply={addReply} />
            ))}
        </div>
    );
}

export default CommentList;
