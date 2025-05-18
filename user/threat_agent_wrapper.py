#!/usr/bin/env python3
import os
import sys
import json
from dotenv import load_dotenv
load_dotenv()

# Import the original threat agent functions
from threat_agent import search_cve, send_slack_alert, analyze_logs, cybersecurity_agent

def main():
    """
    Wrapper for the threat_agent.py script to handle API requests from the Next.js frontend.
    This script takes a log file path as input and returns JSON output.
    """
    if len(sys.argv) < 2:
        print(json.dumps({
            "error": "No log file provided",
            "status": "error"
        }))
        sys.exit(1)
    
    log_file_path = sys.argv[1]
    
    try:
        with open(log_file_path, 'r') as f:
            log_content = f.read()
        
        # Run the cybersecurity agent analysis
        cybersecurity_agent(log_content)
        
        # Also run the analyze_logs function to get a simpler analysis
        analysis_result = analyze_logs(log_content)
        
        # Search for CVEs related to the log content
        cve_results = search_cve(log_content)
        
        # Determine threat level
        threat_level = "low"
        if "CRITICAL" in analysis_result or "High Risk" in analysis_result:
            threat_level = "high"
            # Send Slack alert for high threats
            send_slack_alert(f"CRITICAL THREAT: {analysis_result}\n\nCVEs: {cve_results}")
        elif "WARNING" in analysis_result or "Medium Risk" in analysis_result:
            threat_level = "medium"
        
        # Combine all results
        result = {
            "analysis": analysis_result,
            "cve_data": cve_results,
            "threat_level": threat_level,
            "status": "success"
        }
        
        print(json.dumps(result))
        
    except Exception as e:
        print(json.dumps({
            "error": str(e),
            "status": "error"
        }))
        sys.exit(1)

if __name__ == "__main__":
    main()
