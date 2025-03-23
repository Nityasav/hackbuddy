import os
import base64
import json
import requests
from flask import Flask, request, jsonify
from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from flask_cors import CORS
from transformers import pipeline
import html
from dotenv import load_dotenv
from email_template import generate_email_html
from supabase import create_client

# Load environment variables from .env file
load_dotenv()

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

SCOPES = ['https://www.googleapis.com/auth/gmail.send']

# Initialize the summarizer model
summarizer = pipeline("summarization", model="facebook/bart-large-cnn")

# Initialize Supabase client
supabase_url = os.getenv("SUPABASE_URL")
supabase_key = os.getenv("SUPABASE_KEY")
supabase = create_client(supabase_url, supabase_key)

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
    msg = MIMEText(body, 'html')  # Use HTML for better formatting
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

def get_vapi_call_data(call_id, api_key):
    """Retrieve call data from Vapi API."""
    url = f"https://api.vapi.ai/call/{call_id}"
    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json"
    }
    
    try:
        response = requests.get(url, headers=headers)
        response.raise_for_status()
        return response.json()
    except requests.exceptions.RequestException as e:
        print(f"Error fetching call data: {e}")
        return None

def get_vapi_transcript(call_id, api_key):
    """Retrieve transcript from Vapi API."""
    url = f"https://api.vapi.ai/call/{call_id}/transcript"
    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json"
    }
    
    try:
        response = requests.get(url, headers=headers)
        response.raise_for_status()
        return response.json()
    except requests.exceptions.RequestException as e:
        print(f"Error fetching transcript: {e}")
        return None

def generate_ai_summary(transcript):
    """Generate AI summary from transcript using transformers."""
    try:
        # Extract just the text from the transcript
        text = " ".join([turn["content"] for turn in transcript["turns"]])
        
        # Check if text is too long, and truncate if necessary
        max_input_length = 1024  # BART model has a limit
        if len(text) > max_input_length:
            text = text[:max_input_length]
        
        # Generate summary
        summary = summarizer(text, max_length=150, min_length=50, do_sample=False)[0]["summary_text"]
        return summary
    except Exception as e:
        print(f"Error generating summary: {e}")
        return "Could not generate summary from transcript."

def extract_skills_from_transcript(transcript):
    """Extract potential skills mentioned in the transcript."""
    # This is a simple keyword-based extraction
    # In a production environment, you would use a more sophisticated NLP approach
    tech_skills = [
        "python", "javascript", "typescript", "react", "node.js", "vue", "angular",
        "django", "flask", "express", "ruby", "rails", "php", "laravel", "java",
        "spring", "go", "rust", "c#", ".net", "c++", "swift", "kotlin", "dart",
        "flutter", "react native", "aws", "azure", "gcp", "docker", "kubernetes",
        "terraform", "ansible", "jenkins", "ci/cd", "git", "github", "gitlab",
        "mongodb", "mysql", "postgresql", "sql", "nosql", "redis", "elasticsearch",
        "graphql", "rest api", "html", "css", "sass", "less", "tailwind", "bootstrap",
        "material ui", "figma", "sketch", "adobe xd", "ui/ux", "responsive design",
        "mobile development", "web development", "data science", "machine learning",
        "ai", "nlp", "computer vision", "blockchain", "smart contracts", "web3",
        "iot", "embedded systems", "game development", "unity", "unreal engine"
    ]
    
    found_skills = []
    lower_transcript = transcript.lower()
    
    for skill in tech_skills:
        if skill in lower_transcript:
            found_skills.append(skill)
    
    return found_skills

def generate_html_email(user_name, call_data, transcript, summary, skills):
    """Generate a nicely formatted HTML email with call summary and transcript."""
    
    # Format transcript for email
    formatted_transcript = ""
    if transcript and "turns" in transcript:
        for turn in transcript["turns"]:
            speaker = "AI" if turn["role"] == "assistant" else "You"
            formatted_transcript += f"<p><strong>{speaker}:</strong> {html.escape(turn['content'])}</p>"
    
    # Format skills list
    skills_html = ""
    if skills:
        skills_html = "<ul>"
        for skill in skills:
            skills_html += f"<li>{skill.capitalize()}</li>"
        skills_html += "</ul>"
    
    # Build the email HTML
    email_html = generate_email_html(
        user_name=user_name,
        call_summary=summary,
        extracted_skills=skills,
        transcript=formatted_transcript
    )
    
    return email_html

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

@app.route('/vapi-webhook', methods=['POST'])
def vapi_webhook():
    """Webhook to handle Vapi call completion events."""
    data = request.json
    print(f"Received webhook: {json.dumps(data, indent=2)}")
    
    # Check if this is a call completion event
    if data.get('event_type') != 'call.completed':
        return jsonify({"message": "Not a call completion event"}), 200
    
    # Get the call_id from the webhook data
    call_id = data.get('call', {}).get('id')
    if not call_id:
        return jsonify({"error": "No call ID provided"}), 400
    
    # Get the Vapi API key from environment variables
    vapi_api_key = os.getenv('VAPI_API_KEY')
    if not vapi_api_key:
        return jsonify({"error": "VAPI_API_KEY not configured"}), 500
    
    try:
        # Get call details from Vapi API
        response = requests.get(
            f"https://api.vapi.ai/call/{call_id}",
            headers={"Authorization": f"Bearer {vapi_api_key}"}
        )
        response.raise_for_status()
        call_data = response.json()
        
        # Get transcript from Vapi API
        transcript_response = requests.get(
            f"https://api.vapi.ai/call/{call_id}/transcript",
            headers={"Authorization": f"Bearer {vapi_api_key}"}
        )
        transcript_response.raise_for_status()
        transcript_data = transcript_response.json()
        
        # Extract the phone number from the call data
        phone_number = call_data.get('phone_number')
        if not phone_number:
            return jsonify({"error": "No phone number found in call data"}), 400
        
        print(f"Processing transcript for phone number: {phone_number}")
        
        # Query user from Supabase
        try:
            # Remove any formatting from the phone number for comparison
            # E.g., convert "+1 (555) 123-4567" to "+15551234567"
            clean_phone = ''.join(c for c in phone_number if c.isdigit() or c == '+')
            
            # Query user from Supabase
            response = supabase.table('profiles').select('id, name, email').eq('phone', clean_phone).execute()
            
            if response.data and len(response.data) > 0:
                user = response.data[0]
                user_name = user['name'] or "Hackbuddy User"
                user_email = user['email']
                print(f"Found user: {user_name}, {user_email}")
            else:
                # No user found with this phone number
                print(f"No user found with phone number: {clean_phone}")
                return jsonify({"error": "User not found"}), 404
        except Exception as e:
            print(f"Error querying Supabase: {e}")
            # Fall back to default for testing
            user_name = "Hackbuddy User"
            user_email = "your-email@example.com"
        
        # Generate full transcript text
        full_transcript = ""
        for message in transcript_data.get('messages', []):
            role = "AI" if message.get('role') == 'assistant' else "You"
            full_transcript += f"{role}: {message.get('text', '')}\n\n"
        
        # Generate summary using AI
        if full_transcript:
            try:
                summary = summarizer(full_transcript, max_length=150, min_length=30, do_sample=False)[0]['summary_text']
            except Exception as e:
                print(f"Error generating summary: {e}")
                summary = "A conversation about potential hackathon collaboration and skill-sharing."
        else:
            summary = "No transcript was available for this call."
        
        # Extract skills from transcript
        skills = extract_skills_from_transcript(full_transcript)
        
        # Generate HTML email content
        html_content = generate_email_html(
            user_name=user_name,
            call_summary=summary,
            extracted_skills=skills,
            transcript=full_transcript
        )
        
        # Send email
        message_id = send_email(
            to=user_email,
            subject=os.getenv('DEFAULT_SUBJECT', 'Your Hackbuddy Call Summary and Transcript'),
            html_content=html_content,
            sender=os.getenv('DEFAULT_SENDER', 'Hackbuddy AI <no-reply@hackbuddy.app>')
        )
        
        if message_id:
            return jsonify({
                "success": True,
                "message": "Email sent successfully",
                "message_id": message_id
            }), 200
        else:
            return jsonify({
                "success": False,
                "message": "Failed to send email"
            }), 500
    
    except requests.exceptions.RequestException as e:
        print(f"Error retrieving data from Vapi API: {e}")
        return jsonify({"error": f"Error retrieving data from Vapi API: {str(e)}"}), 500
    
    except Exception as e:
        print(f"Unexpected error: {e}")
        return jsonify({"error": f"Unexpected error: {str(e)}"}), 500

@app.route('/', methods=['GET'])
def index():
    return jsonify({
        "status": "running",
        "app": "Hackbuddy Mail API",
        "endpoints": [
            {
                "path": "/vapi-webhook",
                "method": "POST",
                "description": "Webhook endpoint for Vapi call completion events"
            }
        ]
    })

if __name__ == '__main__':
    # Make sure environment variables are set
    if not os.environ.get('VAPI_API_KEY'):
        print("Warning: VAPI_API_KEY environment variable not set")
    
    app.run(host='0.0.0.0', port=5000, debug=True)
