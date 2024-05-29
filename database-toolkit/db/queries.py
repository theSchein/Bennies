# queries.py
def execute_query(connection, query, params=None, commit=False):
    """Execute a SQL query with optional parameters and commit option."""
    with connection.cursor() as cursor:
        try:
            cursor.execute(query, params)
            if commit:
                connection.commit()
            return True
        except Exception as e:
            print(f"An error occurred while executing the query: {e}")
            return False

def fetch_all(connection, query, params=None):
    """Fetch all rows from a SQL query."""
    with connection.cursor(cursor_factory=DictCursor) as cursor:
        try:
            cursor.execute(query, params)
            return cursor.fetchall()
        except Exception as e:
            print(f"An error occurred while fetching data: {e}")
            return []

def fetch_one(connection, query, params=None):
    """Fetch the first row from a SQL query."""
    with connection.cursor(cursor_factory=DictCursor) as cursor:
        try:
            cursor.execute(query, params)
            return cursor.fetchone()
        except Exception as e:
            print(f"An error occurred while fetching data: {e}")
            return None
