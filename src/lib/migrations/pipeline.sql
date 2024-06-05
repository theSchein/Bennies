CREATE SCHEMA IF NOT EXISTS staging;

-- Create staging.sources table
CREATE TABLE staging.sources (
    source_id uuid NOT NULL DEFAULT uuid_generate_v4(),
    description text NULL,
    twitter_account varchar(255) NULL,
    CONSTRAINT sources_pkey PRIMARY KEY (source_id)
);

-- Create staging.spam table
CREATE TABLE staging.spam (
    spam_id uuid NOT NULL DEFAULT uuid_generate_v4(),
    contract_address varchar(255) NOT NULL,
    collection_name varchar(255) NULL,
    flagged_count int4 NULL DEFAULT 1,
    last_flagged timestamp NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT spam_contract_address_key UNIQUE (contract_address),
    CONSTRAINT spam_pkey PRIMARY KEY (spam_id)
);

-- Create staging.staging_data table
CREATE TABLE staging.staging_data (
    data_id uuid NOT NULL DEFAULT uuid_generate_v4(),
    source_id uuid NULL,
    contract_address varchar(255) NOT NULL,
    "data" jsonb NULL,
    received_at timestamp NULL DEFAULT CURRENT_TIMESTAMP,
    twitter_account varchar(255) NULL,
    publisher_name varchar(255) NULL,
    CONSTRAINT staging_data_contract_address_key UNIQUE (contract_address),
    CONSTRAINT staging_data_pkey PRIMARY KEY (data_id),
    CONSTRAINT unique_contract_address UNIQUE (contract_address),
    CONSTRAINT staging_data_source_id_fkey FOREIGN KEY (source_id) REFERENCES staging.sources(source_id)
);
