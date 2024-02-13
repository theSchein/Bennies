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
	deployer_address varchar(255) NULL,
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
	media_url varchar(255) NULL,
	collection_utility text NULL,
	category varchar(255),
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
	nft_context text NULL,
	nft_utility text NULL,
	category varchar(255),
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
	collection_id int4 NULL,
	user_id int4 NULL,
	parent_comment_id int4 NULL,
	"text" text NULL,
	comment_date timestamp NULL,
	update_date timestamp NULL,
	CONSTRAINT comments_pkey PRIMARY KEY (comment_id),
	CONSTRAINT comments_parent_comment_id_fkey FOREIGN KEY (parent_comment_id) REFERENCES "comments"(comment_id),
	CONSTRAINT comments_user_id_fkey FOREIGN KEY (user_id) REFERENCES users(user_id)
);

CREATE TABLE likes (
    id serial4 NOT NULL,
    user_id int4 NOT NULL,
    nft_id int4 NULL,
    comment_id int4 NULL,
    type varchar(10) NOT NULL CHECK (type IN ('like', 'dislike')),
    created_at timestamp NULL DEFAULT (now() AT TIME ZONE 'UTC'::text),
    updated_at timestamp NULL DEFAULT (now() AT TIME ZONE 'UTC'::text),
    CONSTRAINT likes_pkey PRIMARY KEY (id),
    CONSTRAINT likes_user_id_fkey FOREIGN KEY (user_id) REFERENCES users(user_id),
    CONSTRAINT likes_nft_id_fkey FOREIGN KEY (nft_id) REFERENCES nfts(nft_id),
    CONSTRAINT likes_comment_id_fkey FOREIGN KEY (comment_id) REFERENCES comments(comment_id)
);

CREATE TABLE waitlist (
	id serial4 NOT NULL,
	"name" varchar(255) NOT NULL,
	email varchar(255) NOT NULL,
	joined_at timestamp NULL DEFAULT (now() AT TIME ZONE 'UTC'::text),
	CONSTRAINT waitlist_pkey PRIMARY KEY (id)
);

CREATE TABLE notifications (
    notif_id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    type VARCHAR(50),  
    message TEXT,      
    entity_id INT,     
    read BOOLEAN DEFAULT FALSE,  
	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_user
        FOREIGN KEY(user_id) 
        REFERENCES users(user_id)
        ON DELETE CASCADE
);

CREATE TABLE news (
    news_id SERIAL PRIMARY KEY,
    collection_id INT NOT NULL,
    artist_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    viewing_group VARCHAR(50) NOT NULL, -- e.g., 'public', 'holders', 'owners'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (collection_id) REFERENCES collections(collection_id),
    FOREIGN KEY (artist_id) REFERENCES users(user_id)
);


ALTER TABLE transactions ADD CONSTRAINT transactions_nft_id_fkey FOREIGN KEY (nft_id) REFERENCES nfts(nft_id);

-- CREATE INDEX idx_likes_on_user ON likes(user_id);
-- CREATE INDEX idx_likes_on_nft ON likes(nft_id);
-- CREATE INDEX idx_likes_on_comment ON likes(comment_id);

CREATE UNIQUE INDEX idx_likes_unique_user_nft ON likes(user_id, nft_id) WHERE nft_id IS NOT NULL;
