CREATE TABLE users (
	user_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
	username varchar(255) NOT NULL,
	email_address varchar(255) NOT NULL,
	"password" varchar(255) NOT NULL,
	verification_token VARCHAR(255),
    token_expires_at TIMESTAMP;
	email_verified BOOLEAN DEFAULT FALSE; 
	universe_id UUID REFERENCES universes(universe_id);
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
	num_owners int4 NULL,
	num_likes int4 NULL,
	deployer_address varchar(255) NULL,
	contract_address varchar(255) NULL,
	token_type varchar(10) NULL,
	nft_licence text NULL,
	collection_description text NULL,
	media_url varchar(255) NULL,
	collection_utility text NULL,
	category varchar(255)
);

CREATE TABLE publishers (
    publisher_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT NULL,
    deployer_address VARCHAR(255) NULL,
    media_url VARCHAR(255) NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE nfts (
	nft_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
	contract_address_token_id varchar(255) NOT NULL,
	artist_id UUID REFERENCES artists(artist_id),
	collection_id UUID REFERENCES collections(collection_id),
	contract_address varchar(255) NULL,
	deployer_address varchar(255) NULL,
	nft_name varchar(255) NULL,
	token_type varchar(255) NULL,
	token_uri_gateway varchar(255) NULL,
	nft_description text NULL,
	token_id varchar(255) NULL,
	creation_date timestamp NULL,
	media_url TEXT NULL,
	nft_sales_link varchar(255) NULL,
	nft_licence text NULL,
	nft_context text NULL,
	nft_utility text NULL,
	category varchar(255),
	owners _text NULL,
	CONSTRAINT nfts_contract_address_token_id_key UNIQUE (contract_address_token_id)
);

CREATE TABLE universes (
    universe_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT NULL,
    deployer_address VARCHAR(255) NULL,
	manager_id UUID REFERENCES users(user_id),
    media_url VARCHAR(255) NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE universe_entities (
    universe_entity_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    universe_id UUID REFERENCES universes(universe_id) ON DELETE CASCADE,
    entity_id UUID NOT NULL uuid_generate_v4(),
    entity_type VARCHAR(50) NOT NULL CHECK (entity_type IN ('publisher', 'collection', 'nft', 'token')),
	contract_address VARCHAR(255) NULL,
    token_id VARCHAR(255) NULL,
    UNIQUE(universe_id, entity_id, entity_type)
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
	"name" TEXT NOT NULL,
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

CREATE TABLE ownership_counts (
    user_id UUID NOT NULL,
    collection_id UUID NOT NULL,
    ownership_count INT NOT NULL,
    PRIMARY KEY (user_id, collection_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (collection_id) REFERENCES collections(collection_id)
);

CREATE TABLE user_nft_communities (
    user_id UUID NOT NULL,
    collection_id UUID NOT NULL,
    PRIMARY KEY (user_id, collection_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (collection_id) REFERENCES collections(collection_id) ON DELETE CASCADE
);

CREATE TABLE project_admin_applications (
    application_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(user_id),
    project_name VARCHAR(255) NOT NULL,
    contract_addresses TEXT[] NOT NULL,
    affiliation TEXT NOT NULL,
    status VARCHAR(50) DEFAULT 'pending',
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE onboarding_emails (
    universe_id UUID PRIMARY KEY,
    email_body TEXT NOT NULL,
    twitter_link VARCHAR(255),
    discord_link VARCHAR(255),
    telegram_link VARCHAR(255),
    goal TEXT,
    contact_name VARCHAR(255),
    contact_info VARCHAR(255),
    ip_rights TEXT,
    project_website VARCHAR(255),
    marketplace_link VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Optional: Create indexes to optimize queries
CREATE INDEX idx_user_nft_communities_user_id ON user_nft_communities(user_id);
CREATE INDEX idx_user_nft_communities_collection_id ON user_nft_communities(collection_id);

CREATE INDEX idx_nfts_collection_id ON nfts(collection_id);
CREATE INDEX idx_likes_nft_id ON likes(nft_id);
CREATE INDEX idx_comments_nft_id ON comments(nft_id);
CREATE UNIQUE INDEX collection_nft_aggregates_nft_id_idx ON collection_nft_aggregates (nft_id);

CREATE UNIQUE INDEX idx_likes_unique_user_nft ON likes(user_id, nft_id) WHERE nft_id IS NOT NULL;
