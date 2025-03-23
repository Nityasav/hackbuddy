from vapi import Vapi

API_KEY = "d457c0e6-3913-4137-86d2-6f7340261ba7"
CALL_ID = "5c298919-6dca-4136-bc5c-3cd2b9aa6861"
client = Vapi(token=API_KEY)

def get_name(call_id):
    """Fetch the caller's name from a VAPI call ID."""
    try:
        call_data = client.calls.get(id=call_id)
        
        # Extract caller's name if available
        print(call_data.customer.name)
        return call_data.customer.name

    except Exception as e:
        print(f"Error fetching call data: {e}")
        return None

print(get_name(CALL_ID))