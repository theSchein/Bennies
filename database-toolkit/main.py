from actions.check_duplicates import check_duplicates
from actions.fetch_metadata import fetch_metadata
from actions.update_checksum import update_checksum
from actions.validate_collections import validate_collections
from actions.staging.staging import staging

def main_menu():
    print("Welcome to the Data Management Toolkit CLI")
    print("1. Add to Staging environment")
    print("2. Check for duplicate entries")
    print("3. Fetch and update metadata")
    print("4. Update checksum addresses")
    print("5. Validate collections data")
    print("0. Exit")
    choice = input("Enter your choice: ")

    if choice == '1':
        staging()
    elif choice == '2':
        check_duplicates()
    elif choice == '3':
        fetch_metadata()
    elif choice == '4':
        update_checksum()
    elif choice == '5':
        validate_collections()
    elif choice == '0':
        print("Exiting the program.")
        exit()
    else:
        print("Invalid choice. Please try again.")
        main_menu()

if __name__ == '__main__':
    main_menu()
