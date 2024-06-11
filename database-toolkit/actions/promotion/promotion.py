from db.connection import connect_db
from psycopg2 import Error
from dotenv import load_dotenv

# Load environment variables
load_dotenv(dotenv_path='.env.local')

def promote_verified_tokens():
    conn = connect_db()
    if conn is None:
        return

    try:
        with conn.cursor() as cursor:
            # Fetch verified tokens
            cursor.execute("""
                SELECT contract_address FROM transform.verification 
                WHERE verified = TRUE AND token_type = 'ERC20' AND promoted IS FALSE;
            """)
            verified_tokens = cursor.fetchall()

            for token in verified_tokens:
                contract_address = token[0]
                # Copy token data from transform.token to prod.token
                cursor.execute("""
                    INSERT INTO public.tokens (contract_address, token_name, token_symbol, logo_media, creation_date, deployer_address, supply, decimals, token_utility, description, category)
                    SELECT contract_address, token_name, token_symbol, logo_media, creation_date, deployer_address, supply, decimals, token_utility, description, category
                    FROM transform.token
                    WHERE contract_address = %s
                    ON CONFLICT (contract_address) DO UPDATE SET
                        token_name = COALESCE(EXCLUDED.token_name, public.tokens.token_name),
                        token_symbol = COALESCE(EXCLUDED.token_symbol, public.tokens.token_symbol),
                        logo_media = COALESCE(EXCLUDED.logo_media, public.tokens.logo_media),
                        creation_date = COALESCE(EXCLUDED.creation_date, public.tokens.creation_date),
                        deployer_address = COALESCE(EXCLUDED.deployer_address, public.tokens.deployer_address),
                        supply = COALESCE(EXCLUDED.supply, public.tokens.supply),
                        decimals = COALESCE(EXCLUDED.decimals, public.tokens.decimals),
                        token_utility = COALESCE(EXCLUDED.token_utility, public.tokens.token_utility),
                        description = COALESCE(EXCLUDED.description, public.tokens.description),
                        category = COALESCE(EXCLUDED.category, public.tokens.category);
                """, (contract_address,))
                conn.commit()
                # Mark as promoted
                cursor.execute("""
                    UPDATE transform.verification
                    SET promoted = TRUE
                    WHERE contract_address = %s;
                """, (contract_address,))
                conn.commit()
                print(f"Token {contract_address} promoted to production.")
    except (Exception, Error) as error:
        print(f"Error promoting tokens: {error}")
        conn.rollback()
    finally:
        conn.close()


def promote_verified_nfts():
    conn = connect_db()
    if conn is None:
        return

    try:
        with conn.cursor() as cursor:
            # Fetch verified NFTs
            cursor.execute("""
                SELECT contract_address FROM transform.verification 
                WHERE verified = TRUE AND token_type = 'ERC721' AND promoted IS FALSE;
            """)
            verified_nfts = cursor.fetchall()

            for nft in verified_nfts:
                contract_address = nft[0]
                # Copy NFT data from transform.nft to public.nft
                cursor.execute("""
                    INSERT INTO public.nfts (contract_address_token_id, collection_id, contract_address, deployer_address, token_type, token_uri_gateway, nft_description, token_id, creation_date, media_url, nft_sales_link, nft_licence, nft_context, nft_utility, category, owners, publisher_id)
                    SELECT contract_address_token_id, collection_id, contract_address, deployer_address, token_type, token_uri_gateway, nft_description, token_id, creation_date, media_url, nft_sales_link, nft_licence, nft_context, nft_utility, category, owners, publisher_id
                    FROM transform.nft
                    WHERE contract_address = %s
                    ON CONFLICT (contract_address_token_id) DO UPDATE SET
                        token_uri_gateway = EXCLUDED.token_uri_gateway,
                        nft_description = EXCLUDED.nft_description,
                        media_url = EXCLUDED.media_url,
                        nft_sales_link = EXCLUDED.nft_sales_link,
                        nft_licence = EXCLUDED.nft_licence,
                        nft_context = EXCLUDED.nft_context,
                        nft_utility = EXCLUDED.nft_utility,
                        category = EXCLUDED.category,
                        owners = EXCLUDED.owners,
                        publisher_id = EXCLUDED.publisher_id;
                """, (contract_address,))
                conn.commit()
                # Mark as promoted
                cursor.execute("""
                    UPDATE transform.verification
                    SET promoted = TRUE
                    WHERE contract_address = %s;
                """, (contract_address,))
                conn.commit()
                print(f"NFT {contract_address} promoted to production.")
    except (Exception, Error) as error:
        print(f"Error promoting NFTs: {error}")
        conn.rollback()
    finally:
        conn.close()

def promote_publishers():
    conn = connect_db()
    if conn is None:
        return

    try:
        with conn.cursor() as cursor:
            # Fetch verified and non-promoted publishers
            cursor.execute("""
                SELECT DISTINCT publisher_id FROM transform.publisher
                WHERE promoted = FALSE;
            """)
            publishers = cursor.fetchall()

            for publisher in publishers:
                publisher_id = publisher[0]
                # Copy publisher data from transform.publisher to public.publisher
                cursor.execute("""
                    INSERT INTO public.publishers (publisher_id, name, description, media_url, contract_address)
                    SELECT publisher_id, name, description, media_url, contract_address
                    FROM transform.publisher
                    WHERE publisher_id = %s
                    ON CONFLICT (contract_address) DO UPDATE SET
                        name = EXCLUDED.name,
                        description = EXCLUDED.description,
                        media_url = EXCLUDED.media_url,
                        updated_at = EXCLUDED.updated_at;
                """, (publisher_id,))
                conn.commit()
                # Mark as promoted
                cursor.execute("""
                    UPDATE transform.publisher
                    SET promoted = TRUE
                    WHERE publisher_id = %s;
                """, (publisher_id,))
                conn.commit()
                print(f"Publisher {publisher_id} promoted to public.")
    except (Exception, Error) as error:
        print(f"Error promoting publishers: {error}")
        conn.rollback()
    finally:
        conn.close()

def promote_collections():
    conn = connect_db()
    if conn is None:
        return

    try:
        with conn.cursor() as cursor:
            # Fetch non-promoted collections
            cursor.execute("""
                SELECT DISTINCT collection_id FROM transform.collection
                WHERE promoted = FALSE;
            """)
            collections = cursor.fetchall()

            for collection in collections:
                collection_id = collection[0]
                # Copy collection data from transform.collection to public.collection
                cursor.execute("""
                    INSERT INTO public.collections (collection_id, collection_name, collection_description, media_url, collection_utility, category, num_owners, num_likes, deployer_address, contract_address, token_type, nft_licence, universe_id, publisher_id)
                    SELECT collection_id, collection_name, collection_description, media_url, collection_utility, category, num_owners, num_likes, deployer_address, contract_address, token_type, nft_licence, NULL, publisher_id
                    FROM transform.collection
                    WHERE collection_id = %s
                    ON CONFLICT (collection_id) DO UPDATE SET
                        collection_name = COALESCE(EXCLUDED.collection_name, public.collections.collection_name),
                        collection_description = COALESCE(EXCLUDED.collection_description, public.collections.collection_description),
                        media_url = COALESCE(EXCLUDED.media_url, public.collections.media_url),
                        collection_utility = COALESCE(EXCLUDED.collection_utility, public.collections.collection_utility),
                        category = COALESCE(EXCLUDED.category, public.collections.category),
                        num_owners = COALESCE(EXCLUDED.num_owners, public.collections.num_owners),
                        num_likes = COALESCE(EXCLUDED.num_likes, public.collections.num_likes),
                        deployer_address = COALESCE(EXCLUDED.deployer_address, public.collections.deployer_address),
                        contract_address = COALESCE(EXCLUDED.contract_address, public.collections.contract_address),
                        token_type = COALESCE(EXCLUDED.token_type, public.collections.token_type),
                        nft_licence = COALESCE(EXCLUDED.nft_licence, public.collections.nft_licence),
                        publisher_id = COALESCE(EXCLUDED.publisher_id, public.collections.publisher_id);
                """, (collection_id,))
                conn.commit()
                
                # Mark as promoted
                cursor.execute("""
                    UPDATE transform.collection
                    SET promoted = TRUE
                    WHERE collection_id = %s;
                """, (collection_id,))
                conn.commit()
                print(f"Collection {collection_id} promoted to public.")
    except (Exception, Error) as error:
        print(f"Error promoting collections: {error}")
        conn.rollback()
    finally:
        conn.close()

def promote():
    promote_publishers()
    promote_collections()
    promote_verified_tokens()
    promote_verified_nfts()

if __name__ == "__main__":
    promote()