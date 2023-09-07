import React from 'react';

function CommentList({ comments }) {

  // console.log(JSON.stringify(comments, null, 2) )

  return (
    <div className="comment-list">
      {comments.map(comment => (
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
