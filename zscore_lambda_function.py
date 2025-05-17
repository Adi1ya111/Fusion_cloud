import json
import boto3
import os
import logging
from datetime import datetime

# Set up logging
logger = logging.getLogger()
logger.setLevel(logging.INFO)

# Initialize AWS clients
ec2 = boto3.client('ec2')
events = boto3.client('events')
sns = boto3.client('sns')

# Get configuration from environment variables
SECURITY_GROUP_ID = os.environ.get('SECURITY_GROUP_ID')
SNS_TOPIC_ARN = os.environ.get('SNS_TOPIC_ARN', '')
Z_SCORE_THRESHOLD = float(os.environ.get('Z_SCORE_THRESHOLD', '2.0'))

# Severity thresholds
SEVERITY_THRESHOLDS = {
    'LOW': 3,    # 0-3 severity
    'MEDIUM': 7, # 4-7 severity
    'HIGH': 10   # 8-10 severity
}

def lambda_handler(event, context):
    """
    Main handler for processing security events with z-score and severity
    """
    logger.info(f"Event received: {json.dumps(event)}")
    
    try:
        # Extract details from the event
        if 'detail' in event:
            # This is coming from EventBridge
            detail = event['detail']
            process_security_alert(detail)
        else:
            # Direct invocation - assume the event itself contains the data
            process_security_alert(event)
            
        return {
            'statusCode': 200,
            'body': json.dumps('Successfully processed security alert')
        }
        
    except Exception as e:
        logger.error(f"Error processing security alert: {str(e)}")
        raise

def process_security_alert(alert_data):
    """
    Process a security alert with z-score and severity
    """
    # Extract z-score and severity from the alert data
    z_score = alert_data.get('z_score')
    severity = alert_data.get('severity')
    source_ip = alert_data.get('source_ip')
    
    # Validate required fields
    if z_score is None or severity is None:
        raise ValueError("Missing required fields: z_score and severity are required")
    
    # Convert z_score to float if it's a string
    if isinstance(z_score, str):
        z_score = float(z_score)
    
    # Convert severity to int if it's a string
    if isinstance(severity, str) and severity.isdigit():
        severity = int(severity)
    
    logger.info(f"Processing alert with z-score: {z_score}, severity: {severity}")
    
    # Determine action based on z-score and severity
    action = determine_action(z_score, severity)
    
    # Take the appropriate action
    if action == 'BLOCK' and source_ip:
        block_ip(source_ip, f"Blocked due to z-score: {z_score}, severity: {severity}")
        send_notification(z_score, severity, source_ip, 'BLOCK')
    elif action == 'WARN' and source_ip:
        # Just send a warning notification, don't block
        send_notification(z_score, severity, source_ip, 'WARN')
    elif action == 'IGNORE':
        logger.info(f"Alert below threshold, ignoring")
    else:
        logger.warning(f"No action taken: action={action}, source_ip={source_ip}")

def determine_action(z_score, severity):
    """
    Determine what action to take based on z-score and severity
    
    Z-Score categorization:
    - HIGH: z_score <= -2.0 (more negative values indicate higher anomaly)
    - MEDIUM: -2.0 < z_score <= -1.0
    - LOW: z_score > -1.0
    """
    # Get z-score category
    z_score_category = "LOW"
    if z_score <= -2.0:
        z_score_category = "HIGH"
    elif z_score <= -1.0:
        z_score_category = "MEDIUM"
    
    # Get severity category
    severity_category = "LOW"
    if severity >= SEVERITY_THRESHOLDS['HIGH']:
        severity_category = "HIGH"
    elif severity >= SEVERITY_THRESHOLDS['MEDIUM']:
        severity_category = "MEDIUM"
    
    # High severity and high z-score: BLOCK
    if z_score_category == "HIGH" and severity_category in ["MEDIUM", "HIGH"]:
        return 'BLOCK'
    
    # High z-score or medium/high severity: WARN
    elif z_score_category == "HIGH" or severity_category in ["MEDIUM", "HIGH"]:
        return 'WARN'
    
    # Low on both measures: IGNORE
    else:
        return 'IGNORE'

def block_ip(ip_address, description):
    """
    Block an IP address in the security group
    """
    if not SECURITY_GROUP_ID:
        logger.error("Security Group ID not configured")
        raise ValueError("Security Group ID not configured")
    
    try:
        # Format IP address
        if '/' not in ip_address:
            ip_address = f"{ip_address}/32"
        
        # Check if rule already exists
        security_group = ec2.describe_security_groups(GroupIds=[SECURITY_GROUP_ID])
        existing_rules = security_group['SecurityGroups'][0]['IpPermissions']
        
        # Check if IP is already blocked
        for rule in existing_rules:
            if rule.get('IpProtocol') == '-1':  # All traffic
                for range in rule.get('IpRanges', []):
                    if range.get('CidrIp') == ip_address:
                        logger.info(f"IP {ip_address} is already blocked")
                        return
        
        # Block all traffic from this IP
        ec2.authorize_security_group_ingress(
            GroupId=SECURITY_GROUP_ID,
            IpPermissions=[
                {
                    'IpProtocol': '-1',  # All traffic
                    'FromPort': -1,      # All ports
                    'ToPort': -1,        # All ports
                    'IpRanges': [
                        {
                            'CidrIp': ip_address,
                            'Description': description
                        }
                    ]
                }
            ]
        )
        
        logger.info(f"Successfully blocked IP {ip_address}")
        
    except Exception as e:
        logger.error(f"Error blocking IP {ip_address}: {str(e)}")
        raise e

def send_notification(z_score, severity, source_ip, action):
    """
    Send a notification about the action taken
    """
    if not SNS_TOPIC_ARN:
        logger.info("SNS Topic ARN not configured, skipping notification")
        return
    
    try:
        # Determine z-score category
        z_score_category = "LOW"
        if z_score <= -2.0:
            z_score_category = "HIGH"
        elif z_score <= -1.0:
            z_score_category = "MEDIUM"
        
        # Determine severity level text
        severity_text = "LOW"
        if severity >= SEVERITY_THRESHOLDS['HIGH']:
            severity_text = "HIGH"
        elif severity >= SEVERITY_THRESHOLDS['MEDIUM']:
            severity_text = "MEDIUM"
        
        # Create subject based on action
        if action == 'BLOCK':
            subject = f"{severity_text} SEVERITY / {z_score_category} Z-SCORE - IP Blocked Automatically"
        else:
            subject = f"{severity_text} SEVERITY / {z_score_category} Z-SCORE - Security Alert"
        
        # Create message
        message = f"""
SECURITY ALERT

Action: {action}
IP Address: {source_ip}
Z-Score: {z_score} ({z_score_category})
Severity: {severity} ({severity_text})
Time: {datetime.utcnow().isoformat()}

Z-Score categories:
- HIGH: z-score <= -2.0 (more negative)
- MEDIUM: -2.0 < z-score <= -1.0
- LOW: z-score > -1.0

This alert was generated automatically based on anomaly detection.
"""
        
        # Send the notification
        sns.publish(
            TopicArn=SNS_TOPIC_ARN,
            Subject=subject,
            Message=message
        )
        
        logger.info(f"Sent notification for {action} action")
        
    except Exception as e:
        logger.error(f"Error sending notification: {str(e)}")
        # Don't raise to prevent main workflow from failing