import requests
latest_file = './image.jpeg'
headers = {'x-apikey': '{MY_API_KEY_HERE}'}
url = "https://{MYDATABASE_NAME_HERE}.restdb.io/media"
files = {'file': open(latest_file, 'rb')}
r = requests.post(url, files=files, headers=headers)
print(r.status_code, r.text)