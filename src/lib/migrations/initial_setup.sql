import { sql } from '@vercel/postgres';
 
export default async function handler(request, response) {
  try {
    const result =
      await sql`
      
      
      CREATE TABLE Pets ( Name varchar(255), Owner varchar(255) );
      
      
      
      
      `;
    
    
    
    
    return response.status(200).json({ result });
  } catch (error) {
    return response.status(500).json({ error });
  }
}


-- DROP SCHEMA public;

CREATE SCHEMA public AUTHORIZATION postgres;

COMMENT ON SCHEMA public IS 'standard public schema';

-- DROP SEQUENCE public.artists_artist_id_seq;

CREATE SEQUENCE public.artists_artist_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;
-- DROP SEQUENCE public.collections_collection_id_seq;

CREATE SEQUENCE public.collections_collection_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;
-- DROP SEQUENCE public.comments_comment_id_seq;

CREATE SEQUENCE public.comments_comment_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;
-- DROP SEQUENCE public.nfts_nft_id_seq;

CREATE SEQUENCE public.nfts_nft_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;
-- DROP SEQUENCE public.transactions_transaction_id_seq;

CREATE SEQUENCE public.transactions_transaction_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;
-- DROP SEQUENCE public.users_user_id_seq;

CREATE SEQUENCE public.users_user_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;
-- DROP SEQUENCE public.wallets_wallet_id_seq;

CREATE SEQUENCE public.wallets_wallet_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;-- public.artists definition

-- Drop table

-- DROP TABLE public.artists;

CREATE TABLE public.artists (
	artist_id serial4 NOT NULL,
	artist_name varchar(100) NULL,
	user_id int4 NULL,
	artist_bio text NULL,
	artist_picture varchar(255) NULL,
	artist_sales_link varchar(255) NULL,
	social_media_link varchar(255) NULL,
	CONSTRAINT artists_pkey PRIMARY KEY (artist_id)
);


-- public.transactions definition

-- Drop table

-- DROP TABLE public.transactions;

CREATE TABLE public.transactions (
	transaction_id serial4 NOT NULL,
	nft_id int4 NULL,
	buyer_address varchar(255) NULL,
	seller_address varchar(255) NULL,
	transactiondate timestamp NULL,
	CONSTRAINT transactions_pkey PRIMARY KEY (transaction_id)
);


-- public.users definition

-- Drop table

-- DROP TABLE public.users;

CREATE TABLE public.users (
	user_id serial4 NOT NULL,
	username varchar(255) NOT NULL,
	email_address varchar(255) NOT NULL,
	"password" varchar(255) NOT NULL,
	CONSTRAINT users_email_address_key UNIQUE (email_address),
	CONSTRAINT users_pkey PRIMARY KEY (user_id),
	CONSTRAINT users_username_key UNIQUE (username)
);


-- public.wallets definition

-- Drop table

-- DROP TABLE public.wallets;

CREATE TABLE public.wallets (
	wallet_id serial4 NOT NULL,
	user_id int4 NULL,
	wallet_address varchar(255) NULL,
	CONSTRAINT wallets_pkey PRIMARY KEY (wallet_id)
);


-- public.collections definition

-- Drop table

-- DROP TABLE public.collections;

CREATE TABLE public.collections (
	collection_id serial4 NOT NULL,
	artist_id int4 NULL,
	collection_name varchar(255) NULL,
	num_collection_items int4 NULL,
	deployer_address varchar(255) NULL,
	CONSTRAINT collections_pkey PRIMARY KEY (collection_id),
	CONSTRAINT collections_artist_id_fkey FOREIGN KEY (artist_id) REFERENCES public.artists(artist_id)
);


-- public."comments" definition

-- Drop table

-- DROP TABLE public."comments";

CREATE TABLE public."comments" (
	comment_id serial4 NOT NULL,
	nft_id int4 NULL,
	user_id int4 NULL,
	parent_comment_id int4 NULL,
	"text" text NULL,
	commentdate timestamp NULL,
	CONSTRAINT comments_pkey PRIMARY KEY (comment_id),
	CONSTRAINT comments_parent_comment_id_fkey FOREIGN KEY (parent_comment_id) REFERENCES public."comments"(comment_id)
);


-- public.nfts definition

-- Drop table

-- DROP TABLE public.nfts;

CREATE TABLE public.nfts (
	nft_id serial4 NOT NULL,
	contract_address_token_id varchar(255) NULL,
	artist_id int4 NULL,
	collection_id int4 NULL,
	address_token_id int4 NULL,
	contract_address varchar(255) NULL,
	deployer_address varchar(255) NULL,
	nft_name varchar(255) NULL,
	token_type varchar(10) NULL,
	token_uri_gateway varchar(255) NULL,
	nft_description text NULL,
	token_id varchar(255) NULL,
	creation_date timestamp NULL,
	media_url varchar(255) NULL,
	nft_sales_link varchar(255) NULL,
	nft_licence text NULL,
	CONSTRAINT nfts_pkey PRIMARY KEY (nft_id),
	CONSTRAINT nfts_artist_id_fkey FOREIGN KEY (artist_id) REFERENCES public.artists(artist_id),
	CONSTRAINT nfts_collection_id_fkey FOREIGN KEY (collection_id) REFERENCES public.collections(collection_id)
);
