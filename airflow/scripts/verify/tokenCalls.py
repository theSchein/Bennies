from db.connection import connect_db
from psycopg2.extras import DictCursor
from web3 import Web3
from web3.exceptions import InvalidAddress
from s3.queries import upload_file_to_s3
from utils.externalApiCalls import fetch_erc20_alchemy, fetch_erc20_moralis
from psycopg2 import Error

def check_token_duplicates(conn, contract_address):
    cursor = conn.cursor(cursor_factory=DictCursor)
    print("Checking for duplicates in the token database...")

    try:
        cursor.execute("""
            SELECT contract_address, COUNT(*)
            FROM transform.token
            WHERE contract_address = %s
            GROUP BY contract_address
            HAVING COUNT(*) > 1
        """, (contract_address,))
        token_duplicates = cursor.fetchall()

        return not bool(token_duplicates)

    except Exception as e:
        print(f"An error occurred: {e}")
        return False
    finally:
        cursor.close()


def fill_token_metadata(conn, contract_address):
    print("Fetching token metadata and updating database...")

    cursor = conn.cursor(cursor_factory=DictCursor)
    try:
        cursor.execute("""
            SELECT contract_address, token_name, token_symbol, logo_media
            FROM transform.token
            WHERE contract_address = %s
        """, (contract_address,))
        token = cursor.fetchone()

        if not token:
            print(f"No token found with contract address {contract_address}.")
            return False

        token_name = token.get('token_name')
        token_symbol = token.get('token_symbol')
        logo_media = token.get('logo_media')

        if not token_name or not token_symbol or not logo_media:
            print("Missing metadata found. Fetching from Alchemy and Moralis APIs...")

            # Fetch metadata from Alchemy
            token_data = fetch_erc20_alchemy(contract_address)
            if not token_data:
                # Fetch metadata from Moralis if Alchemy fails
                token_data = fetch_erc20_moralis(contract_address)

            if token_data:
                token_name = token_data.get('name', token_name)
                token_symbol = token_data.get('symbol', token_symbol)
                logo_media = token_data.get('logo', None)  # Set to None if not found

                # Update the database with the fetched metadata
                cursor.execute("""
                    UPDATE transform.token
                    SET token_name = %s, token_symbol = %s, logo_media = %s
                    WHERE contract_address = %s
                """, (token_name, token_symbol, logo_media, contract_address))
                conn.commit()
                print(f"Updated token {contract_address} with name: {token_name}, symbol: {token_symbol}, and logo media: {logo_media}")
            else:
                print(f"Failed to fetch metadata for token with contract address {contract_address}.")

        return True

    except Exception as error:
        print(f"An error occurred while fetching/updating token metadata: {error}")
        conn.rollback()
        return False
    finally:
        cursor.close()


def process_token_logo(conn, contract_address):
    cursor = conn.cursor(cursor_factory=DictCursor)
    try:
        print("Fetching token with missing logo media URLs...")
        cursor.execute("""
            SELECT * FROM transform.token WHERE contract_address = %s AND logo_media IS NOT NULL AND logo_media NOT LIKE 'https://shuk.nyc3.cdn.digitaloceanspaces.com/%%'
        """, (contract_address,))
        token = cursor.fetchone()

        if not token:
            print("No token with missing logo media URLs found.")
            return True

        logo_media = token.get('logo_media', None)
        contract_address = token.get('contract_address', None)

        if not logo_media or not contract_address:
            print(f"Skipping token due to missing data: {token}")
            return False

        new_logo_url = upload_file_to_s3(logo_media, f"token_logos/{contract_address}", "shuk")
        cursor.execute("""
            UPDATE transform.token SET logo_media = %s WHERE contract_address = %s
        """, (new_logo_url, contract_address))
        conn.commit()
        print(f"Updated token {contract_address} with new logo media URL: {new_logo_url}")

        return True
    except Exception as error:
        print(f"Failed to process token logos: {error}")
        conn.rollback()
        return False
    finally:
        cursor.close()


def verify_token_checksums(conn, contract_address):
    cursor = conn.cursor(cursor_factory=DictCursor)
    try:
        print("Verifying token checksums...")
        cursor.execute("""
            SELECT contract_address, token_name FROM transform.token WHERE contract_address = %s
        """, (contract_address,))
        token = cursor.fetchone()

        if not token:
            print("No token found with contract address:", contract_address)
            return True

        address, name = token['contract_address'], token['token_name']
        try:
            new_address = Web3.to_checksum_address(address)
            if address != new_address:
                cursor.execute("""
                    UPDATE transform.token SET contract_address = %s WHERE contract_address = %s;
                """, (new_address, address))
                conn.commit()
                print(f"Updated {address} to {new_address}")
        except InvalidAddress:
            print(f"Invalid Ethereum address format detected for {name}: {address}. Address may be too long or contain invalid characters.")

        print("Checksum verification and update completed.")
        return True
    except Exception as e:
        print(f"An error occurred during checksum verification and update: {e}")
        conn.rollback()
        return False
    finally:
        cursor.close()
