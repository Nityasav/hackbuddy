# Hackbuddy Mail API

This service handles email communications for the Hackbuddy application, including sending call summaries and transcripts after Vapi calls are completed.

## Features

- Webhook endpoint for Vapi call completion events
- Retrieves call transcripts from Vapi API
- Uses AI to generate summaries of call transcripts
- Extracts skills mentioned in conversations
- Sends beautifully formatted HTML emails with call summaries and transcripts
- Gmail API integration for sending emails

## Setup

1. Create a virtual environment:
   ```
   python3 -m venv venv
   ```

2. Activate the virtual environment:
   ```
   source venv/bin/activate  # On Unix/macOS
   venv\Scripts\activate  # On Windows
   ```

3. Install dependencies:
   ```
   pip install Flask flask-cors requests transformers python-dotenv google-auth google-auth-oauthlib google-api-python-client
   ```

4. Set up Gmail API:
   - Go to the [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project
   - Enable the Gmail API
   - Create OAuth credentials (Desktop application)
   - Download the credentials JSON file
   - Save it as `credentials.json` in this directory

5. Create a `.env` file with your configuration:
   ```
   # Vapi API Key
   VAPI_API_KEY=your_vapi_api_key

   # Email settings
   DEFAULT_SENDER=Hackbuddy AI <no-reply@hackbuddy.app>
   DEFAULT_SUBJECT=Your Hackbuddy Call Summary and Transcript

   # Flask settings
   FLASK_DEBUG=true
   FLASK_ENV=development
   ```

## Running the API

1. Ensure your virtual environment is activated

2. Run the Flask application:
   ```
   python main.py
   ```

3. The API will be available at http://localhost:5000

## Exposing to the Internet

To receive webhooks from Vapi, the API needs to be accessible from the internet. You can use ngrok for development:

1. Install ngrok: https://ngrok.com/download

2. Run ngrok to expose your local server:
   ```
   ngrok http 5000
   ```

3. Configure webhooks in the Vapi dashboard:
   - Log in to your Vapi dashboard at https://dashboard.vapi.ai
   - Go to Settings → Webhooks
   - Add a new webhook with your ngrok URL (e.g., https://your-ngrok-url.ngrok-free.app/vapi-webhook)
   - Select the "call.completed" event
   - Save your webhook configuration

Note: Webhooks cannot be configured through the API call directly. They must be set up in the Vapi dashboard.

## Testing

You can test the webhook functionality without making a real call:

1. Start the Flask server:
   ```
   python main.py
   ```

2. In another terminal, run the test script:
   ```
   python test_webhook.py
   ```

3. To test with a real call ID (if you've made a call recently):
   ```
   python test_webhook.py your_real_call_id
   ```

## Integration with Hackbuddy

This service works with the main Hackbuddy application to:

1. Receive webhooks when Vapi calls are completed
2. Look up the user's information based on the phone number
3. Generate an AI summary of the call
4. Extract skills mentioned in the conversation
5. Send a formatted email with the call summary and transcript

For full integration, ensure that:

1. The webhook URL in `vapi.ts` is correctly configured
2. User phone numbers are properly stored in your database
3. The Gmail API credentials are valid and have the necessary permissions 