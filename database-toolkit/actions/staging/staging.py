# actions/staging/staging.py
from .add_staging import add_staging
from .check_staging import check_staging
from .user_submissions import user_submissions

def staging_menu():
    print("Staging Menu")
    print("1. Add Collection and Twitter to Staging")
    print("2. Check Staging Table")
    print("3. Review User Submissions")
    print("0. Return to main menu")
    choice = input("Enter your choice: ")

    if choice == '1':
        add_staging()
    elif choice == '2':
        check_staging()
    elif choice == '3':
        user_submissions()
    elif choice == '0':
        print("Returning to the main menu.")
        return
    else:
        print("Invalid choice. Please try again.")
        staging_menu()

def staging():
    print("Starting the staging process...")
    staging_menu()

if __name__ == '__main__':
    staging()
