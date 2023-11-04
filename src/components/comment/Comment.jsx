import React, { useState } from "react";
import CommentForm from "./CommentForm";
import CommentList from "./CommentList";

// Individual Comment component
function Comment({ comment, addReply, nft, depth=0 }) {
    const [showReplyForm, setShowReplyForm] = useState(false);
    const [nestedText, setNestedText] = useState("");

    const handleNestedSubmit = (e) => {
        e.preventDefault();

        const data = {
            nft_id: nft.nft_id,
            text: nestedText,
            parentCommentId: comment.comment_id,
        };

        fetch("/api/comments/createComments", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                credentials: "include",
            },
            body: JSON.stringify({ data }),
        })
            .then((response) => response.json())
            .then((newReply) => {
                setNestedText("");
                addReply(comment.comment_id, newReply);
            })
            .catch((error) =>
                console.error(
                    "There was an error saving the nested comment:",
                    error,
                ),
            );
    };

    return (
        <div style={{ marginLeft: `${depth * 20}px`}} key={comment.comment_id}>            
        <strong>{comment.commenter}</strong>
            <p>{comment.text}</p>
            <span>{new Date(comment.commentdate).toLocaleDateString()}</span>
            <button onClick={() => setShowReplyForm(!showReplyForm)}>Reply</button>
            {showReplyForm && (
                <CommentForm
                    onSubmit={handleNestedSubmit}
                    text={nestedText}
                    setText={setNestedText}
                />
            )}
            {comment.parent_comment_id && (
                <CommentList
                    comments={comment.replies}
                    nft={nft}
                    depth={depth + 1}
                    addReply={addReply}
                />
            )}
        </div>
    );
}

export default Comment;
