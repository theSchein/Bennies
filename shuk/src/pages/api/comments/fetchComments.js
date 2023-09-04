import db from '../../../lib/db';



export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const nftId = req.query.nft_id;

  if (!nftId) {
    return res.status(400).json({ message: 'nft_id query parameter is required.' });
  }

  try {
    const query = `
      WITH RECURSIVE comment_tree AS (
        SELECT 
          Comments.comment_id,
          Comments.parent_comment_id,
          Commenters.user_id,
          Commenters.username as commenter,
          Comments.text as CommentText,
          Comments.CommentDate
        FROM 
          Comments
        JOIN Users AS Commenters ON Comments.user_id = Commenters.user_id
        WHERE 
          nft_id = $1 AND 
          parent_comment_id IS NULL

        UNION ALL

        SELECT 
          c.comment_id,
          c.parent_comment_id,
          Commenters.user_id,
          Commenters.username as commenter,
          c.Text as CommentText,
          c.CommentDate
        FROM 
          Comments c
        JOIN Users AS Commenters ON c.user_id = Commenters.user_id
        JOIN comment_tree ct ON c.parent_comment_id = ct.comment_id
      )
      SELECT 
          ct.comment_id,
          ct.parent_comment_id,
          ct.user_id,
          ct.commenter,
          ct.CommentText,
          ct.CommentDate
      FROM comment_tree ct
      ORDER BY ct.comment_id ASC;
    `;

    const values = [nftId];
    const result = await db.query(query, values);

    if (!result.rows || result.rows.length === 0) {
      return res.status(404).json({ message: 'No comments found for this NFT.' });
    }

    return res.status(200).json(result.rows);

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal Server Error.' });
  }
}
