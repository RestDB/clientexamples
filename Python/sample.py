import requests
headers = {'x-apikey': '58aef41e2c4ed27f0da9dd05a1720d6698be3'}
params = {'sort': 'title'}
resp = requests.get('https://rdb-examples.restdb.io/rest/stuff', params=params, headers=headers)
if resp.status_code != 200:
    # This means something went wrong.
    raise ApiError('GET /stuff/ {}'.format(resp.status_code))


for stuff in resp.json():
    print('{} {} {}'.format(stuff['_id'], stuff['title'], stuff['description']))
