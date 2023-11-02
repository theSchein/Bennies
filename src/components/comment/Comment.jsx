import React, { useState } from "react";
import CommentForm from "./CommentForm";
import CommentList from "./CommentList";

// Individual Comment component and its nested replies
function Comment({ comment, addReply, nft }) {
    const [showReplyForm, setShowReplyForm] = useState(false);
    const [nestedText, setNestedText] = useState("");

    console.log('full comment:' + JSON.stringify(comment));

    const handleNestedSubmit = (e) => {
        e.preventDefault();

        const data = {
            nft_id: nft.nft_id,
            text: nestedText,
            parentCommentId: comment.parent_comment_id,
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
        <div style={{ marginLeft: "20px" }} key={comment.comment_id}>
            <strong>{comment.commenter}</strong>
            <p>{comment.text}</p>
            <span>{new Date(comment.commentdate).toLocaleDateString()}</span>
            <button onClick={() => setShowReplyForm(!showReplyForm)}>Reply</button>
            {/* Render replies if they exist */}
            {comment.replies && comment.replies.length > 0 && (
                <div className="replies">
                    <CommentList comments={comment.replies} />
                </div>
            )}
            {showReplyForm && (
                <CommentForm
                    onSubmit={handleNestedSubmit}
                    text={nestedText}
                    setText={setNestedText}
                />
            )}
            {comment.replies && (
                <CommentList
                    comments={comment.replies}
                    nft={nft}
                    addReply={addReply}
                />
            )}
        </div>
    );
}

export default Comment;
