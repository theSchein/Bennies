# connection.py
import psycopg2
from psycopg2.extras import DictCursor
from helpers.config import load_db
import os


DATABASE_URL = os.getenv("POSTGRES_URL")


def connect_db():
    """Creates a connection to the PostgreSQL database using configuration loaded from the environment."""
    config = load_db()
    try:
        # Connect using the connection parameters
        conn = psycopg2.connect(DATABASE_URL)
        print("Database connection established.")
        return conn
    except psycopg2.DatabaseError as error:
        print(f"Failed to connect to database: {error}")
        return None
