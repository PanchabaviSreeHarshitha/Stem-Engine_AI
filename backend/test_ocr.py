import requests
import os

url = "http://localhost:8000/api/scan-image"
image_path = r"c:\Users\venup\OneDrive\Desktop\MPC cal\frontend\public\assets\simulations\periodic_table.png"

with open(image_path, "rb") as f:
    files = {"file": (os.path.basename(image_path), f, "image/png")}
    response = requests.post(url, files=files)

print(f"Status: {response.status_code}")
print(f"Response: {response.json()}")
