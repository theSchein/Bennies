import psycopg2
from psycopg2 import sql
from psycopg2 import Error
from dotenv import load_dotenv
import os

load_dotenv(dotenv_path='.env.local')

DATABASE_URL = os.getenv("POSTGRES_URL")


def spam(threshold=3):
    try:
        # Connect to the database
        conn = psycopg2.connect(DATABASE_URL)
        cursor = conn.cursor()

        # Select entries from the staging table that meet the threshold and are not already filtered
        select_query = sql.SQL("""
            SELECT spam_id, contract_address, name, token_type, flagged_count, last_flagged
            FROM staging.spam
            WHERE flagged_count >= %s AND filtered_out = FALSE
        """)
        cursor.execute(select_query, (threshold,))
        spam_entries = cursor.fetchall()

        if not spam_entries:
            print("No spam entries to migrate.")
            return

        # Insert selected entries into the production table and mark them as filtered in the staging table
        insert_query = sql.SQL("""
            INSERT INTO public.spam (spam_id, contract_address, token_type, name)
            VALUES (%s, %s, %s, %s)
            ON CONFLICT (contract_address) DO NOTHING;
        """)
        
        update_query = sql.SQL("""
            UPDATE staging.spam
            SET filtered_out = TRUE
            WHERE spam_id = %s;
        """)

        for entry in spam_entries:
            spam_id, contract_address, name, token_type, flagged_count, last_flagged = entry

            # Insert into the production table
            cursor.execute(insert_query, (spam_id, contract_address, token_type, name))

            # Update the staging table to mark as filtered
            cursor.execute(update_query, (spam_id,))

        conn.commit()
        print(f"Migrated {len(spam_entries)} spam entries to the production table.")

    except Exception as e:
        print(f"An error occurred during migration: {e}")
        if conn:
            conn.rollback()
    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()

if __name__ == "__main__":
    spam()
