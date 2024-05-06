CREATE SCHEMA staging;
CREATE SCHEMA ingestion_logs;

CREATE TABLE staging.sources (
    source_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    description TEXT
);

CREATE TABLE staging.staging_data (
    data_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    source_id UUID REFERENCES staging.sources(source_id),
    twitter_account VARCHAR(255);
    contract_address VARCHAR(255) UNIQUE NOT NULL,
    data JSONB,
    received_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE ingestion_logs.ingestion_data(
    log_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    source_id UUID REFERENCES staging.sources(source_id),
    status VARCHAR(100),
    log_details TEXT,
    logged_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
