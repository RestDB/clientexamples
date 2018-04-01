/* 
* C# example file upload to restdb.io
* Using mulipart form data protocol
*/

byte[] data; // fill with some binary data

string tmpId = "";

Uri webService = new Uri("https://somedb-c1c0.restdb.io/media");

HttpRequestMessage requestMessage = new HttpRequestMessage(HttpMethod.Post, webService);
requestMessage.Headers.ExpectContinue = false;

MultipartFormDataContent multiPartContent = new MultipartFormDataContent("----MyGreatBoundary");

ByteArrayContent byteArrayContent = new ByteArrayContent(data);
byteArrayContent.Headers.Add("Content-Type", "application/octet-stream");
multiPartContent.Add(byteArrayContent, "profilePic", "profilePic.png");
requestMessage.Content = multiPartContent;
requestMessage.Headers.Add("x-apikey", "YOUR API KEY HERE");

HttpClient httpClient = new HttpClient();

try {

    Task < HttpResponseMessage > httpRequest = httpClient.SendAsync(requestMessage, HttpCompletionOption.ResponseContentRead);
    HttpResponseMessage httpResponse = httpRequest.Result;
    HttpStatusCode statusCode = httpResponse.StatusCode;
    HttpContent responseContent = httpResponse.Content;

    if (responseContent != null) {
        Task < String > stringContentsTask = responseContent.ReadAsStringAsync();
        String stringContents = stringContentsTask.Result;

        if (!stringContents.Substring(0, 1).Equals("[")) {
            string tmpStr = "[" + stringContents + "]";
            stringContents = tmpStr;
        }

        var objects = JArray.Parse(stringContents); // parse as array
        foreach(JObject root in objects)
        {
            foreach(KeyValuePair < String, JToken > app in root)
            {
                if (app.Key.Equals("ids")) {
                    tmpId = (String)app.Value[0];
                }
            }
        }
    }
}

catch (Exception ex)
{
    string errStr = ex.Message;
}
