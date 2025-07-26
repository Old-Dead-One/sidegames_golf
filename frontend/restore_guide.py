#!/usr/bin/env python3
"""
Database Restoration Guide
This script helps you restore your Supabase database.
"""

import os
import sys
from pathlib import Path

def print_header():
    print("=" * 60)
    print("🗄️  SUPABASE DATABASE RESTORATION GUIDE")
    print("=" * 60)

def find_backup_file():
    """Help user find their backup file"""
    print("\n📁 STEP 1: LOCATE YOUR BACKUP FILE")
    print("-" * 40)
    
    print("Please tell me where your Supabase database backup is located.")
    print("Common locations:")
    print("  - Downloads folder")
    print("  - Desktop")
    print("  - Documents")
    print("  - A specific folder you created")
    
    while True:
        backup_path = input("\nEnter the full path to your backup file: ").strip()
        
        if not backup_path:
            print("❌ Please provide a path.")
            continue
            
        backup_file = Path(backup_path)
        
        if not backup_file.exists():
            print(f"❌ File not found: {backup_path}")
            continue
            
        if backup_file.is_file():
            print(f"✅ Found backup file: {backup_file}")
            return backup_file
        else:
            print(f"❌ {backup_path} is not a file.")

def get_supabase_credentials():
    """Get Supabase credentials from user"""
    print("\n🔑 STEP 2: SUPABASE CREDENTIALS")
    print("-" * 40)
    
    print("You need to get these from your new Supabase project:")
    print("1. Go to: https://supabase.com/dashboard/project/oknfmsitxnfocwhlerul")
    print("2. Go to Settings > Database")
    print("3. Copy the connection info")
    
    project_ref = "oknfmsitxnfocwhlerul"  # We already know this
    database_password = input("Enter your database password: ").strip()
    
    if not database_password:
        print("❌ Database password is required!")
        return None, None
    
    return project_ref, database_password

def create_restore_script(project_ref, database_password, backup_file):
    """Create the restoration script"""
    print("\n🔧 STEP 3: CREATE RESTORATION SCRIPT")
    print("-" * 40)
    
    host = f"db.{project_ref}.supabase.co"
    
    script_content = f"""#!/bin/bash
# Database restoration script for project: {project_ref}
echo "🔄 Starting database restoration..."

python restore_database.py \\
  --host {host} \\
  --user postgres \\
  --password {database_password} \\
  --sql-file "{backup_file}"

echo "✅ Restoration complete!"
"""
    
    script_file = Path("restore_db.sh")
    with open(script_file, "w") as f:
        f.write(script_content)
    
    os.chmod(script_file, 0o755)
    print(f"✅ Created restoration script: {script_file}")
    
    print("\n📋 RESTORATION COMMAND:")
    print("=" * 50)
    print(f"python restore_database.py \\")
    print(f"  --host {host} \\")
    print(f"  --user postgres \\")
    print(f"  --password [YOUR_PASSWORD] \\")
    print(f"  --sql-file {backup_file}")
    print("=" * 50)

def main():
    print_header()
    
    # Find backup file
    backup_file = find_backup_file()
    
    # Get credentials
    project_ref, database_password = get_supabase_credentials()
    if not project_ref or not database_password:
        print("❌ Missing credentials. Exiting.")
        return
    
    # Create restore script
    create_restore_script(project_ref, database_password, backup_file)
    
    print("\n🎉 SETUP COMPLETE!")
    print("\n📋 NEXT STEPS:")
    print("1. Get your anon key from Supabase dashboard > Settings > API")
    print("2. Update .env file with your anon key")
    print("3. Run: ./restore_db.sh")
    print("4. Test your app: npm run dev")
    
    print("\n⚠️  IMPORTANT:")
    print("- Make sure your new Supabase project is active")
    print("- The database password is the one you set when creating the project")
    print("- Your anon key is different from the database password")

if __name__ == "__main__":
    main() 