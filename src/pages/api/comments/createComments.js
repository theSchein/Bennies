// pages/api/comments/createComments.js
import { getToken } from 'next-auth/jwt';
import db from '../../../lib/db';

export default async (req, res) => {
    if (req.method === 'POST') {
    const session = await getToken( {req} );
    const user_id = session.user.user_id;
  
    if (!session) {
        // Not authenticated
        return res.status(401).json({ error: 'Not authenticated from the session' });
      }
                       
      const { nft_id, text, parentCommentId } = req.body.data;

      if (!user_id || !nft_id || !text) {
        return res.status(400).json({ error: 'Missing required fields.' });
        }

try {
    const query = `
      INSERT INTO Comments(user_id, nft_id, text, parent_comment_id, CommentDate)
      VALUES($1, $2, $3, $4, NOW())
      RETURNING comment_id;
    `;

    const values = [user_id, nft_id, text, parentCommentId || null];

    const result = await db.query(query, values);
    
    const commentId = result[0].comment_id;

    if (!commentId) {
      throw new Error('Failed to create comment.');
    }

    return res.status(201).json({ message: 'Comment created.', commentId });

} catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal Server Error.' });
}

    }
}