import requests
import json

url = "http://localhost:8000/api/ai"
data = {
    "problem": "Calculate force on a 5kg object with 2m/s^2 acceleration",
    "subject": "Physics",
    "level": "Step by Step",
    "language": "English"
}

try:
    response = requests.post(url, json=data)
    print(f"Status: {response.status_code}")
    print(f"Response: {json.dumps(response.json(), indent=2)}")
except Exception as e:
    print(f"Error: {e}")
