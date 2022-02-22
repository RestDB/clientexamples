import requests
url = "https://{MYDATABASE_NAME_HERE}.restdb.io/media"
payload={}
files=[
  ('file',('image.jpeg',open('./image.jpeg','rb'),'image/jpeg'))
]
headers = {
  'x-apikey': '{MY_API_KEY_HERE}'
}
response = requests.request("POST", url, headers=headers, data=payload, files=files)

print(response.text)
