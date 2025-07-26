#!/usr/bin/env python3
"""
Supabase Database Restoration Script
This script helps restore your Supabase database from a backup.
"""

import os
import sys
import psycopg2
from psycopg2.extensions import ISOLATION_LEVEL_AUTOCOMMIT
import argparse
from pathlib import Path

def connect_to_supabase(host, database, user, password, port=5432):
    """Connect to Supabase database"""
    try:
        connection = psycopg2.connect(
            host=host,
            database=database,
            user=user,
            password=password,
            port=port
        )
        connection.set_isolation_level(ISOLATION_LEVEL_AUTOCOMMIT)
        print(f"✅ Successfully connected to {database} on {host}")
        return connection
    except Exception as e:
        print(f"❌ Failed to connect to database: {e}")
        return None

def execute_sql_file(connection, sql_file_path):
    """Execute SQL file against the database"""
    try:
        with open(sql_file_path, 'r') as file:
            sql_content = file.read()
        
        cursor = connection.cursor()
        cursor.execute(sql_content)
        connection.commit()
        cursor.close()
        print(f"✅ Successfully executed SQL file: {sql_file_path}")
        return True
    except Exception as e:
        print(f"❌ Failed to execute SQL file: {e}")
        return False

def restore_from_sql_dump(host, database, user, password, sql_file_path, port=5432):
    """Restore database from SQL dump file"""
    print("🔄 Starting database restoration...")
    
    # Connect to database
    connection = connect_to_supabase(host, database, user, password, port)
    if not connection:
        return False
    
    # Execute SQL file
    success = execute_sql_file(connection, sql_file_path)
    
    # Close connection
    connection.close()
    
    if success:
        print("🎉 Database restoration completed successfully!")
    else:
        print("💥 Database restoration failed!")
    
    return success

def main():
    parser = argparse.ArgumentParser(description='Restore Supabase database from backup')
    parser.add_argument('--host', required=True, help='Database host (e.g., db.project-ref.supabase.co)')
    parser.add_argument('--database', default='postgres', help='Database name (default: postgres)')
    parser.add_argument('--user', default='postgres', help='Database user (default: postgres)')
    parser.add_argument('--password', required=True, help='Database password')
    parser.add_argument('--port', type=int, default=5432, help='Database port (default: 5432)')
    parser.add_argument('--sql-file', required=True, help='Path to SQL dump file')
    
    args = parser.parse_args()
    
    # Check if SQL file exists
    if not os.path.exists(args.sql_file):
        print(f"❌ SQL file not found: {args.sql_file}")
        sys.exit(1)
    
    # Restore database
    success = restore_from_sql_dump(
        args.host,
        args.database,
        args.user,
        args.password,
        args.sql_file,
        args.port
    )
    
    sys.exit(0 if success else 1)

if __name__ == "__main__":
    main() 