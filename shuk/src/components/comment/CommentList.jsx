import React from 'react';

function CommentList({ comments }) {
  return (
    <div className="comment-list">
      {comments.map(comment => (
        <div key={comment.comment_id} className="comment-item">
          <p><strong>{comment.Commenter}</strong>: {comment.CommentText}</p>
          <p>{comment.CommentDate}</p>
          <button >Delete</button>
        </div>
      ))}
    </div>
  );
}

export default CommentList;
