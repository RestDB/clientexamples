## Python media upload
Upload a local media file using the Python request library.

```python
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
```

If the request is valid the server will respond with a `201` status and the following JSON output:

```js
{
    "msg":"OK",
    "uploadid":"fa79c4c3e690e79d6b7db07e633fa84e",
    "ids":["5c18b5ff7b57fd5300020358"]
}
```
