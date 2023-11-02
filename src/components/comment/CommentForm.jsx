import React from "react";


// Presentation of comments
function CommentForm({ text, setText, onSubmit }) {
    return (
        <form onSubmit={onSubmit}>
            <textarea
                className="w-full p-3 rounded resize-y bg-gray-200 text-gray-900 placeholder-gray-500"
                rows={2}
                onChange={(e) => setText(e.target.value)}
                value={text}
            />
            <div className="mt-4">
                <button type="submit" className="py-2 px-4 rounded bg-blue-500 text-white hover:bg-blue-700">
                    Send
                </button>
            </div>
        </form>
    );
}

export default CommentForm;
