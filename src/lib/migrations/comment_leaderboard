-- public.comment_leaderboard source

CREATE MATERIALIZED VIEW public.comment_leaderboard
TABLESPACE pg_default
AS WITH rankedlikes AS (
         SELECT users.username,
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
             LEFT JOIN comments ON likes.comment_id = comments.comment_id
             LEFT JOIN users ON comments.user_id = users.user_id
          WHERE likes.comment_id IS NOT NULL
          GROUP BY users.username
        )
 SELECT rankedlikes.username,
    rankedlikes.score,
    rank() OVER (ORDER BY rankedlikes.score DESC) AS rank
   FROM rankedlikes
  ORDER BY rankedlikes.score DESC
WITH DATA;