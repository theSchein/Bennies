// components/comment/Comment.jsx
// This is a parent component for the commemts and has logic to create top level comments

import React, { useState } from "react";
import CommentForm from "./CommentForm";
import CommentList from "./CommentList";

// Individual Comment component
function Comment({ comment, addReply, nft, depth }) {
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
            .catch((error) => console.error("Error saving nested comment:", error));
    };

    return (

        <div
            className={`ml-${depth * 5} my-2 p-4 bg-gray-100 rounded-lg shadow`}
            key={comment.comment_id}
        >
            <div className="flex justify-between items-center mb-2">
                <strong className="font-semibold">{comment.commenter}</strong>
                <span className="text-sm text-gray-600">
                    {new Date(comment.commentdate).toLocaleDateString()}
                </span>
            </div>
            <p className="text-gray-800 mb-4">{comment.text}</p>
            <div className="flex items-center">
                <button
                    onClick={() => setShowReplyForm(!showReplyForm)}
                    className="bg-gray-300 hover:bg-gray-400 text-gray-800 py-1 px-3 rounded transition-colors duration-200 ease-in-out text-sm font-medium mr-4"
                >
                    Reply
                </button>
                {showReplyForm && (
                    <CommentForm
                        onSubmit={handleNestedSubmit}
                        text={nestedText}
                        setText={setNestedText}
                    />
                )}
            </div>
            {comment.replies && comment.replies.length > 0 && (
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
