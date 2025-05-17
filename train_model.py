import os
import json
import glob
import numpy as np
import pandas as pd
from sklearn.ensemble import IsolationForest
from sklearn.preprocessing import StandardScaler
import pickle
import matplotlib.pyplot as plt

os.makedirs('model', exist_ok=True)

print("Loading log files...")
log_files = glob.glob('data/logs/*.json')

if not log_files:
    print("No log files found! Please run download_logs.py first.")
    exit(1)
len
all_data = []
for log_file in log_files:
    print(f"Processing {log_file}...")
    with open(log_file, 'r') as f:
        logs = json.load(f)
    
    for log in logs:
        
        features = {}
        
     
        if 'data' in log and isinstance(log['data'], dict):
            data = log['data']
            
            if 'bytes' in data:
                features['bytes'] = int(data.get('bytes', 0))
            if 'packets' in data:
                features['packets'] = int(data.get('packets', 0))
            
           
            if 'start' in data and 'end' in data:
                features['duration'] = int(data.get('end', 0)) - int(data.get('start', 0))
        
            if 'srcaddr' in data:
               
                features['src_ip_hash'] = hash(data.get('srcaddr', '')) % 10000
            if 'dstaddr' in data:
                features['dst_ip_hash'] = hash(data.get('dstaddr', '')) % 10000
            if 'srcport' in data and data['srcport'].isdigit():
                features['src_port'] = int(data['srcport'])
            if 'dstport' in data and data['dstport'].isdigit():
                features['dst_port'] = int(data['dstport'])
            if 'protocol' in data and data['protocol'].isdigit():
                features['protocol'] = int(data['protocol'])
  
        if 'timestamp' in log:
            features['timestamp'] = log['timestamp']
    
        features['log_file'] = os.path.basename(log_file)
        features['log_stream'] = log.get('stream', '')
        
        
        if features:
            all_data.append(features)


if not all_data:
    print("No usable features found in log data!")
    exit(1)

df = pd.DataFrame(all_data)
print(f"Loaded {len(df)} log entries with features")


numeric_columns = df.select_dtypes(include=['number']).columns.tolist()
feature_columns = [col for col in numeric_columns if col not in ['timestamp', 'log_file', 'log_stream']]

if len(feature_columns) < 1:
    print("Not enough numeric features found for training!")
    exit(1)

print(f"Using features for training: {feature_columns}")


X = df[feature_columns].fillna(0)


scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)


print("Training Isolation Forest model...")
model = IsolationForest(
    contamination=0.05,
    random_state=42
)
model.fit(X_scaled)


scores = model.decision_function(X_scaled)  
predictions = model.predict(X_scaled) 
anomaly_scores = -scores


z_scores = (anomaly_scores - np.mean(anomaly_scores)) / np.std(anomaly_scores)

df['anomaly_score'] = anomaly_scores
df['z_score'] = z_scores
df['is_anomaly'] = predictions == -1


def classify_threat(z):
    if z > 3:
        return 'High'
    elif z > 2:
        return 'Moderate'
    elif z > 1:
        return 'Low'
    else:
        return 'Normal'

df['threat_level'] = df['z_score'].apply(classify_threat)


print("Saving model and results...")
with open('model/isolation_forest.pkl', 'wb') as f:
    pickle.dump(model, f)

with open('model/scaler.pkl', 'wb') as f:
    pickle.dump(scaler, f)

df.to_csv('model/analysis_results.csv', index=False)


anomalies = df[df['is_anomaly']].copy()
if not anomalies.empty:
    anomalies_json = []
    
    for _, row in anomalies.iterrows():
        anomaly = {
            'log_file': row['log_file'],
            'log_stream': row['log_stream'],
            'anomaly_score': float(row['anomaly_score']),
            'z_score': float(row['z_score']),
            'threat_level': row['threat_level']
        }
        
       
        for col in feature_columns:
            anomaly[col] = float(row[col]) if pd.notnull(row[col]) else 0
        
        anomalies_json.append(anomaly)
    
    with open('model/anomalies.json', 'w') as f:
        json.dump(anomalies_json, f, indent=2)
    print(f"Saved {len(anomalies_json)} anomalies to model/anomalies.json")


plt.figure(figsize=(10, 6))
plt.hist(z_scores, bins=50, alpha=0.7)
plt.axvline(x=2, color='orange', linestyle='--', label='Moderate Threat (Z=2)')
plt.axvline(x=3, color='red', linestyle='--', label='High Threat (Z=3)')
plt.title('Distribution of Anomaly Z-Scores')
plt.xlabel('Z-Score (higher = more anomalous)')
plt.ylabel('Count')
plt.legend()
plt.savefig('model/z_score_distribution.png')


print("\nANALYSIS SUMMARY")
print("-" * 50)
print(f"Total log entries: {len(df)}")
print(f"Anomalies detected: {len(anomalies)} ({len(anomalies)/len(df)*100:.2f}%)")
print("\nThreat level distribution:")
threat_counts = df['threat_level'].value_counts()
for level, count in threat_counts.items():
    print(f"  {level}: {count} ({count/len(df)*100:.2f}%)")
print("-" * 50)
print("Model and results saved successfully!")
print("Check 'model/anomalies.json' for detailed anomaly information")