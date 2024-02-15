CREATE MATERIALIZED VIEW collection_nft_aggregates AS
SELECT 
  nfts.nft_id, 
  COUNT(DISTINCT likes.like_id) AS like_count, 
  COUNT(DISTINCT comments.comment_id) AS comment_count
FROM 
  nfts
  LEFT JOIN likes ON nfts.nft_id = likes.nft_id AND likes.type = 'like'
  LEFT JOIN comments ON nfts.nft_id = comments.nft_id
GROUP BY nfts.nft_id;
