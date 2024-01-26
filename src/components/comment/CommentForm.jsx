// components/comment/CommentForm.jsx
// This component has the presentation for the comment form.

import React from "react";

// Presentation of comments
function CommentForm({ text, setText, onSubmit }) {
    return (
        <form onSubmit={onSubmit} className="w-full max-w-2xl mx-auto">
            <textarea
                className="w-full p-4 rounded-lg resize-none bg-light-primary dark:bg-dark-primary text-light-quaternary dark:text-dark-quaternary placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-300 transition-all"
                rows={4}
                onChange={(e) => setText(e.target.value)}
                value={text}
                placeholder="Share your thoughts..."
            />
            <div className="mt-4 flex justify-end">
                <button
                    type="submit"
                    className="btn"
                >
                    Post Comment
                </button>
            </div>
        </form>
    );
}

export default CommentForm;
