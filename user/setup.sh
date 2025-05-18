#!/bin/bash

# Setup script for FusionCloud

# Check if Python is installed
if ! command -v python &> /dev/null; then
    echo "Python is not installed. Please install Python 3.8 or higher."
    exit 1
fi

# Check if pip is installed
if ! command -v pip &> /dev/null; then
    echo "pip is not installed. Please install pip."
    exit 1
fi

# Install required Python packages
echo "Installing required Python packages..."
pip install python-dotenv requests groq

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "Node.js is not installed. Please install Node.js 18 or higher."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "npm is not installed. Please install npm."
    exit 1
fi

# Create temp directory for log files
mkdir -p temp

# Check if .env.local exists
if [ ! -f .env.local ]; then
    echo "Creating .env.local file..."
    echo "GROQ_API_KEY=your_groq_api_key" > .env.local
    echo "SLACK_WEBHOOK_URL=your_slack_webhook_url" >> .env.local
    echo "Please update the .env.local file with your actual API keys."
fi

# Install Node.js dependencies
echo "Installing Node.js dependencies..."
npm install

echo "Setup complete! You can now run the application with 'npm run dev'."
