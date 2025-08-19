#!/bin/bash

# Backup database script

# Set variables
DB_NAME="your_database_name"
DB_USER="your_database_user"
DB_PASSWORD="your_database_password"
BACKUP_DIR="../database/backups"
DATE=$(date +"%Y%m%d%H%M")

# Create backup directory if it doesn't exist
mkdir -p $BACKUP_DIR

# Create a backup
mysqldump -u $DB_USER -p$DB_PASSWORD $DB_NAME > $BACKUP_DIR/db_backup_$DATE.sql

# Check if the backup was successful
if [ $? -eq 0 ]; then
    echo "Database backup successful: $BACKUP_DIR/db_backup_$DATE.sql"
else
    echo "Database backup failed"
fi