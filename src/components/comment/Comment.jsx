// components/comment/Comment.jsx
// This is a parent component for the commemts and has logic to create top level comments

import React, { useState } from "react";
import CommentForm from "./CommentForm";
import CommentList from "./CommentList";

// Individual Comment component
function Comment({ comment, addReply, nft, depth, toggleReloadComments }) {
    const [showReplyForm, setShowReplyForm] = useState(false);
    const [nestedText, setNestedText] = useState("");
    const [showReplies, setShowReplies] = useState(true);

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
                toggleReloadComments();
                addReply(comment.comment_id, newReply);
            })
            .catch((error) => console.error("Error saving nested comment:", error));
    };

    const toggleRepliesVisibility = () => {
        setShowReplies(!showReplies); 
    };

    return (

        <div
            className={`ml-${depth * 5} my-2 p-4 bg-gray-100 rounded-lg shadow`}
            key={comment.comment_id}
        >
            <div className="flex justify-between items-center mb-2">
                <strong className="font-semibold">{comment.commenter}</strong>
                <span className="text-sm text-gray-600">
                    {new Date(comment.comment_date).toLocaleDateString()}
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
                <>
                    <button onClick={toggleRepliesVisibility} className="text-blue-500 hover:text-blue-700 text-sm font-medium">
                        {showReplies ? "Hide Replies" : "Show Replies"}
                    </button>
                    {showReplies && (
                        <CommentList
                            comments={comment.replies}
                            nft={nft}
                            depth={depth + 1}
                            addReply={addReply}
                            toggleReloadComments={toggleReloadComments}
                        />
            )}
                </>
            )}
        </div>
    );
}

export default Comment;
