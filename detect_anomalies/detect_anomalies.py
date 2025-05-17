import os
import json
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import pickle

# Create output directory
os.makedirs('model_data', exist_ok=True)

# Load model, scaler, and full dataset
with open('model/isolation_forest.pkl', 'rb') as f:
    model = pickle.load(f)

with open('model/scaler.pkl', 'rb') as f:
    scaler = pickle.load(f)

with open('model/full_data.json', 'r') as f:
    records = json.load(f)

df = pd.DataFrame(records)

numeric_columns = df.select_dtypes(include=['number']).columns.tolist()
feature_columns = [col for col in numeric_columns if col != 'timestamp']
X = df[feature_columns].fillna(0)

X_scaled = scaler.transform(X)

# Detect anomalies
scores = model.decision_function(X_scaled)
anomaly_scores = -scores
z_scores = (anomaly_scores - np.mean(anomaly_scores)) / np.std(anomaly_scores)

df['anomaly_score'] = anomaly_scores
df['z_score'] = z_scores
df['is_anomaly'] = model.predict(X_scaled) == -1

# Classify only anomalies
def classify_threat(z):
    if z > 3:
        return 'High'
    elif z > 2:
        return 'Moderate'
    else:
        return 'Low'

df['threat_level'] = None
df.loc[df['is_anomaly'], 'threat_level'] = df.loc[df['is_anomaly'], 'z_score'].apply(classify_threat)

# Save full results
with open('model_data/analysis_results.json', 'w') as f:
    json.dump(df.to_dict(orient='records'), f, indent=2)

# Save anomalies only
anomalies = df[df['is_anomaly']].copy()
if not anomalies.empty:
    anomalies_json = []
    for _, row in anomalies.iterrows():
        entry = {
            'log_file': row['log_file'],
            'log_stream': row['log_stream'],
            'anomaly_score': float(row['anomaly_score']),
            'z_score': float(row['z_score']),
            'threat_level': row['threat_level']
        }
        for col in feature_columns:
            entry[col] = float(row[col]) if pd.notnull(row[col]) else 0
        anomalies_json.append(entry)

    with open('model_data/anomalies.json', 'w') as f:
        json.dump(anomalies_json, f, indent=2)

    print(f"Saved {len(anomalies_json)} anomalies to model_data/anomalies.json")

# Plot
plt.figure(figsize=(10, 6))
plt.hist(z_scores, bins=50, alpha=0.7)
plt.axvline(x=2, color='orange', linestyle='--', label='Moderate Threat (Z>2)')
plt.axvline(x=3, color='red', linestyle='--', label='High Threat (Z>3)')
plt.title('Distribution of Anomaly Z-Scores')
plt.xlabel('Z-Score')
plt.ylabel('Count')
plt.legend()
plt.savefig('model_data/z_score_distribution.png')

# Summary
print("\nANALYSIS SUMMARY")
print("-" * 50)
print(f"Total log entries: {len(df)}")
print(f"Anomalies detected: {len(anomalies)} ({len(anomalies)/len(df)*100:.2f}%)")
print("\nThreat level distribution (anomalies only):")
for level in ['High', 'Moderate', 'Low']:
    count = (anomalies['threat_level'] == level).sum()
    print(f"  {level}: {count} ({count/len(anomalies)*100:.2f}%)")
print("-" * 50)
