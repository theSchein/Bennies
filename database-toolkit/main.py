# main.py is the entry point for the CLI application
# source venv/bin/activate
import argparse
from actions.check_duplicates import check_duplicates
from actions.fetch_metadata import fetch_metadata
from actions.update_checksum import update_checksum
from actions.validate_collections import validate_collections

def main():
    parser = argparse.ArgumentParser(description="Data Management Toolkit CLI")
    subparsers = parser.add_subparsers(dest="command")

    parser_dup = subparsers.add_parser('check_duplicates', help='Check for duplicate entries')
    parser_fetch = subparsers.add_parser('fetch_metadata', help='Fetch and update metadata')
    parser_checksum = subparsers.add_parser('update_checksum', help='Update checksum addresses')
    parser_validate = subparsers.add_parser('validate_collections', help='Validate collections data')

    args = parser.parse_args()

    if args.command == 'check_duplicates':
        check_duplicates()
    elif args.command == 'fetch_metadata':
        fetch_metadata()
    elif args.command == 'update_checksum':
        update_checksum()
    elif args.command == 'validate_collections':
        validate_collections()

if __name__ == '__main__':
    main()
