# train_model.py

import os
import json
import glob
import numpy as np
import pandas as pd
from sklearn.ensemble import IsolationForest
from sklearn.preprocessing import StandardScaler
import pickle

os.makedirs('model', exist_ok=True)

print("Loading log files...")
log_files = glob.glob('data/logs/*.json')

if not log_files:
    print("No log files found! Please run download_logs.py first.")
    exit(1)

all_data = []
for log_file in log_files:
    with open(log_file, 'r') as f:
        logs = json.load(f)

    for log in logs:
        features = {}

        if 'data' in log and isinstance(log['data'], dict):
            data = log['data']
            features['bytes'] = int(data.get('bytes', 0))
            features['packets'] = int(data.get('packets', 0))
            features['duration'] = int(data.get('end', 0)) - int(data.get('start', 0))
            features['src_ip_hash'] = hash(data.get('srcaddr', '')) % 10000
            features['dst_ip_hash'] = hash(data.get('dstaddr', '')) % 10000
            features['src_port'] = int(data['srcport']) if str(data.get('srcport')).isdigit() else 0
            features['dst_port'] = int(data['dstport']) if str(data.get('dstport')).isdigit() else 0
            features['protocol'] = int(data['protocol']) if str(data.get('protocol')).isdigit() else 0

        if 'timestamp' in log:
            features['timestamp'] = log['timestamp']

        features['log_file'] = os.path.basename(log_file)
        features['log_stream'] = log.get('stream', '')

        all_data.append(features)

df = pd.DataFrame(all_data)
print(f"Loaded {len(df)} entries")

# Keep numeric features only
numeric_columns = df.select_dtypes(include=['number']).columns.tolist()
feature_columns = [col for col in numeric_columns if col != 'timestamp']

if len(feature_columns) < 1:
    print("No numeric features found")
    exit(1)

X = df[feature_columns].fillna(0)

# Train model
scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)

model = IsolationForest(contamination=0.05, random_state=42)
model.fit(X_scaled)

# Save model and scaler
with open('model/isolation_forest.pkl', 'wb') as f:
    pickle.dump(model, f)

with open('model/scaler.pkl', 'wb') as f:
    pickle.dump(scaler, f)

# Save full dataset for later use
df.to_json('model/full_data.json', orient='records', indent=2)

print("Model and scaler saved to 'model/'")
