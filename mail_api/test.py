import os
import base64
from vapi import Vapi
from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

# VAPI Configuration
API_KEY = "d457c0e6-3913-4137-86d2-6f7340261ba7"
CALL_ID = "5c298919-6dca-4136-bc5c-3cd2b9aa6861"
client = Vapi(token=API_KEY)

# Gmail API Configuration
SCOPES = ['https://www.googleapis.com/auth/gmail.send']
SENDER_EMAIL = 'main.hackbuddy@gmail.com'
RECIPIENT_EMAIL = 'yakshith.kommineni@gmail.com'


def get_call_transcript(call_id):
    """Fetch the call transcript from VAPI."""
    return client.calls.get(id=call_id).analysis.summary


def create_message(sender, to, subject, body):
    """Create a message for an email."""
    message = MIMEMultipart()
    message['to'] = to
    message['from'] = sender
    message['subject'] = subject
    msg = MIMEText(body)
    message.attach(msg)
    
    raw_message = base64.urlsafe_b64encode(message.as_bytes()).decode()
    return {'raw': raw_message}


def send_email(subject, body):
    """Send an email via Gmail API."""
    creds = None
    if os.path.exists('token.json'):
        creds = Credentials.from_authorized_user_file('token.json', SCOPES)

    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            creds.refresh(Request())
        else:
            flow = InstalledAppFlow.from_client_secrets_file(
                'mail_api/credentials.json', SCOPES)
            creds = flow.run_local_server(port=0)
        with open('token.json', 'w') as token:
            token.write(creds.to_json())

    try:
        service = build('gmail', 'v1', credentials=creds)
        message = create_message(SENDER_EMAIL, RECIPIENT_EMAIL, subject, body)
        send_message = service.users().messages().send(userId="me", body=message).execute()
        print(f"Email sent successfully. Message ID: {send_message['id']}")
    except HttpError as error:
        print(f"An error occurred: {error}")


if __name__ == "__main__":

    transcript = get_call_transcript(CALL_ID)
    
    if transcript:
        subject = f"Call Transcript for Hack Buddy"
        body = f"Hey, \nHere is the transcript of the call:\n\n{transcript}"
        send_email(subject, body)
    else:
        print("Transcript not found.")
