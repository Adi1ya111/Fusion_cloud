# FUSION CLOUD

**Team Fusion** presents an AI-driven threat detection and response system for cloud environments. Designed for enterprises and individual users, this platform leverages unsupervised machine learning to proactively detect and mitigate cybersecurity threats.

## Project Overview

### Problem Statement

***AI-Enhanced Threat Hunting in Cloud Environments***

Build an AI tool to monitor and analyze cloud access logs and configurations, detecting anomalous behaviors indicative of compromise or misconfiguration.
Feasibility: Use publicly available cloud security logs (or simulated datasets)

### Proposed Solution

Our platform continuously monitors cloud network traffic and access logs using machine learning algorithms to detect unusual patterns. Key features include:

- **Real-time Monitoring**: Continuous analysis of cloud activity to detect suspicious behavior.
- **Anomaly Detection**: Use of Isolation Forest and PCA to detect outliers without requiring labeled data.
- **Threat Classification**: Assigning confidence scores and labeling anomalies as High, Moderate, or Low threats.
- **SIEM Integration**: Full integration with the ELK Stack (Elasticsearch, Logstash, Kibana) for detailed analysis and visualization for organisational level.
- **User Friendly Interface**:Built with Next.js to provide an intuitive and responsive dashboard for individual users.


## Technical Architecture

### 1. Data Capture and Acquisition

- **AWS VPC Flow Logs**: Enables flow logs in VPC to capture network traffic data.
- **CloudWatch Logs**: Stores and manages logs centrally.
- **Log Group**: Creates a dedicated log group to manage logs.

### 2. Data Processing and Feature Extraction

- **`download_logs.py`**: Downloads AWS CloudWatch logs and saves them as structured JSON files in `data/logs/`.

- **Feature Extraction**: Extracts key features such as:
  - Bytes
  - Packets
  - Duration
  - Source IP
  - Event Type

### 3. Model Training and Anomaly Detection

- **`train_model.py`**: Loads logs, preprocesses data, and trains the Isolation Forest model for unsupervised anomaly detection.

- **Anomaly Scoring**: Calculates Z-scores to measure the severity of each anomaly.

- **Threat Classification** based on Z-score:
  - **High**: Z-score > 3
  - **Moderate**: 2 < Z-score ≤ 3
  - **Low**: 1 < Z-score ≤ 2
  - **Normal**: Z-score ≤ 1

### 4. Visualization and Reporting

- **Kibana Dashboards**: Visualize:
  - Anomaly trends
  - Threat levels
  - Network traffic patterns

- **Reports**: Generate detailed reports highlighting detected threats and anomaly behavior.

## Use Cases

### Enterprise Security

- **Advanced Threat Detection**: Identify lateral movement, privilege escalation, and insider threats.
- **Incident Response**: Automate threat detection and reduce time to mitigation.

### Personal Cloud Usage

- **Simplified Interface**: Easy-to-understand dashboards for non-technical users.
- **Anomaly Alerts**: Notify users of unusual logins or access attempts.
- **Data Privacy**: Protect personal data stored in cloud services from unauthorized access.


## Real-World Impact

By integrating AI with cloud security monitoring, **FUSION CLOUD** offers:

- **Proactive Defense**: Early detection and real-time mitigation of threats.
- **Resource Optimization**: Automates log analysis and threat hunting.

## Environment Setup

### Clone the Repository

```bash
https://github.com/Adi1ya111/Fusion_cloud.git
cd Fusion_cloud
```

### Configure AWS CLI

```bash
aws configure
```
### Install Dependencies
```bash
pip install -r requirements.txt
```
### Set Up CloudWatch Logs
Enable VPC Flow Logs.

Direct them to a CloudWatch Log Group named: threat-detection-logs.

### Download Logs
```bash
python download_logs.py
```
### Train the Model
``` bash
python train_model.py
```
## Elasticsearch and Kibana Set Up (Local Setup)
### 1 Download and Install Elasticsearch
```  bash

wget https://artifacts.elastic.co/downloads/elasticsearch/elasticsearch-8.13.0-linux-x86_64.tar.gz
tar -xzf elasticsearch-8.13.0-linux-x86_64.tar.gz
cd elasticsearch-8.13.0
./bin/elasticsearch
``` 
### 2. Download and Install Kibana
Open a new terminal:
``` bash
wget https://artifacts.elastic.co/downloads/kibana/kibana-8.13.0-linux-x86_64.tar.gz
tar -xzf kibana-8.13.0-linux-x86_64.tar.gz
cd kibana-8.13.0
./bin/kibana
``` 
### 3. Access Kibana
Open your browser and go to: http://localhost:5601
Set up index patterns to start visualizing logs and anomalies.
