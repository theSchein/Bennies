# source venv/bin/activate
from actions.staging.staging import staging
from actions.cleanup.cleanup import cleanup
from actions.backup.backup import backup
from actions.execute.execute_metadata import execute_metadata
from actions.execute.execute_twitter import execute_twitter
from actions.verify.verify_metadata import verify_metadata
from actions.promotion.promotion import promote
from actions.verify.verify_twitter import verify_and_promote_twitter
from actions.spam.spam import spam
from actions.update.update_tweets import update_twitter
from actions.staging.add_tokens import add_tokens

def main_menu():
    print("Welcome to the Data Management Toolkit CLI")
    print("1. Add to Staging environment")
    print("2. Clean up Prod Database")
    print("3. Back Up Database")
    print("4. Add Metadata to Transform")
    print("5. Add Twitter data to Transform table")
    print("6. Verify Metadata in Transform table")
    print("7. Promote verified data to Production")
    print("8. Verify and Promote Twitter data")
    print("9. Migrate Spam data")
    print("10. Update Twitter data in Production")
    print("11. Add tokens to staging")
    print("0. Exit")
    choice = input("Enter your choice: ")

    if choice == '1':
        staging()
    elif choice == '2':
        cleanup()
    elif choice == '3':
        backup()
    elif choice == '4':
        execute_metadata()
    elif choice == '5':
        execute_twitter()
    elif choice == '6':
        verify_metadata()
    elif choice == '7':
        promote()
    elif choice == '8':
        verify_and_promote_twitter()
    elif choice == '9':
        spam()
    elif choice == '10':
        update_twitter()
    elif choice == '11':
        add_tokens()
    elif choice == '0':
        print("Exiting the program.")
        exit()
    else:
        print("Invalid choice. Please try again.")
        main_menu()

if __name__ == '__main__':
    main_menu()
