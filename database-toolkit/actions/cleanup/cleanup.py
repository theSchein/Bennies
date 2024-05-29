from .check_duplicates import check_duplicates
from .verify_checksum import verify_checksum
from .fill_metadata import fill_metadata
from .process_nft_images import process_nft_images

def cleanup_menu():
    print("Database Cleanup Menu")
    print("1. Check for duplicate entries")
    print("2. Verify Contract Checksums")
    print("3. Fill in Missing Fields")
    print("4. Upload Images to S3 Bucket")
    print("0. Return to main menu")
    choice = input("Enter your choice: ")

    if choice == '1':
        check_duplicates()
    elif choice == '2':
        verify_checksum()
    elif choice == '3':
        fill_metadata()
    elif choice == '4':
        process_nft_images()
    elif choice == '0':
        print("Returning to the main menu.")
        return
    else:
        print("Invalid choice. Please try again.")
        cleanup_menu()

    # Ask if user wants to perform another cleanup operation
    if input("Perform another cleanup operation? (yes/no): ").lower() == 'yes':
        cleanup_menu()

def cleanup():
    print("Starting the cleanup process...")
    cleanup_menu()
