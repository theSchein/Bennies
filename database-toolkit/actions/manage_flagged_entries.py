import argparse
from db.connection import get_connection
from db.queries import fetch_all, execute_query

def list_flagged_entries():
    """Lists all flagged entries that need review."""
    query = "SELECT id, entry_data FROM entries WHERE flagged = TRUE"
    with get_connection() as conn:
        entries = fetch_all(conn, query)
    for entry in entries:
        print(f"ID: {entry['id']}, Data: {entry['entry_data']}")

def view_entry(entry_id):
    """Displays a specific entry by ID."""
    query = "SELECT id, entry_data FROM entries WHERE id = %s"
    with get_connection() as conn:
        entry = fetch_one(conn, query, (entry_id,))
    if entry:
        print(f"ID: {entry['id']}, Data: {entry['entry_data']}")
    else:
        print("Entry not found.")

def update_entry(entry_id, new_data):
    """Updates a specific entry with new data."""
    query = "UPDATE entries SET entry_data = %s WHERE id = %s"
    with get_connection() as conn:
        success = execute_query(conn, query, (new_data, entry_id))
    if success:
        print("Entry updated successfully.")
    else:
        print("Failed to update entry.")


def manage_flagged_entries():
    parser = argparse.ArgumentParser(description="Manage Flagged Entries")
    subparsers = parser.add_subparsers(dest="command")

    # List entries
    parser_list = subparsers.add_parser('list', help='List all flagged entries')

    # View specific entry
    parser_view = subparsers.add_parser('view', help='View details of a specific entry')
    parser_view.add_argument('id', type=int, help='ID of the entry to view')

    # Update specific entry
    parser_update = subparsers.add_parser('update', help='Update a specific entry')
    parser_update.add_argument('id', type=int, help='ID of the entry to update')
    parser_update.add_argument('new_data', type=str, help='New data to update the entry with')

    args = parser.parse_args()

    if args.command == 'list':
        list_flagged_entries()
    elif args.command == 'view':
        view_entry(args.id)
    elif args.command == 'update':
        update_entry(args.id, args.new_data)

if __name__ == '__main__':
    manage_flagged_entries()
