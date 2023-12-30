CREATE TABLE users (
	user_id serial4 NOT NULL,
	username varchar(255) NOT NULL,
	email_address varchar(255) NOT NULL,
	"password" varchar(255) NOT NULL,
	CONSTRAINT users_email_address_key UNIQUE (email_address),
	CONSTRAINT users_pkey PRIMARY KEY (user_id),
	CONSTRAINT users_username_key UNIQUE (username)
);

CREATE TABLE artists (
	artist_id serial4 NOT NULL,
	artist_name varchar(100) NULL,
	user_id int4 NULL,
	artist_bio text NULL,
	artist_picture varchar(255) NULL,
	artist_sales_link varchar(255) NULL,
	social_media_link varchar(255) NULL,
	CONSTRAINT artists_pkey PRIMARY KEY (artist_id),
	CONSTRAINT artists_user_id_fkey FOREIGN KEY (user_id) REFERENCES users(user_id)
);

CREATE TABLE collections (
	collection_id serial4 NOT NULL,
	artist_id int4 NULL,
	collection_name varchar(255) NULL,
	num_collection_items int4 NULL,
	deployer_address varchar(255) NULL,
	contract_address varchar(255) NULL,
	token_type varchar(10) NULL,
	nft_licence text NULL,
	collection_description text NULL,
	CONSTRAINT collections_pkey PRIMARY KEY (collection_id),
	CONSTRAINT collections_artist_id_fkey FOREIGN KEY (artist_id) REFERENCES artists(artist_id)
);

CREATE TABLE nfts (
	nft_id serial4 NOT NULL,
	contract_address_token_id varchar(255) NOT NULL,
	artist_id int4 NULL,
	collection_id int4 NULL,
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
	owners _text NULL,
	CONSTRAINT nfts_contract_address_token_id_key UNIQUE (contract_address_token_id),
	CONSTRAINT nfts_pkey PRIMARY KEY (nft_id),
	CONSTRAINT nfts_artist_id_fkey FOREIGN KEY (artist_id) REFERENCES artists(artist_id),
	CONSTRAINT nfts_collection_id_fkey FOREIGN KEY (collection_id) REFERENCES collections(collection_id)
);

CREATE TABLE transactions (
	transaction_id serial4 NOT NULL,
	nft_id int4 NULL,
	buyer_address varchar(255) NULL,
	seller_address varchar(255) NULL,
	transactiondate timestamp NULL,
	CONSTRAINT transactions_pkey PRIMARY KEY (transaction_id)
);

CREATE TABLE wallets (
	wallet_id serial4 NOT NULL,
	user_id int4 NULL,
	wallet_address varchar(255) NULL,
	CONSTRAINT wallets_pkey PRIMARY KEY (wallet_id),
	CONSTRAINT wallets_user_id_fkey FOREIGN KEY (user_id) REFERENCES users(user_id)
);

CREATE TABLE "comments" (
	comment_id serial4 NOT NULL,
	nft_id int4 NULL,
	user_id int4 NULL,
	parent_comment_id int4 NULL,
	"text" text NULL,
	commentdate timestamp NULL,
	CONSTRAINT comments_pkey PRIMARY KEY (comment_id),
	CONSTRAINT comments_parent_comment_id_fkey FOREIGN KEY (parent_comment_id) REFERENCES "comments"(comment_id),
	CONSTRAINT comments_user_id_fkey FOREIGN KEY (user_id) REFERENCES users(user_id)
);

CREATE TABLE waitlist (
	id serial4 NOT NULL,
	"name" varchar(255) NOT NULL,
	email varchar(255) NOT NULL,
	joined_at timestamp NULL DEFAULT (now() AT TIME ZONE 'UTC'::text),
	CONSTRAINT waitlist_pkey PRIMARY KEY (id)
);

ALTER TABLE transactions ADD CONSTRAINT transactions_nft_id_fkey FOREIGN KEY (nft_id) REFERENCES nfts(nft_id);
