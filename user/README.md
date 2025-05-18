# FusionCloud - Advanced Threat Analysis

FusionCloud is a cybersecurity tool that analyzes logs for potential security threats using AI and provides real-time alerts.

## Features

- AI-powered log analysis using Groq LLM
- CVE vulnerability detection
- Slack integration for alerts
- Interactive threat visualization
- Real-time analysis feedback

## Setup

1. Clone this repository
2. Create a `.env.local` file with the following variables:
   \`\`\`
   GROQ_API_KEY=your_groq_api_key
   SLACK_WEBHOOK_URL=your_slack_webhook_url
   \`\`\`
3. Run the setup script:
   \`\`\`
   chmod +x setup.sh
   ./setup.sh
   \`\`\`
4. Start the development server:
   \`\`\`
   npm run dev
   \`\`\`
5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Requirements

- Python 3.8 or higher
- Node.js 18 or higher
- Groq API key
- Slack webhook URL (optional)

## Usage

1. Enter log text in the text area
2. Click "Analyze Logs" to start the analysis
3. View the threat analysis results
4. Enable "Send to Slack" to receive alerts in your Slack channel

## Technologies Used

- Next.js for the frontend
- Python for the backend analysis
- Groq LLM for AI-powered analysis
- Framer Motion for animations
- Tailwind CSS for styling
- shadcn/ui for UI components

## License

MIT
