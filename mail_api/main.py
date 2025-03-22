import os
import base64
import json
from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

# If modifying these scopes, delete the file token.json.
SCOPES = ['https://www.googleapis.com/auth/gmail.send']

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

def send_message(service, sender, to, subject, body):
    """Send an email message."""
    try:
        message = create_message(sender, to, subject, body)
        send_message = service.users().messages().send(userId="me", body=message).execute()
        print(f'Message Id: {send_message["id"]}')
        return send_message
    except HttpError as error:
        print(f'An error occurred: {error}')

def main():
    """Shows basic usage of the Gmail API.
    Sends an email from your Gmail account.
    """
    creds = None
    # The file token.json stores the user's access and refresh tokens, and is
    # created automatically when the authorization flow completes for the first time.
    if os.path.exists('token.json'):
        creds = Credentials.from_authorized_user_file('token.json', SCOPES)

    # If there are no (valid) credentials available, let the user log in.
    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            creds.refresh(Request())
        else:
            flow = InstalledAppFlow.from_client_secrets_file(
                'credentials.json', SCOPES)
            creds = flow.run_local_server(port=0)
        # Save the credentials for the next run
        with open('token.json', 'w') as token:
            token.write(creds.to_json())

    try:
        # Build the service to interact with Gmail API
        service = build('gmail', 'v1', credentials=creds)

        # Define the email parameters
        sender = 'yakshith.kommineni@gmail.com'  # Replace with your email
        to = 'email@nitya.ca'  # Replace with recipient's email
        subject = 'Test Email'
        body = 'This is a test email sent via the Gmail API in Python.'

        # Send the email
        send_message(service, sender, to, subject, body)

    except HttpError as error:
        print(f'An error occurred: {error}')

if __name__ == '__main__':
    main()
