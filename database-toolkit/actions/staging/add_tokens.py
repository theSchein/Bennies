import requests
import json
import time
from psycopg2 import connect, sql
from psycopg2.extras import execute_values, DictCursor
from dotenv import load_dotenv
import os
from moralis import evm_api
from db.connection import connect_db

load_dotenv(dotenv_path='.env.local')

# Moralis API key
MORALIS_API_KEY = os.getenv('MORALIS_API_KEY')

# Fetch tokens from The Graph (Uniswap)
def fetch_the_graph_tokens():
    print("Fetching tokens from The Graph")
    url = "https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v2"
    query_template = """
    {{
      tokens(first: 1000, skip: {skip}) {{
        id
      }}
    }}
    """
    all_tokens = []
    skip = 0

    while skip <= 5000:
        query = query_template.format(skip=skip)
        print(f"Executing query: {query}")
        response = requests.post(url, json={'query': query})
        if response.status_code == 200:
            try:
                tokens = response.json()['data']['tokens']
                if not tokens:
                    break
                all_tokens.extend(tokens)
                skip += 1000
            except KeyError:
                print(f"Unexpected response format: {response.json()}")
                break
        else:
            print("Failed to fetch data from The Graph")
            break

    return all_tokens

# Fetch token metadata from Moralis
def fetch_moralis_token_metadata(contract_addresses):
    results = []
    for address in contract_addresses:
        try:
            params = {
                "chain": "eth",
                "addresses": [address]
            }
            result = evm_api.token.get_token_metadata(
                api_key=MORALIS_API_KEY,
                params=params,
            )
            results.extend(result)
        except Exception as e:
            print(f"Error fetching metadata for address {address}: {e}")
            continue
    return results

# Insert data into staging table
def insert_into_staging(conn, tokens):
    with conn.cursor() as cursor:
        query = """
        INSERT INTO staging.staging_data (contract_address, token_type, data)
        VALUES %s
        ON CONFLICT (contract_address) DO NOTHING
        """
        values = [(token['address'], 'ERC20', json.dumps(token)) for token in tokens if not token.get('possible_spam')]
        execute_values(cursor, query, values)
        conn.commit()
        print(f"Inserted {len(values)} tokens into staging.")

def add_tokens():
    conn = connect_db()
    if conn is None:
        return

    tokens_to_insert = []

    # Fetch and process tokens from The Graph (Uniswap)
    the_graph_tokens = fetch_the_graph_tokens()
    the_graph_contract_addresses = [token['id'] for token in the_graph_tokens]

    # Combine contract addresses
    combined_contract_addresses = list(set(the_graph_contract_addresses))

    # Fetch token metadata from Moralis
    batch_size = 10  # Moralis API accepts a maximum of 10 addresses per request
    for i in range(0, len(combined_contract_addresses), batch_size):
        batch = combined_contract_addresses[i:i+batch_size]
        token_metadata = fetch_moralis_token_metadata(batch)
        tokens_to_insert.extend(token_metadata)

    # Insert tokens into staging
    insert_into_staging(conn, tokens_to_insert)

    conn.close()

if __name__ == "__main__":
    add_tokens()
