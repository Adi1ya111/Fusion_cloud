import boto3
import json
import random
import datetime
import time
import sys

# Configure AWS clients
events_client = boto3.client('events')
ec2_client = boto3.client('ec2')

# Configuration
EVENT_BUS_NAME = "security-zscore-events"
SAMPLE_IP_RANGES = [
    "203.0.113.", 
    "198.51.100.",
    "192.0.2."
]

def generate_zscore_event(ip_range):
    """Generate a random z-score security event with negative z-scores"""
    
    # Create a random IP in the given range
    ip_address = f"{ip_range}{random.randint(1, 254)}"
    
    # Generate random z-score between -5 and 1
    # More negative values indicate higher anomaly
    z_score = round(random.uniform(-5, 1), 2)
    
    # Generate random severity between 1 and 10
    severity = random.randint(1, 10)
    
    # Create the event detail
    event_detail = {
        "z_score": z_score,
        "severity": severity,
        "source_ip": ip_address,
        "timestamp": datetime.datetime.now().isoformat(),
        "detection_source": "anomaly-detection-system",
        "additional_info": {
            "connection_count": random.randint(100, 10000),
            "user_agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
            "target_resource": f"resource-{random.randint(1, 20)}"
        }
    }
    
    return event_detail

def put_event_to_eventbridge(event_detail):
    """Put the event to EventBridge"""
    
    response = events_client.put_events(
        Entries=[
            {
                'Source': 'custom.security',
                'DetailType': 'Security Alert',
                'Detail': json.dumps(event_detail),
                'EventBusName': EVENT_BUS_NAME
            }
        ]
    )
    
    return response

def test_event_generation():
    """Generate and send test events to EventBridge"""
    
    print(f"Sending test events to EventBridge bus: {EVENT_BUS_NAME}")
    
    # Send 5 test events
    for i in range(5):
        # Choose a random IP range
        ip_range = random.choice(SAMPLE_IP_RANGES)
        
        # Generate event
        event_detail = generate_zscore_event(ip_range)
        
        # Send to EventBridge
        response = put_event_to_eventbridge(event_detail)
        
        # Print results
        entry_result = response['Entries'][0]
        if 'ErrorCode' in entry_result:
            print(f"Error sending event {i+1}: {entry_result['ErrorCode']} - {entry_result.get('ErrorMessage', 'No message')}")
        else:
            print(f"Event {i+1} sent successfully. Event ID: {entry_result['EventId']}")
            print(f"  Z-Score: {event_detail['z_score']}, Severity: {event_detail['severity']}, IP: {event_detail['source_ip']}")
        
        # Wait a bit between events
        time.sleep(1)
    
    print("Test complete.")

def save_event_to_file(filename):
    """Save a sample event to a JSON file"""
    
    # Generate a sample event
    ip_range = random.choice(SAMPLE_IP_RANGES)
    event_detail = generate_zscore_event(ip_range)
    
    # Save to file
    with open(filename, 'w') as f:
        json.dump(event_detail, f, indent=2)
    
    print(f"Saved sample event to {filename}")
    print(f"Z-Score: {event_detail['z_score']}, Severity: {event_detail['severity']}, IP: {event_detail['source_ip']}")

def main():
    """Main function"""
    
    if len(sys.argv) < 2:
        print("Usage:")
        print("  python send_test_events.py test   # Send test events to EventBridge")
        print("  python send_test_events.py save filename.json  # Save a sample event to a file")
        return
    
    command = sys.argv[1]
    
    if command == "test":
        test_event_generation()
    elif command == "save" and len(sys.argv) >= 3:
        save_event_to_file(sys.argv[2])
    else:
        print("Unknown command. Use 'test' or 'save'.")

if __name__ == "__main__":
    main()