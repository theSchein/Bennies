// components/comment/CommentUtils.jsx
// This function ATTEMPTS to structures the comments into a nested format

export function structureComments(comments) {
    const commentMap = {};

    // Create a map of comment_id to comment object for quick access
    comments.forEach(
        (comment) => (commentMap[comment.comment_id] = { ...comment, replies: [] }),
    );

    // Create the nested comment structure
    const structuredComments = [];
    comments.forEach((comment) => {
        if (comment.parent_comment_id) {
            const parent = commentMap[comment.parent_comment_id];
            if (parent) {
                parent.replies.push(commentMap[comment.comment_id]);
            }
        } else {
            structuredComments.push(commentMap[comment.comment_id]);
        }
    });

    return structuredComments;
}
