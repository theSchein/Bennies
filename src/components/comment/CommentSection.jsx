// components/comment/CommentSection.jsx
// This is a higher level component for rendering the comment section

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import CommentForm from "./CommentForm.jsx";
import CommentList from "./CommentList.jsx";
import { structureComments } from "./CommentUtils.jsx";

// Main container that fetches comments and handles submission of top level comments
function CommentSection({ nft }) {
    const { data: session } = useSession();
    const [comments, setComments] = useState([]);
    const [text, setText] = useState("");
    const [reloadComments, setReloadComments] = useState(false);

    const nft_id = nft.nft_id;
    const parentCommentId = null;
    const data = { text, nft_id, parentCommentId };

    useEffect(() => {
        async function fetchComments() {
            try {
                const response = await fetch(
                    `/api/comments/fetchComments?nft_id=${nft_id}`,
                );
                const data = await response.json();
                const structuredData = structureComments(data);
                setComments(structuredData);
            } catch (error) {
                console.error("There was an error fetching the comments", error);
            }
        }
        fetchComments();
    }, [nft_id, reloadComments]);

    const addReplyToComment = (parentCommentId, newReply) => {
        setComments((currentComments) => {
            const updatedComments = currentComments.map((comment) => {
                if (comment.comment_id === parentCommentId) {
                    // Update the replies for the direct parent comment
                    const updatedReplies = comment.replies
                        ? [...comment.replies, newReply]
                        : [newReply];
                    return { ...comment, replies: updatedReplies };
                } else if (comment.replies) {
                    // Recursively update replies for nested comments
                    return {
                        ...comment,
                        replies: addReplyToNestedComments(
                            comment.replies,
                            parentCommentId,
                            newReply,
                        ),
                    };
                }
                return comment;
            });
            return updatedComments;
        });
    };

    const addReplyToNestedComments = (comments, parentCommentId, newReply) => {
        return comments.map((comment) => {
            if (comment.comment_id === parentCommentId) {
                const updatedReplies = comment.replies
                    ? [...comment.replies, newReply]
                    : [newReply];
                return { ...comment, replies: updatedReplies };
            } else if (comment.replies) {
                return {
                    ...comment,
                    replies: addReplyToNestedComments(
                        comment.replies,
                        parentCommentId,
                        newReply,
                    ),
                };
            }
            return comment;
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const data = {
            nft_id: nft.nft_id,
            text,
            parentCommentId: null,
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
            .then((newComment) => {
                setText("");
                setComments((prevComments) => [...prevComments, newComment]);
                setReloadComments(!reloadComments);
            })
            .catch((error) => console.error("Failed to post comment:", error));
    };

    const topLevelComments = comments.filter(
        (comment) => comment.parent_comment_id === null,
    );

    return (
        <div className="py-8 w-full max-w-2xl mx-auto">
            {session ? (
                <div className="bg-gray-50 p-6 rounded-lg shadow space-y-4">
                    <h2 className="text-lg font-semibold">
                        Commenting as {session.username}
                    </h2>
                    <CommentForm
                        onSubmit={(e) => handleSubmit(e, null)}
                        text={text}
                        setText={setText}
                    />
                </div>
            ) : (
                <div className="text-center py-4">
                    <Link
                        href="/signin"
                        className="px-6 py-2 bg-primary text-tertiary rounded-full hover:bg-secondary-dark focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-opacity-50 transition ease-in duration-200"
                    >
                        Sign in to comment
                    </Link>
                </div>
            )}
            <CommentList
                comments={topLevelComments}
                nft={nft}
                addReply={addReplyToComment}
            />
        </div>
    );
}

export default CommentSection;
