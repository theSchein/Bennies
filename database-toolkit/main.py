# source venv/bin/activate
from actions.staging.staging import staging
from actions.cleanup.cleanup import cleanup

def main_menu():
    print("Welcome to the Data Management Toolkit CLI")
    print("1. Add to Staging environment")
    print("2. Clean up Prod Database")
    print("0. Exit")
    choice = input("Enter your choice: ")

    if choice == '1':
        staging()
    elif choice == '2':
        cleanup()
    elif choice == '0':
        print("Exiting the program.")
        exit()
    else:
        print("Invalid choice. Please try again.")
        main_menu()

if __name__ == '__main__':
    main_menu()
