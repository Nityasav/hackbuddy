import os
import base64
from flask import Flask, request, jsonify
from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

app = Flask(__name__)

SCOPES = ['https://www.googleapis.com/auth/gmail.send']

def authenticate_gmail():
    """Authenticate with Gmail API and return service."""
    creds = None
    if os.path.exists('token.json'):
        creds = Credentials.from_authorized_user_file('token.json', SCOPES)

    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            creds.refresh(Request())
        else:
            flow = InstalledAppFlow.from_client_secrets_file(
                'credentials.json', SCOPES)
            creds = flow.run_local_server(port=0)

        with open('token.json', 'w') as token:
            token.write(creds.to_json())

    return build('gmail', 'v1', credentials=creds)

def create_message(sender, recipient, subject, body):
    """Create an email message."""
    message = MIMEMultipart()
    message['to'] = recipient
    message['from'] = sender
    message['subject'] = subject
    msg = MIMEText(body)
    message.attach(msg)

    raw_message = base64.urlsafe_b64encode(message.as_bytes()).decode()
    return {'raw': raw_message}

def send_message(service, sender, recipient, subject, body):
    """Send an email via Gmail API."""
    try:
        message = create_message(sender, recipient, subject, body)
        sent_message = service.users().messages().send(userId="me", body=message).execute()
        return {"message": "Email sent successfully", "message_id": sent_message["id"]}
    except HttpError as error:
        return {"error": str(error)}

@app.route('/send-email', methods=['POST'])
def send_email():
    """API endpoint to send an email."""
    data = request.json
    sender = data.get("sender")
    recipient = data.get("recipient")
    subject = data.get("subject")
    body = data.get("body")

    if not sender or not recipient or not subject or not body:
        return jsonify({"error": "Missing required fields"}), 400

    service = authenticate_gmail()
    response = send_message(service, sender, recipient, subject, body)

    return jsonify(response)

if __name__ == '__main__':
    app.run(port=5000, debug=True)
