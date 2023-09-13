import { useState, useEffect } from "react";
import CommentForm from "./CommentForm.jsx";
import CommentList from "./CommentList";

function CommentSection({ nft }) {
    const [comments, setComments] = useState([]);
    const [text, setText] = useState("");
    const [reloadComments, setReloadComments] = useState(false);

    const nft_id = nft.nft_id;
    const parentCommentId = null;

    const data = { text, nft_id, parentCommentId };

    useEffect(() => {
        async function fetchComments() {
            try {
                // Fetch comments when the component mounts
                const response = await fetch(
                    "/api/comments/fetchComments?nft_id=" + nft_id,
                );
                const data = await response.json();
                setComments(data);
            } catch (error) {
                console.error("There was an error fetching the comments", error);
            }
        }
        fetchComments();
    }, [nft_id, reloadComments]);

    //   const handleDelete = (comment) => {
    //     // Call DELETE API here and remove the comment from state
    //   }

    const handleSubmit = (e) => {
        e.preventDefault();

        fetch("/api/comments/createComments", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                credentials: "include",
            },
            body: JSON.stringify({ data }),
        })
            .then((response) => response.json())
            .then((data) => {
                setText("");
                setComments((prevComments) => [...prevComments, data]);
                setReloadComments(!reloadComments); // Toggle the state
            });
    };

    return (
        <div>
            <h2>Add some comments</h2>
            <CommentForm onSubmit={handleSubmit} text={text} setText={setText} />
            <CommentList comments={comments} />
        </div>
    );
}

export default CommentSection;
