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

# Select features
numeric_columns = df.select_dtypes(include=['number']).columns.tolist()
feature_columns = [col for col in numeric_columns if col != 'timestamp']
X = df[feature_columns].fillna(0)

# Scale features
X_scaled = scaler.transform(X)

# Anomaly detection
scores = model.decision_function(X_scaled)
anomaly_scores = -scores
z_scores = (anomaly_scores - np.mean(anomaly_scores)) / np.std(anomaly_scores)

df['anomaly_score'] = anomaly_scores
df['z_score'] = z_scores
df['is_anomaly'] = model.predict(X_scaled) == -1

# Percentile-based classification
df = df.sort_values('z_score', ascending=False).reset_index(drop=True)
n = len(df)

df['threat_level'] = 'Low'  # default
df.loc[:int(0.05 * n), 'threat_level'] = 'High'        # Top 5%
df.loc[int(0.05 * n):int(0.15 * n), 'threat_level'] = 'Moderate'  # Next 10%

# Save full results
with open('model_data/analysis_results.json', 'w') as f:
    json.dump(df.to_dict(orient='records'), f, indent=2)

# Save anomalies only (based on is_anomaly flag)
anomalies = df[df['is_anomaly']].copy()
if not anomalies.empty:
    anomalies_json = []
    for _, row in anomalies.iterrows():
        entry = {
            'log_file': row.get('log_file', ''),
            'log_stream': row.get('log_stream', ''),
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

# Plot Z-score distribution
plt.figure(figsize=(10, 6))
plt.hist(z_scores, bins=50, alpha=0.7, color='skyblue', edgecolor='black')
plt.axvline(x=df['z_score'].iloc[int(0.05 * n)], color='red', linestyle='--', label='High Risk Threshold')
plt.axvline(x=df['z_score'].iloc[int(0.15 * n)], color='orange', linestyle='--', label='Moderate Risk Threshold')
plt.title('Distribution of Anomaly Z-Scores')
plt.xlabel('Z-Score')
plt.ylabel('Count')
plt.legend()
plt.tight_layout()
plt.savefig('model_data/z_score_distribution.png')

# Summary
print("\nANALYSIS SUMMARY")
print("-" * 50)
print(f"Total log entries: {len(df)}")
print("-" * 50)
print("Threat level distribution (entire dataset):")
for level in ['High', 'Moderate', 'Low']:
    count = (df['threat_level'] == level).sum()
    print(f"  {level}: {count} ({count/len(df)*100:.2f}%)")
print("-" * 50)
