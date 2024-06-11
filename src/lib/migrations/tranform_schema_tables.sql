-- DROP SCHEMA "transform";

CREATE SCHEMA "transform" AUTHORIZATION "default";
-- "transform".ingestion_log definition

-- Drop table

-- DROP TABLE "transform".ingestion_log;

CREATE TABLE "transform".ingestion_log (
	ingestion_id uuid NOT NULL DEFAULT uuid_generate_v4(),
	contract_address varchar(255) NOT NULL,
	token_id varchar(255) NULL,
	status varchar(50) NOT NULL,
	error_message text NULL,
	"timestamp" timestamp NULL DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT ingestion_log_pkey PRIMARY KEY (ingestion_id)
);


-- "transform".publisher definition

-- Drop table

-- DROP TABLE "transform".publisher;

CREATE TABLE "transform".publisher (
	publisher_id uuid NOT NULL DEFAULT uuid_generate_v4(),
	"name" varchar(255) NOT NULL,
	description text NULL,
	media_url varchar(255) NULL,
	contract_address varchar(255) NOT NULL,
	token_ids _int4 NULL DEFAULT '{}'::integer[],
	CONSTRAINT publisher_pkey PRIMARY KEY (publisher_id),
	CONSTRAINT publishers_unique_name UNIQUE (name)
);


-- "transform".verification definition

-- Drop table

-- DROP TABLE "transform".verification;

CREATE TABLE "transform".verification (
	verification_id uuid NOT NULL DEFAULT uuid_generate_v4(),
	contract_address varchar(255) NOT NULL,
	duplicates_checked bool NULL DEFAULT false,
	metadata_filled bool NULL DEFAULT false,
	images_processed bool NULL DEFAULT false,
	checksums_verified bool NULL DEFAULT false,
	verified bool NULL DEFAULT false,
	last_checked timestamp NULL DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT verification_pkey PRIMARY KEY (verification_id)
);


-- "transform".collection definition

-- Drop table

-- DROP TABLE "transform".collection;

CREATE TABLE "transform".collection (
	collection_id uuid NOT NULL DEFAULT uuid_generate_v4(),
	publisher_id uuid NULL,
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
	category varchar(255) NULL,
	token_ids _int4 NULL DEFAULT '{}'::integer[],
	CONSTRAINT collection_pkey PRIMARY KEY (collection_id),
	CONSTRAINT collection_unique_contract_address_name UNIQUE (contract_address, collection_name)
);


-- "transform".nft definition

-- Drop table

-- DROP TABLE "transform".nft;

CREATE TABLE "transform".nft (
	nft_id uuid NOT NULL DEFAULT uuid_generate_v4(),
	contract_address_token_id varchar(255) NOT NULL,
	collection_id uuid NULL,
	contract_address varchar(255) NULL,
	deployer_address varchar(255) NULL,
	token_type varchar(255) NULL,
	token_uri_gateway varchar(255) NULL,
	nft_description text NULL,
	token_id varchar(255) NULL,
	creation_date timestamp NULL,
	media_url text NULL,
	nft_sales_link varchar(255) NULL,
	nft_licence text NULL,
	nft_context text NULL,
	nft_utility text NULL,
	category varchar(255) NULL,
	owners _text NULL,
	publisher_id uuid NULL,
	CONSTRAINT nft_contract_address_token_id_unique UNIQUE (contract_address_token_id),
	CONSTRAINT nft_pkey PRIMARY KEY (nft_id)
);


-- "transform"."token" definition

-- Drop table

-- DROP TABLE "transform"."token";

CREATE TABLE "transform"."token" (
	token_id uuid NOT NULL DEFAULT uuid_generate_v4(),
	token_name varchar(255) NULL,
	token_symbol varchar(255) NULL,
	logo_media varchar(255) NULL,
	creation_date timestamptz NULL,
	contract_address varchar(255) NOT NULL,
	deployer_address varchar(255) NOT NULL,
	supply int8 NULL,
	decimals int4 NULL,
	token_utility text NULL,
	description text NULL,
	universe_id uuid NULL,
	category varchar(255) NULL,
	CONSTRAINT token_pkey PRIMARY KEY (token_id),
	CONSTRAINT tokens_unique_contract_address UNIQUE (contract_address)
);


-- "transform".collection foreign keys

ALTER TABLE "transform".collection ADD CONSTRAINT collection_publisher_id_fkey FOREIGN KEY (publisher_id) REFERENCES public.publishers(universe_id);


-- "transform".nft foreign keys

ALTER TABLE "transform".nft ADD CONSTRAINT nft_collection_id_fkey FOREIGN KEY (collection_id) REFERENCES "transform".collection(collection_id);


-- "transform"."token" foreign keys

ALTER TABLE "transform"."token" ADD CONSTRAINT token_universe_id_fkey FOREIGN KEY (universe_id) REFERENCES public.universes(universe_id);


