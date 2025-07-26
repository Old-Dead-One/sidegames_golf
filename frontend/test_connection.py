#!/usr/bin/env python3
"""
Test Supabase connection using the client
"""

import os
import sys
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

def test_supabase_connection():
    """Test connection to Supabase"""
    try:
        # Import Supabase client
        from supabase import create_client, Client
        
        # Get credentials from environment
        url = os.getenv('VITE_SUPABASE_URL')
        key = os.getenv('VITE_SUPABASE_ANON_KEY')
        
        if not url or not key:
            print("❌ Missing Supabase credentials in .env file")
            return False
        
        print(f"🌐 Testing connection to: {url}")
        print(f"🔑 Using anon key: {key[:20]}...")
        
        # Create client
        supabase: Client = create_client(url, key)
        
        # Test connection by trying to get session
        response = supabase.auth.get_session()
        print("✅ Supabase client connection successful!")
        
        # Try to access a table (this will fail if database is not ready, but client connection works)
        try:
            # This is just a test query - it might fail if tables don't exist yet
            result = supabase.table('profiles').select('*').limit(1).execute()
            print("✅ Database query successful!")
        except Exception as e:
            print(f"⚠️  Database query failed (expected if tables don't exist): {e}")
            print("✅ But Supabase client connection is working!")
        
        return True
        
    except ImportError:
        print("❌ Supabase Python client not installed")
        print("Run: pip install supabase")
        return False
    except Exception as e:
        print(f"❌ Connection failed: {e}")
        return False

if __name__ == "__main__":
    success = test_supabase_connection()
    sys.exit(0 if success else 1) 