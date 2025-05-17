import json
import os
import random
import datetime
import ipaddress
import uuid
import glob


# Create directories if they don't exist
os.makedirs('data/logs', exist_ok=True)

# Constants for generating realistic logs
PROTOCOLS = {
    6: "TCP",
    17: "UDP",
    1: "ICMP",
    2: "IGMP"
}

# Common ports
COMMON_PORTS = {
    22: "SSH",
    80: "HTTP",
    443: "HTTPS",
    53: "DNS",
    3389: "RDP",
    25: "SMTP",
    587: "SMTP",
    110: "POP3",
    143: "IMAP",
    993: "IMAPS",
    995: "POP3S",
    21: "FTP",
    3306: "MySQL",
    5432: "PostgreSQL",
    27017: "MongoDB"
}

# Typical VPC CIDR ranges
VPC_RANGES = [
    "10.0.0.0/16",
    "172.16.0.0/16",
    "192.168.0.0/16"
]

# Common public IP ranges
PUBLIC_RANGES = [
    "34.201.0.0/16",   # AWS US East
    "52.20.0.0/14",    # AWS US East
    "72.21.192.0/19",  # Amazon
    "17.0.0.0/8",      # Apple
    "23.0.0.0/8",      # Akamai
    "8.8.8.0/24",      # Google DNS
    "1.1.1.0/24",      # Cloudflare DNS
    "13.32.0.0/15",    # AWS CloudFront
    "99.84.0.0/16",    # AWS CloudFront
    "54.230.0.0/16",   # AWS CloudFront
    "204.79.197.0/24", # Microsoft
    "31.13.24.0/21",   # Facebook
    "69.63.176.0/20",  # Facebook
    "157.240.0.0/16",  # Facebook
    "199.16.156.0/22", # Twitter
    "185.45.5.0/24",   # Spotify
    "35.186.224.0/19", # Google Cloud
    "18.64.0.0/15",    # AWS Global Accelerator
    "104.244.42.0/24"  # Twitter
]

# Generate random IPs
def random_private_ip(vpc_range="10.0.0.0/16"):
    network = ipaddress.IPv4Network(vpc_range)
    # Exclude network and broadcast addresses
    host_bits = 32 - network.prefixlen
    random_host = random.randint(1, 2**host_bits - 2)
    ip = network.network_address + random_host
    return str(ip)

def random_public_ip(range=None):
    if range:
        network = ipaddress.IPv4Network(range)
        host_bits = 32 - network.prefixlen
        random_host = random.randint(1, 2**host_bits - 2)
        ip = network.network_address + random_host
        return str(ip)
    else:
        range = random.choice(PUBLIC_RANGES)
        return random_public_ip(range)

# Current time and time 4 hours ago
current_time = datetime.datetime.now()
four_hours_ago = current_time - datetime.timedelta(hours=4)

# Generate random timestamps within the last 4 hours
def random_timestamp():
    random_seconds = random.randint(0, 4 * 60 * 60)  # Random seconds within 4 hours
    timestamp = four_hours_ago + datetime.timedelta(seconds=random_seconds)
    return int(timestamp.timestamp() * 1000)  # CloudWatch timestamps are in milliseconds

# Create log stream names (realistic format for VPC flow logs)
log_stream_names = [
    f"vpc-flow-logs-{uuid.uuid4().hex[:8]}-{random.randint(1000, 9999)}",
    f"eni-{uuid.uuid4().hex[:8]}-{uuid.uuid4().hex[:8]}",
    f"vpc-{uuid.uuid4().hex[:8]}-flow-1"
]

# Generate a single log entry
def generate_log_entry(stream_name):
    vpc_range = random.choice(VPC_RANGES)
    
    # 80% chance for internal->external, 20% for external->internal
    if random.random() < 0.8:
        src_ip = random_private_ip(vpc_range)
        dst_ip = random_public_ip()
        src_port = random.randint(32768, 65535)  # Ephemeral ports
        dst_port = random.choice(list(COMMON_PORTS.keys()))
    else:
        dst_ip = random_private_ip(vpc_range)
        src_ip = random_public_ip()
        dst_port = random.randint(32768, 65535)  # Ephemeral ports
        src_port = random.choice(list(COMMON_PORTS.keys()))
    
    protocol = random.choice(list(PROTOCOLS.keys()))
    
    # Calculate realistic bytes and packets
    if protocol == 6:  # TCP
        packets = random.randint(1, 1000)
        avg_packet_size = random.randint(40, 1460)  # TCP packet sizes
    elif protocol == 17:  # UDP
        packets = random.randint(1, 100)
        avg_packet_size = random.randint(40, 8192)  # UDP can be larger
    else:
        packets = random.randint(1, 10)
        avg_packet_size = random.randint(28, 1500)
    
    bytes_sent = packets * avg_packet_size
    
    # Time range for the flow (1-60 seconds)
    duration = random.randint(1, 60)
    timestamp = random_timestamp()
    end_time = timestamp + (duration * 1000)
    
    # Generate raw message (similar to VPC Flow Log format)
    account_id = f"{random.randint(100000000000, 999999999999)}"
    interface_id = f"eni-{uuid.uuid4().hex[:8]}"
    action = "ACCEPT" if random.random() < 0.95 else "REJECT"
    
    raw_message = f"{2} {account_id} {interface_id} {src_ip} {dst_ip} {src_port} {dst_port} {protocol} {packets} {bytes_sent} {int(timestamp/1000)} {int(end_time/1000)} {action} OK"
    
    # Parse into a structured format
    vpc_flow_data = {
        "version": 2,
        "account-id": account_id,
        "interface-id": interface_id,
        "srcaddr": src_ip,
        "dstaddr": dst_ip,
        "srcport": str(src_port),
        "dstport": str(dst_port),
        "protocol": str(protocol),
        "packets": str(packets),
        "bytes": str(bytes_sent),
        "start": str(int(timestamp/1000)),
        "end": str(int(end_time/1000)),
        "action": action,
        "log-status": "OK"
    }
    
    # Build the complete log entry
    log_entry = {
        "timestamp": timestamp,
        "timestamp_formatted": datetime.datetime.fromtimestamp(timestamp/1000).isoformat(),
        "stream": stream_name,
        "data": vpc_flow_data,
        "raw_message": raw_message
    }
    
    return log_entry

# Create log files for each stream
print("Generating realistic VPC Flow Log files...")
for stream_name in log_stream_names:
    # Generate between 500-1000 log entries per stream
    num_entries = random.randint(500, 1000)
    print(f"Generating {num_entries} entries for stream {stream_name}...")
    
    processed_logs = []
    
    # Generate with a few anomalies mixed in
    normal_count = int(num_entries * 0.95)  # 95% normal
    anomaly_count = num_entries - normal_count  # 5% anomalies
    
    # Generate normal logs
    for _ in range(normal_count):
        processed_logs.append(generate_log_entry(stream_name))
    
    # Generate anomalous logs (unusual ports, high data volumes)
    for _ in range(anomaly_count):
        log_entry = generate_log_entry(stream_name)
        
        # Inject anomalies
        anomaly_type = random.choice(['port', 'volume', 'ip', 'duration'])
        
        if anomaly_type == 'port':
            # Unusual port
            log_entry['data']['dstport'] = str(random.choice([6667, 4444, 31337, 8000, 8888, 9999]))
        elif anomaly_type == 'volume':
            # Large data transfer
            large_bytes = random.randint(100000000, 1000000000)  # 100MB to 1GB
            large_packets = random.randint(100000, 1000000)
            log_entry['data']['bytes'] = str(large_bytes)
            log_entry['data']['packets'] = str(large_packets)
        elif anomaly_type == 'ip':
            # Suspicious IP ranges
            suspicious_ranges = ["185.159.151.0/24", "91.109.190.0/24", "103.102.166.0/24"]
            log_entry['data']['dstaddr'] = random_public_ip(random.choice(suspicious_ranges))
        elif anomaly_type == 'duration':
            # Very long connection
            long_duration = random.randint(3600, 14400)  # 1-4 hours
            start_time = int(log_entry['timestamp']/1000)
            log_entry['data']['start'] = str(start_time)
            log_entry['data']['end'] = str(start_time + long_duration)
        
        processed_logs.append(log_entry)
    
    # Sort logs by timestamp
    processed_logs.sort(key=lambda x: x['timestamp'])
    
    # Save logs to JSON file
    formatted_time = current_time.strftime('%Y%m%d_%H%M%S')
    filename = f"data/logs/{stream_name}_{formatted_time}.json"
    with open(filename, 'w') as f:
        json.dump(processed_logs, f, indent=2)
    
    print(f"Saved {len(processed_logs)} log entries to {filename}")

print("\nLOG GENERATION COMPLETE")
print("-" * 50)
print(f"Generated logs for {len(log_stream_names)} streams")
total_logs = sum(len(json.load(open(f))) for f in glob.glob('data/logs/*.json'))
print(f"Total log entries: {total_logs}")
print(f"Log time range: {four_hours_ago.strftime('%Y-%m-%d %H:%M:%S')} to {current_time.strftime('%Y-%m-%d %H:%M:%S')}")
print("-" * 50)