#!/bin/bash
# Database restoration script for project: oknfmsitxnfocwhlerul
echo "🔄 Starting database restoration..."

python restore_database.py \
  --host db.oknfmsitxnfocwhlerul.supabase.co \
  --user postgres \
  --password Ibirapuita9181$ \
  --sql-file "/Users/alanmcgraw/Downloads/db_cluster-25-03-2025@21-22-53.backup"

echo "✅ Restoration complete!"
