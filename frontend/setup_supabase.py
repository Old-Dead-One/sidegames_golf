#!/usr/bin/env python3
"""
Supabase Setup and Restoration Helper
This script guides you through setting up a new Supabase project and restoring your database.
"""

import os
import sys
import json
from pathlib import Path

def print_header():
    print("=" * 60)
    print("🚀 SUPABASE SETUP & RESTORATION HELPER")
    print("=" * 60)

def print_step(step_num, title):
    print(f"\n📋 STEP {step_num}: {title}")
    print("-" * 40)

def get_user_input(prompt, default=None):
    """Get user input with optional default value"""
    if default:
        user_input = input(f"{prompt} (default: {default}): ").strip()
        return user_input if user_input else default
    else:
        return input(f"{prompt}: ").strip()

def find_backup_files():
    """Find potential backup files on the system"""
    print_step(1, "FINDING BACKUP FILES")
    
    # Common locations for backup files
    search_paths = [
        Path.home() / "Desktop",
        Path.home() / "Downloads", 
        Path.home() / "Documents",
        Path.cwd()
    ]
    
    backup_files = []
    
    for search_path in search_paths:
        if search_path.exists():
            print(f"🔍 Searching in: {search_path}")
            
            # Look for SQL files
            for sql_file in search_path.rglob("*.sql"):
                backup_files.append(sql_file)
            
            # Look for backup files
            for backup_file in search_path.rglob("*backup*"):
                if backup_file.is_file():
                    backup_files.append(backup_file)
    
    if backup_files:
        print(f"\n✅ Found {len(backup_files)} potential backup files:")
        for i, file in enumerate(backup_files, 1):
            print(f"   {i}. {file}")
        
        choice = get_user_input("\nSelect backup file number (or press Enter to skip): ")
        if choice.isdigit() and 1 <= int(choice) <= len(backup_files):
            return backup_files[int(choice) - 1]
    
    print("❌ No backup files found automatically.")
    manual_path = get_user_input("Enter path to your backup file manually: ")
    if manual_path and Path(manual_path).exists():
        return Path(manual_path)
    
    return None

def get_supabase_credentials():
    """Get Supabase project credentials from user"""
    print_step(2, "SUPABASE PROJECT CREDENTIALS")
    
    print("📝 You need to create a new Supabase project or unpause your existing one.")
    print("   Visit: https://supabase.com/dashboard")
    
    project_ref = get_user_input("Enter your project reference ID (e.g., abcdefghijklmnop): ")
    database_password = get_user_input("Enter your database password: ")
    
    if not project_ref or not database_password:
        print("❌ Project reference ID and database password are required!")
        return None, None
    
    return project_ref, database_password

def create_env_file(project_ref, database_password):
    """Create or update .env file with new credentials"""
    print_step(3, "UPDATING ENVIRONMENT FILE")
    
    env_content = f"""# Supabase Configuration
VITE_SUPABASE_URL=https://{project_ref}.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here

# App Configuration
VITE_APP_NAME=SideGames Golf
VITE_APP_VERSION=1.0.0
VITE_APP_ENVIRONMENT=production

# Database Configuration (for restoration)
SUPABASE_PROJECT_REF={project_ref}
SUPABASE_DB_PASSWORD={database_password}
"""
    
    env_file = Path(".env.local")
    with open(env_file, "w") as f:
        f.write(env_content)
    
    print(f"✅ Created {env_file}")
    print("⚠️  You still need to add your anon key from the Supabase dashboard!")

def generate_restore_command(project_ref, database_password, backup_file):
    """Generate the command to restore the database"""
    print_step(4, "RESTORATION COMMAND")
    
    host = f"db.{project_ref}.supabase.co"
    
    print("🔧 To restore your database, run this command:")
    print("=" * 60)
    print(f"python restore_database.py \\")
    print(f"  --host {host} \\")
    print(f"  --user postgres \\")
    print(f"  --password {database_password} \\")
    print(f"  --sql-file {backup_file}")
    print("=" * 60)
    
    # Also save to a script file
    script_content = f"""#!/bin/bash
# Database restoration script
python restore_database.py \\
  --host {host} \\
  --user postgres \\
  --password {database_password} \\
  --sql-file {backup_file}
"""
    
    script_file = Path("restore_db.sh")
    with open(script_file, "w") as f:
        f.write(script_content)
    
    os.chmod(script_file, 0o755)
    print(f"✅ Created executable script: {script_file}")

def main():
    print_header()
    
    # Find backup file
    backup_file = find_backup_files()
    if not backup_file:
        print("❌ No backup file found. Please ensure you have a SQL dump file.")
        return
    
    print(f"✅ Using backup file: {backup_file}")
    
    # Get Supabase credentials
    project_ref, database_password = get_supabase_credentials()
    if not project_ref or not database_password:
        print("❌ Missing Supabase credentials.")
        return
    
    # Create environment file
    create_env_file(project_ref, database_password)
    
    # Generate restore command
    generate_restore_command(project_ref, database_password, backup_file)
    
    print("\n🎉 SETUP COMPLETE!")
    print("\n📋 NEXT STEPS:")
    print("1. Go to your Supabase dashboard")
    print("2. Copy your 'anon public' key from Settings > API")
    print("3. Update the .env.local file with your anon key")
    print("4. Run the restoration script: ./restore_db.sh")
    print("5. Test your application: npm run dev")

if __name__ == "__main__":
    main() 