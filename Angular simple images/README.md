## Angular simple image demo
Simple image + caption upload and CRUD using AngularJS and restdb.io by Federico Portoghese federico.portoghese@gmail.com
	
Requirements:
an accessible restdb.io database with one collection, two fields are required:
	
1. A Text field called "Name"
2. An Image field called "Image"

## Setup

Edit app.js and change this to your database:

```js
hImages.constant("config", {
    apiKey: /* Enter your CORS API key here. Eg. "57483247g45b25478968j7d9fg" */,
    dbName: /* Enter your database name here. Eg. "images-8a0b" */,
    collectionName: /* Enter your collection name here. Eg. "images" */
});
```
**important**: Create a valid [CORS API key](https://restdb.io/docs/apikeys-and-cors#restdb), use `* as Access-Control-Allow-Origin for running from a local machine.

Open index.html and run the App.

