# connection.py
import psycopg2
from psycopg2.extras import DictCursor
from utils.config import load_db

def connect_db():
    """Creates a connection to the PostgreSQL database using configuration loaded from the environment."""
    config = load_db()
    try:
        # Connect using the connection parameters
        conn = psycopg2.connect(
            dbname=config['dbname'],
            user=config['user'],
            password=config['password'],
            host=config['host']
        )
        return conn
    except psycopg2.DatabaseError as error:
        print(f"Failed to connect to database: {error}")
        return None
