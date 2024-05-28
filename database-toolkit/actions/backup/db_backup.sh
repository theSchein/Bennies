#!/bin/bash

# Ensure BACKUP_DIR is set and writable
if [ -z "$BACKUP_DIR" ]; then
    echo "BACKUP_DIR is not set in the environment"
    exit 1
fi



# Date format specification for backup files
DATE=$(date +%Y-%m-%d-%H%M%S)

# Backup filename
FILE_NAME="$BACKUP_DIR/$POSTGRES_DATABASE-$DATE.sql"

# Email to send Notifications
EMAIL="ben@bennies.fun"

# Number of days to keep the directory contents
DAYS_TO_KEEP=7

# Create a backup
export PGPASSWORD=$POSTGRES_PASSWORD
pg_dump -U $POSTGRES_USER -h $POSTGRES_HOST $POSTGRES_DATABASE > $FILE_NAME

# Check the success of the pg_dump command
if [ $? -eq 0 ]; then
  echo "Database backup successful!"
  # Compress backup
  gzip $FILE_NAME
  echo "Backup compressed successfully."
  # Send a notification email
  if command -v mail &> /dev/null; then
    echo "Backup of database $POSTGRES_DATABASE completed successfully on $DATE" | mail -s "Database Backup Notification" $EMAIL
  else
    echo "mail command not found. Skipping email notification."
  fi
else
  echo "An error occurred during the backup process" | mail -s "Database Backup Failed" $EMAIL
fi

# Clean up old backups NOT NECESSARY YET
#find $BACKUP_DIR -type f -name '*.gz' -mtime +$DAYS_TO_KEEP -exec rm {} \;
#echo "Old backups cleaned up successfully."
