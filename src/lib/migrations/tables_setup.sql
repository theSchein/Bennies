CREATE TABLE users (
	user_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
	username varchar(255) NOT NULL,
	email_address varchar(255) NOT NULL,
	"password" varchar(255) NOT NULL,
	CONSTRAINT users_email_address_key UNIQUE (email_address),
	CONSTRAINT users_username_key UNIQUE (username)
);

CREATE TABLE artists (
	artist_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
	artist_name varchar(100) NULL,
	user_id UUID REFERENCES users(user_id),
	deployer_address varchar(255) NULL,
	artist_bio text NULL,
	artist_picture varchar(255) NULL,
	artist_sales_link varchar(255) NULL,
	social_media_link varchar(255) NULL
);

CREATE TABLE collections (
	collection_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
	artist_id UUID REFERENCES artists(artist_id),
	collection_name varchar(255) NULL,
	num_collection_items int4 NULL,
	deployer_address varchar(255) NULL,
	contract_address varchar(255) NULL,
	token_type varchar(10) NULL,
	nft_licence text NULL,
	collection_description text NULL,
	media_url varchar(255) NULL,
	collection_utility text NULL,
	category varchar(255)
);

CREATE TABLE nfts (
	nft_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
	contract_address_token_id varchar(255) NOT NULL,
	artist_id UUID REFERENCES artists(artist_id),
	collection_id UUID REFERENCES collections(collection_id),
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
	CONSTRAINT nfts_contract_address_token_id_key UNIQUE (contract_address_token_id)
);

CREATE TABLE transactions (
	transaction_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
	nft_id UUID REFERENCES nfts(nft_id),
	buyer_address varchar(255) NULL,
	seller_address varchar(255) NULL,
	transactiondate timestamp NULL
);

CREATE TABLE wallets (
	wallet_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
	user_id UUID REFERENCES users(user_id),
	wallet_address varchar(255) NULL
);

CREATE TABLE comments (
	comment_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
	nft_id UUID REFERENCES nfts(nft_id),
	collection_id UUID REFERENCES collections(collection_id),
	user_id UUID REFERENCES users(user_id), 
	parent_comment_id UUID NULL REFERENCES comments(comment_id), 
	"text" text NULL,
	comment_date timestamp NULL,
	update_date timestamp NULL
);

CREATE TABLE likes (
    like_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(user_id),
    nft_id UUID REFERENCES nfts(nft_id),
    comment_id UUID REFERENCES comments(comment_id),
    type varchar(10) NOT NULL CHECK (type IN ('like', 'dislike')),
    created_at timestamp NULL DEFAULT (now() AT TIME ZONE 'UTC'::text),
    updated_at timestamp NULL DEFAULT (now() AT TIME ZONE 'UTC'::text)
);

CREATE TABLE waitlist (
	waitlist_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
	"name" varchar(255) NOT NULL,
	email varchar(255) NOT NULL,
	joined_at timestamp NULL DEFAULT (now() AT TIME ZONE 'UTC'::text)
);

CREATE TABLE notifications (
    notif_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    type VARCHAR(50),  
    message TEXT,      
    entity_id UUID,     
    read BOOLEAN DEFAULT FALSE,  
	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_user
        FOREIGN KEY(user_id) 
        REFERENCES users(user_id)
        ON DELETE CASCADE
);

CREATE TABLE news (
    news_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    collection_id UUID REFERENCES collections(collection_id),
    artist_id UUID REFERENCES artists(artist_id),
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    viewing_group VARCHAR(50) NOT NULL, 
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);


-- CREATE INDEX idx_likes_on_user ON likes(user_id);
-- CREATE INDEX idx_likes_on_nft ON likes(nft_id);
-- CREATE INDEX idx_likes_on_comment ON likes(comment_id);

CREATE UNIQUE INDEX idx_likes_unique_user_nft ON likes(user_id, nft_id) WHERE nft_id IS NOT NULL;
