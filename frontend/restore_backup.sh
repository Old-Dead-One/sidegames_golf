#!/bin/bash

# Database restoration script for PostgreSQL backup file
echo "🔄 Starting database restoration..."

# Supabase project details
PROJECT_REF="oknfmsitxnfocwhlerul"
HOST="db.${PROJECT_REF}.supabase.co"
USER="postgres"
DATABASE="postgres"
PASSWORD="Ibirapuita9181$"
BACKUP_FILE="/Users/alanmcgraw/Downloads/db_cluster-25-03-2025@21-22-53.backup"

echo "📊 Project: ${PROJECT_REF}"
echo "🌐 Host: ${HOST}"
echo "📁 Backup: ${BACKUP_FILE}"

# Set password environment variable
export PGPASSWORD="${PASSWORD}"

# Restore the database
echo "🔄 Restoring database..."
pg_restore \
  --host="${HOST}" \
  --port=5432 \
  --username="${USER}" \
  --dbname="${DATABASE}" \
  --clean \
  --if-exists \
  --verbose \
  "${BACKUP_FILE}"

# Check if restoration was successful
if [ $? -eq 0 ]; then
    echo "✅ Database restoration completed successfully!"
else
    echo "❌ Database restoration failed!"
    exit 1
fi

# Clear password from environment
unset PGPASSWORD

echo "🎉 Restoration process complete!" 