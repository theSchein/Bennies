import React from 'react';

function CommentForm({ text, setText, onSubmit }) {

  return (
    <form onSubmit={onSubmit}>
      <textarea
        className="flex w-full max-h-40 p-3 rounded resize-y bg-gray-200 text-gray-900 placeholder-gray-500"
        rows={2}
        onChange={e => setText(e.target.value)}
        value={text}
      />
      <div className="flex items-center mt-4">

      <button className="py-2 px-4 rounded bg-blue-600 text-white disabled:opacity-40 hover:bg-blue-700">
              Send
            </button>
      </div>
    </form>
  );
}

export default CommentForm;
