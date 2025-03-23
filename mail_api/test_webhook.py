#!/usr/bin/env python
"""
Test script for the Vapi webhook integration.
This script simulates a call completion webhook from Vapi
to test the email sending functionality.
"""

import requests
import json
import os
import sys
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

def send_test_webhook(call_id=None):
    """Send a test webhook to the local webhook endpoint."""
    
    if call_id is None:
        # Use a default test call ID
        call_id = "test_call_123456"
        print("No call_id provided, using test ID:", call_id)
    
    # Webhook data to simulate a call completion event
    webhook_data = {
        "event": "call.completed",
        "call_id": call_id,
        "timestamp": "2023-10-26T15:30:45.123Z",
        "data": {
            "status": "completed",
            "duration": 120,  # 2 minutes call
            "outcome": "completed"
        }
    }
    
    print("Sending test webhook data:")
    print(json.dumps(webhook_data, indent=2))
    
    # Send to local webhook endpoint
    url = "http://localhost:5000/vapi-webhook"
    response = requests.post(
        url, 
        json=webhook_data,
        headers={"Content-Type": "application/json"}
    )
    
    print("\nResponse:")
    print(f"Status code: {response.status_code}")
    
    try:
        print(json.dumps(response.json(), indent=2))
    except:
        print("Raw response:", response.text)

if __name__ == "__main__":
    # Check if call_id was provided as command line argument
    call_id = sys.argv[1] if len(sys.argv) > 1 else None
    
    send_test_webhook(call_id)
    print("\nTest complete. Check the server logs for details.") 