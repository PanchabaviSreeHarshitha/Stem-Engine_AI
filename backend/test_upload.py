import urllib.request
import os

filepath = r'c:\Users\venup\OneDrive\Desktop\MPC cal\backend\main.py'
filename = os.path.basename(filepath)
boundary = '----WebKitFormBoundary7MA4YWxkTrZu0gW'

with open(filepath, 'rb') as f:
    file_content = f.read()

body = (
    f'--{boundary}\r\n'
    f'Content-Disposition: form-data; name="file"; filename="{filename}"\r\n'
    f'Content-Type: application/octet-stream\r\n\r\n'
).encode('utf-8') + file_content + f'\r\n--{boundary}--\r\n'.encode('utf-8')

req = urllib.request.Request('http://localhost:8000/api/scan-image', data=body)
req.add_header('Content-Type', f'multipart/form-data; boundary={boundary}')

try:
    with urllib.request.urlopen(req) as response:
        print('Status:', response.status)
        print('Response:', response.read().decode())
except urllib.error.HTTPError as e:
    print('HTTP Error Status:', e.code)
    print('HTTP Error Response:', e.read().decode())
except Exception as e:
    print('Error:', e)
