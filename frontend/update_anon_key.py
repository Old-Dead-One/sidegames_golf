#!/usr/bin/env python3
"""
Update the anon key in the .env file
"""

import os
import re

def update_anon_key():
    """Update .env file with the new anon key"""
    
    # Read current .env file
    env_file = ".env"
    if not os.path.exists(env_file):
        print("❌ .env file not found!")
        return
    
    with open(env_file, 'r') as f:
        content = f.read()
    
    # New anon key from the user
    new_anon_key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9rbmZtc2l0eG5mb2N3aGxlcnVsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI1MzY4NDQsImV4cCI6MjA2ODExMjg0NH0.yVCFSki1QcvR1byEz5vbUO7vQU1LAXwduJDw-P2F12o"
    
    # Update the anon key
    anon_key_pattern = r'VITE_SUPABASE_ANON_KEY=.*'
    updated_content = re.sub(anon_key_pattern, f'VITE_SUPABASE_ANON_KEY={new_anon_key}', content)
    
    # Write back to file
    with open(env_file, 'w') as f:
        f.write(updated_content)
    
    print("✅ Updated .env file with new anon key!")
    print("🌐 URL: https://oknfmsitxnfocwhlerul.supabase.co")
    print("🔑 Anon key updated successfully!")

if __name__ == "__main__":
    update_anon_key() 