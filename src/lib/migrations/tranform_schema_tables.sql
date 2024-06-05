-- "transform".publisher definition

-- Drop table

-- DROP TABLE "transform".publisher;

CREATE TABLE IF NOT EXISTS "transform".publisher (
    publisher_id UUID NOT NULL DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT NULL,
    media_url VARCHAR(255) NULL,
    contract_address VARCHAR(255) NOT NULL,
    CONSTRAINT publisher_pkey PRIMARY KEY (publisher_id),
    CONSTRAINT publishers_unique_name UNIQUE (name)
);


-- "transform".collection definition

-- Drop table

-- DROP TABLE "transform".collection;

CREATE TABLE IF NOT EXISTS "transform".collection (
    collection_id UUID NOT NULL DEFAULT uuid_generate_v4(),
    publisher_id UUID NULL,
    collection_name VARCHAR(255) NULL,
    num_collection_items INT4 NULL,
    num_owners INT4 NULL,
    num_likes INT4 NULL,
    deployer_address VARCHAR(255) NULL,
    contract_address VARCHAR(255) NULL,
    token_type VARCHAR(10) NULL,
    nft_licence TEXT NULL,
    collection_description TEXT NULL,
    media_url VARCHAR(255) NULL,
    collection_utility TEXT NULL,
    category VARCHAR(255) NULL,
    token_ids INTEGER[] DEFAULT '{}',
    CONSTRAINT collection_pkey PRIMARY KEY (collection_id),
    CONSTRAINT collection_publisher_id_fkey FOREIGN KEY (publisher_id) REFERENCES public.publishers(universe_id)
);


-- "transform".nft definition

-- Drop table

-- DROP TABLE "transform".nft;

CREATE TABLE IF NOT EXISTS "transform".nft (
    nft_id UUID NOT NULL DEFAULT uuid_generate_v4(),
    contract_address_token_id VARCHAR(255) NOT NULL,
    collection_id UUID NULL,
    contract_address VARCHAR(255) NULL,
    deployer_address VARCHAR(255) NULL,
    token_type VARCHAR(255) NULL,
    token_uri_gateway VARCHAR(255) NULL,
    nft_description TEXT NULL,
    token_id VARCHAR(255) NULL,
    creation_date TIMESTAMP NULL,
    media_url TEXT NULL,
    nft_sales_link VARCHAR(255) NULL,
    nft_licence TEXT NULL,
    nft_context TEXT NULL,
    nft_utility TEXT NULL,
    category VARCHAR(255) NULL,
    owners TEXT[] NULL,
    CONSTRAINT nft_contract_address_token_id_unique UNIQUE (contract_address_token_id),
    CONSTRAINT nft_pkey PRIMARY KEY (nft_id),
    CONSTRAINT nft_collection_id_fkey FOREIGN KEY (collection_id) REFERENCES "transform".collection(collection_id)
);


-- "transform"."token" definition

-- Drop table

-- DROP TABLE "transform"."token";

CREATE TABLE IF NOT EXISTS "transform"."token" (
    token_id UUID NOT NULL DEFAULT uuid_generate_v4(),
    token_name VARCHAR(255) NULL,
    token_symbol VARCHAR(255) NULL,
    logo_media VARCHAR(255) NULL,
    creation_date TIMESTAMPTZ NULL,
    contract_address VARCHAR(255) NOT NULL,
    deployer_address VARCHAR(255) NOT NULL,
    supply INT8 NULL,
    decimals INT4 NULL,
    token_utility TEXT NULL,
    description TEXT NULL,
    universe_id UUID NULL,
    category VARCHAR(255) NULL,
    CONSTRAINT token_pkey PRIMARY KEY (token_id),
    CONSTRAINT tokens_unique_contract_address UNIQUE (contract_address),
    CONSTRAINT token_universe_id_fkey FOREIGN KEY (universe_id) REFERENCES public.universes(universe_id)
);
