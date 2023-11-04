import React from "react";

// Presentation of comments
function CommentForm({ text, setText, onSubmit }) {
    return (
        <form onSubmit={onSubmit} className="w-full max-w-2xl mx-auto">
            <textarea
                className="w-full p-4 rounded-lg resize-none bg-gray-100 text-gray-800 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-300 transition-all"
                rows={4}
                onChange={(e) => setText(e.target.value)}
                value={text}
                placeholder="Share your thoughts..."
            />
            <div className="mt-4 flex justify-end">
                <button
                    type="submit"
                    className="py-2 px-6 rounded-lg bg-gradient-to-r from-gray-500 via-gray-400 to-gray-300 text-white font-semibold hover:from-gray-600 hover:via-gray-500 hover:to-gray-400 shadow-md transition-all"
                >
                    Post Comment
                </button>
            </div>
        </form>
    );
}

export default CommentForm;
