-- public.nft_leaderboard source

CREATE MATERIALIZED VIEW public.nft_leaderboard
TABLESPACE pg_default
AS SELECT likes.nft_id,
    nfts.nft_name,
    collections.collection_name,
    collections.collection_id,
    sum(
        CASE
            WHEN likes.type::text = 'like'::text THEN 1
            ELSE 0
        END) - sum(
        CASE
            WHEN likes.type::text = 'dislike'::text THEN 1
            ELSE 0
        END) AS score
   FROM likes
     JOIN nfts ON likes.nft_id = nfts.nft_id
     LEFT JOIN collections ON nfts.collection_id = collections.collection_id
  WHERE likes.nft_id IS NOT NULL
  GROUP BY likes.nft_id, nfts.nft_name, collections.collection_name, collections.collection_id
WITH DATA;

