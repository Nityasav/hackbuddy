import os
import base64
from flask import Flask, request, jsonify
from vapi import Vapi
from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

app = Flask(__name__)

# VAPI Configuration
API_KEY = "d457c0e6-3913-4137-86d2-6f7340261ba7"
client = Vapi(token=API_KEY)

# Gmail API Configuration
SCOPES = ['https://www.googleapis.com/auth/gmail.send']
SENDER_EMAIL = 'main.hackbuddy@gmail.com'


def get_call_transcript(call_id):
    """Fetch the call transcript from VAPI."""
    try:
        call_data = client.calls.get(id=call_id)
        return call_data.analysis.summary if hasattr(call_data, "analysis") and hasattr(call_data.analysis, "summary") else None
    except Exception as e:
        print(f"Error fetching call transcript: {e}")
        return None


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


def send_email(recipient_email, subject, body):
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
        message = create_message(SENDER_EMAIL, recipient_email, subject, body)
        send_message = service.users().messages().send(userId="me", body=message).execute()
        return {"status": "success", "message_id": send_message["id"]}
    except HttpError as error:
        return {"status": "error", "message": str(error)}


@app.route('/send_transcript', methods=['GET'])
def send_transcript():
    """Flask route to send call transcript via email."""
    call_id = request.args.get('call_id')
    recipient_email = request.args.get('email')

    if not call_id or not recipient_email:
        return jsonify({"error": "Missing call_id or email parameter"}), 400

    transcript = get_call_transcript(call_id)
    if not transcript:
        return jsonify({"error": "Transcript not found"}), 404

    subject = f"Call Transcript for {call_id}"
    body = f"Hello,\n\nHere is the transcript of the call:\n\n{transcript}"

    email_status = send_email(recipient_email, subject, body)

    return jsonify(email_status)


if __name__ == "__main__":
    app.run(debug=True)
