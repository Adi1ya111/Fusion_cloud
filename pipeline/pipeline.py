import json
import requests

# Path to analysis results
with open('model_data/analysis_results.json') as f:
    analysis_results = json.load(f)

# Define index name
index_name = "analysis-results"

# Bulk insert to Elasticsearch
def send_to_elasticsearch(docs, index=index_name):
    bulk_data = ""
    for doc in docs:
        meta = {"index": {}}
        bulk_data += json.dumps(meta) + "\n"
        bulk_data += json.dumps(doc) + "\n"
    response = requests.post(
        f"http://localhost:9200/{index}/_bulk",
        headers={"Content-Type": "application/x-ndjson"},
        data=bulk_data
    )
    print("Elasticsearch response:", response.status_code)
    print(response.text[:500])  # Show partial response for debug

# Send the data
send_to_elasticsearch(analysis_results)
