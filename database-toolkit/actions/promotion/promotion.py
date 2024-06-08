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
                    INSERT INTO prod.token (contract_address, token_name, token_symbol, logo_media, creation_date, deployer_address, supply, decimals, token_utility, description, category)
                    SELECT contract_address, token_name, token_symbol, logo_media, creation_date, deployer_address, supply, decimals, token_utility, description, category
                    FROM transform.token
                    WHERE contract_address = %s
                    ON CONFLICT (contract_address) DO UPDATE SET
                        token_name = EXCLUDED.token_name,
                        token_symbol = EXCLUDED.token_symbol,
                        logo_media = EXCLUDED.logo_media,
                        creation_date = EXCLUDED.creation_date,
                        deployer_address = EXCLUDED.deployer_address,
                        supply = EXCLUDED.supply,
                        decimals = EXCLUDED.decimals,
                        token_utility = EXCLUDED.token_utility,
                        description = EXCLUDED.description,
                        category = EXCLUDED.category;
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
                # Copy NFT data from transform.nft to prod.nft
                cursor.execute("""
                    INSERT INTO prod.nft (contract_address_token_id, collection_id, contract_address, deployer_address, token_type, token_uri_gateway, nft_description, token_id, creation_date, media_url, nft_sales_link, nft_licence, nft_context, nft_utility, category, owners, publisher_id)
                    SELECT contract_address_token_id, collection_id, contract_address, deployer_address, token_type, token_uri_gateway, nft_description, token_id, creation_date, media_url, nft_sales_link, nft_licence, nft_context, nft_utility, category, owners, publisher_id
                    FROM transform.nft
                    WHERE contract_address = %s
                    ON CONFLICT (contract_address_token_id) DO UPDATE SET
                        collection_id = EXCLUDED.collection_id,
                        contract_address = EXCLUDED.contract_address,
                        deployer_address = EXCLUDED.deployer_address,
                        token_type = EXCLUDED.token_type,
                        token_uri_gateway = EXCLUDED.token_uri_gateway,
                        nft_description = EXCLUDED.nft_description,
                        token_id = EXCLUDED.token_id,
                        creation_date = EXCLUDED.creation_date,
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

def promote():
    promote_verified_tokens()
    promote_verified_nfts()

if __name__ == "__main__":
    promote()
