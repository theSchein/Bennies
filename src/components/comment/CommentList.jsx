import React from 'react';

function CommentList({ comments }) {

  // Check if comments exist and is an array
  const validComments = Array.isArray(comments) ? comments : [];


  return (
    <div className="comment-list">
      {validComments.map(comment => (
  <div key={comment.comment_id}>
  <strong>{comment.commenter}</strong>
  <p>{comment.text}</p>
  <span>{new Date(comment.commentdate).toLocaleDateString()}</span>
</div>
      ))}
    </div>
  );
}

export default CommentList;
