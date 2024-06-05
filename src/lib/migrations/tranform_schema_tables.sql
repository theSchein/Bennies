CREATE SCHEMA IF NOT EXISTS transform;

-- Create transform table for NFTs
CREATE TABLE transform.nft (
    nft_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    contract_address_token_id varchar(255) NOT NULL,
    collection_id UUID REFERENCES collections(collection_id),
    contract_address varchar(255) NULL,
    deployer_address varchar(255) NULL,
    token_type varchar(255) NULL,
    token_uri_gateway varchar(255) NULL,
    nft_description text NULL,
    token_id varchar(255) NULL,
    creation_date timestamp NULL,
    media_url TEXT NULL,
    nft_sales_link varchar(255) NULL,CREATE SCHEMA IF NOT EXISTS transform;

-- Create transform table for NFTs
CREATE TABLE transform.nft (
    nft_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    contract_address_token_id varchar(255) NOT NULL,
    collection_id UUID REFERENCES collections(collection_id),
    contract_address varchar(255) NULL,
    deployer_address varchar(255) NULL,
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
    owners _text NULL
);

-- Create transform table for Collections
CREATE TABLE transform.collection (
    collection_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    publisher_id UUID REFERENCES publishers(universe_id),
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
    category varchar(255),
    token_ids _int4 NULL DEFAULT '{}'::integer[],

    -- Add other relevant collection attributes here
    -- ...,
    FOREIGN KEY (publisher_id) REFERENCES publishers(universe_id)
);

-- Create transform table for Publishers
CREATE TABLE transform.publisher (
    publisher_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description text NULL,
    media_url varchar(255) NULL,
    contract_address varchar(255) NOT NULL,
    CONSTRAINT publishers_unique_name UNIQUE (name)
);

-- Create transform table for Tokens
CREATE TABLE transform.token (
    token_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    token_name varchar(255) NULL,
    token_symbol varchar(255) NULL,
    logo_media varchar(255) NULL,
    creation_date TIMESTAMP WITH TIME ZONE DEFAULT NULL,
    contract_address varchar(255) NOT NULL,
    deployer_address varchar(255) NOT NULL,
    supply bigint NULL,
    decimals int4 NULL,
    token_utility text NULL,
    description text NULL,
    universe_id UUID REFERENCES universes(universe_id),
    category varchar(255),
    CONSTRAINT tokens_unique_contract_address UNIQUE (contract_address)
);

    nft_licence text NULL,
    nft_context text NULL,
    nft_utility text NULL,
    category varchar(255),
    owners _text NULL
);

-- Create transform table for Collections
CREATE TABLE transform.collection (
    collection_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    publisher_id UUID REFERENCES publishers(universe_id),
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
    category varchar(255),
    -- Add other relevant collection attributes here
    -- ...,
    FOREIGN KEY (publisher_id) REFERENCES publishers(universe_id)
);

-- Create transform table for Publishers
CREATE TABLE transform.publisher (
    publisher_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description text NULL,
    media_url varchar(255) NULL,
    contract_address varchar(255) NOT NULL,
    CONSTRAINT publishers_unique_name UNIQUE (name)
);

-- Create transform table for Tokens
CREATE TABLE transform.token (
    token_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    token_name varchar(255) NULL,
    token_symbol varchar(255) NULL,
    logo_media varchar(255) NULL,
    creation_date TIMESTAMP WITH TIME ZONE DEFAULT NULL,
    contract_address varchar(255) NOT NULL,
    deployer_address varchar(255) NOT NULL,
    supply bigint NULL,
    decimals int4 NULL,
    token_utility text NULL,
    description text NULL,
    universe_id UUID REFERENCES universes(universe_id),
    category varchar(255),
    CONSTRAINT tokens_unique_contract_address UNIQUE (contract_address)
);
