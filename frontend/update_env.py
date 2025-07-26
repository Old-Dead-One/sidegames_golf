#!/usr/bin/env python3
"""
Update environment file with new Supabase project ID
"""

import os
import re

def update_env_file():
    """Update .env file with new project ID"""
    
    # Read current .env file
    env_file = ".env"
    if not os.path.exists(env_file):
        print("❌ .env file not found!")
        return
    
    with open(env_file, 'r') as f:
        content = f.read()
    
    # Update the URL with new project ID
    new_project_id = "oknfmsitxnfocwhlerul"
    old_url_pattern = r'VITE_SUPABASE_URL=https://[^.]+\.supabase\.co'
    new_url = f'VITE_SUPABASE_URL=https://{new_project_id}.supabase.co'
    
    # Replace the URL
    updated_content = re.sub(old_url_pattern, new_url, content)
    
    # Update the anon key placeholder
    anon_key_pattern = r'VITE_SUPABASE_ANON_KEY=.*'
    updated_content = re.sub(anon_key_pattern, 'VITE_SUPABASE_ANON_KEY=your_new_anon_key_here', updated_content)
    
    # Write back to file
    with open(env_file, 'w') as f:
        f.write(updated_content)
    
    print("✅ Updated .env file with new project ID!")
    print(f"   New URL: https://{new_project_id}.supabase.co")
    print("⚠️  Don't forget to add your new anon key from the Supabase dashboard!")

if __name__ == "__main__":
    update_env_file() 