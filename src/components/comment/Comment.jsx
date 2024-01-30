// components/comment/Comment.jsx
// This is a parent component for the commemts and has logic to create top level comments

import React, { useState } from "react";
import CommentForm from "./CommentForm";
import CommentList from "./CommentList";
import Likes from "../likes/likes";

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
            className={`ml-${depth * 5} my-2 p-4 bg-light-secondary dark:bg-dark-secondary rounded-lg shadow-xl`}
            key={comment.comment_id}
        >
            <div className="flex justify-between items-center mb-2">
                <strong className="font-semibold">{comment.commenter}</strong>
                <span className="text-sm text-light-quaternary dark:text-dark-quaternary">
                    {new Date(comment.comment_date).toLocaleDateString()}
                </span>
            </div>
            <p className="text-light-quaternary dark:text-dark-quaternary mb-4">{comment.text}</p>
            <div className="flex items-center">
                <button
                    onClick={() => setShowReplyForm(!showReplyForm)}
                    className="btn mr-2"
                >
                    {showReplyForm ? "Hide" : "Reply"}
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
                    <div className="flex justify-center">
                        <button onClick={toggleRepliesVisibility} className="btn">
                            {showReplies ? "Hide Replies" : "Show Replies"}
                        </button>
                        <Likes comment_id={comment.comment_id} />
                    </div>
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
