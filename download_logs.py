import boto3
import json
import os
import datetime
from datetime import timedelta


os.makedirs('data/logs', exist_ok=True)


region = 'us-east-1'  
log_group = '/aws/vpc/flowlogs' 

client = boto3.client('logs', region_name=region)

print("Getting log streams...")
streams_response = client.describe_log_streams(
    logGroupName=log_group,
    orderBy='LastEventTime',
    descending=True,
    limit=5 
)


end_time = int(datetime.datetime.now().timestamp() * 1000)
start_time = end_time - (24 * 60 * 60 * 1000)  


for stream in streams_response['logStreams']:
    stream_name = stream['logStreamName']
    print(f"Downloading logs from stream: {stream_name}")
    

    events_response = client.get_log_events(
        logGroupName=log_group,
        logStreamName=stream_name,
        startTime=start_time,
        endTime=end_time,
        limit=1000
    )
    
   
    if events_response['events']:
        processed_logs = []
        
        for event in events_response['events']:
           
            try:
                message = json.loads(event['message'])
            except:
               
                message = {'raw_message': event['message']}
            
 
            log_entry = {
                'timestamp': event['timestamp'],
                'timestamp_formatted': datetime.datetime.fromtimestamp(event['timestamp']/1000).isoformat(),
                'stream': stream_name,
                'data': message
            }
            
            processed_logs.append(log_entry)
        
       
        if processed_logs:
            filename = f"data/logs/{stream_name.replace('/', '_')}_{datetime.datetime.now().strftime('%Y%m%d_%H%M%S')}.json"
            with open(filename, 'w') as f:
                json.dump(processed_logs, f, indent=2)
            
            print(f"Saved {len(processed_logs)} log entries to {filename}")
    else:
        print(f"No logs found in stream {stream_name}")

print("Log download complete!")