#!/bin/bash
# Setup script for Hackbuddy Mail API

# Print colored messages
print_message() {
  GREEN='\033[0;32m'
  NC='\033[0m' # No Color
  echo -e "${GREEN}$1${NC}"
}

print_error() {
  RED='\033[0;31m'
  NC='\033[0m' # No Color
  echo -e "${RED}$1${NC}"
}

print_message "Starting Hackbuddy Mail API setup..."

# Check if Python 3 is installed
if ! command -v python3 &> /dev/null; then
  print_error "Python 3 is not installed. Please install Python 3 and try again."
  exit 1
fi

# Create virtual environment if it doesn't exist
if [ ! -d "venv" ]; then
  print_message "Creating virtual environment..."
  python3 -m venv venv
  if [ $? -ne 0 ]; then
    print_error "Failed to create virtual environment."
    exit 1
  fi
else
  print_message "Virtual environment already exists."
fi

# Activate virtual environment
print_message "Activating virtual environment..."
source venv/bin/activate

# Upgrade pip
print_message "Upgrading pip..."
pip install --upgrade pip

# Install dependencies
print_message "Installing dependencies..."
pip install Flask flask-cors requests transformers python-dotenv google-auth google-auth-oauthlib google-api-python-client

# Check if .env file exists, create if not
if [ ! -f ".env" ]; then
  print_message "Creating .env file..."
  cat > .env << EOF
# Vapi API Key
VAPI_API_KEY=your_vapi_api_key

# Email settings
DEFAULT_SENDER=Hackbuddy AI <no-reply@hackbuddy.app>
DEFAULT_SUBJECT=Your Hackbuddy Call Summary and Transcript

# Flask settings
FLASK_DEBUG=true
FLASK_ENV=development
EOF
  print_message ".env file created. Please update with your actual API keys."
else
  print_message ".env file already exists."
fi

# Check if credentials.json exists
if [ ! -f "credentials.json" ]; then
  print_error "credentials.json not found!"
  print_message "Please follow these steps to set up Gmail API credentials:"
  print_message "1. Go to https://console.cloud.google.com/"
  print_message "2. Create a new project"
  print_message "3. Enable the Gmail API"
  print_message "4. Create OAuth 2.0 credentials (Desktop application)"
  print_message "5. Download the JSON file and save it as 'credentials.json' in this directory"
else
  print_message "credentials.json found. Gmail API credentials are configured."
fi

print_message "Setup complete!"
print_message "To run the Mail API server, use: python main.py"
print_message "To test the webhook, use: python test_webhook.py" 