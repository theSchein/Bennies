import React from "react";
import Comment from "./Comment";

// This function structures the comments into a nested format
function structureComments(comments, parentId = null, currentDepth = 0) {
  return comments
    .filter(comment => comment.parent_comment_id === parentId)
    .map(comment => ({
      ...comment,
      depth: currentDepth,
      replies: structureComments(comments, comment.comment_id, currentDepth + 1)
    }));
}

function CommentList({ comments, nft }) {
    // Structure comments into a nested format
    const structuredComments = structureComments(comments);

    // Recursive render function to render comments and their nested replies
    const renderComments = (comments, depth = 0) => {
        return comments.map((comment) => (
            <div key={comment.comment_id} style={{ marginLeft: `${depth * 20}px` }}>
                <Comment comment={comment} nft={nft} depth={depth} />
                {comment.replies && renderComments(comment.replies, depth + 1)}
            </div>
        ));
    };

    return (
        <div className="comment-list">
            {renderComments(structuredComments)}
        </div>
    );
}

export default CommentList;
