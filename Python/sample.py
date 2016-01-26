import requests
import json
# URL to restdb.io database
dburl = 'https://rdb-examples.restdb.io/rest/stuff'

# public api key
headers = {'x-apikey': '58aef41e2c4ed27f0da9dd05a1720d6698be3', 'Content-Type': 'application/json'}
params = {'sort': 'title'}
payload = {"title":"Python title", "description": "POST from Pyhon code"}

# POST data
r = requests.post(dburl, headers = headers, data = json.dumps(payload))

print(r.status_code, r.text)

# GET data
r = requests.get(dburl, params=params, headers=headers)

print(r.status_code, r.text)

# print records
for stuff in r.json():
    print('{} {} {}'.format(stuff['_id'], stuff['title'], stuff['description']))

# PUT an update to record 56992036c429a20e00000621
requests.put(dburl+"/56992036c429a20e00000621", headers = headers, data = json.dumps({"title":"changed by Python PUT"}))
print(r.status_code, r.text)

# DELETE example code
#requests.delete(dburl+"/56992036c429a20e00000621")
