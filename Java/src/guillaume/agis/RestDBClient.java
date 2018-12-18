package guillaume.agis;

import java.io.*;
import java.net.HttpURLConnection;
import java.net.URL;

import java.util.logging.Logger;

/**
 * Created by guillaumeagis on 15/03/2016.
 */
public final class RestDBClient {

    private final String TAG = RestDBClient.class.getSimpleName();
    // You can find your API KEYS here : https://restdb.io/docs/apikeys-and-cors
    private final String BASE_URI = "https://rdb-examples.restdb.io/rest/"; // change to your BASE URI
    private final String API_KEY = "58aef41e2c4ed27f0da9dd05a1720d6698be3"; // change to your API KEY
    private final String CONTENT_TYPE = "application/json";
    private final int TIMEOUT = 2000;// 2000ms = 2seconds

    //HTTP protocol
    private final String POST = "POST";
    private final String DELETE = "DELETE";
    private final String GET = "GET";
    private final String PUT = "PUT";

    /**
     * Create connection to the server
     * @param requestMethod Method to the request (PUT,GET,DELETE,POST)
     * @param url url to call
     * @return connection
     * @throws IOException throw exception if wrong parameters or cant' open a connection
     */
    private  HttpURLConnection createConnection(final String requestMethod, final String url) throws IOException {
        HttpURLConnection connection = null;
        URL finalUrl = new URL(BASE_URI + url);
        connection = (HttpURLConnection)finalUrl.openConnection();
        connection.setRequestMethod(requestMethod);
        connection.setRequestProperty("X-apikey", API_KEY);
        connection.setRequestProperty("Content-Type", CONTENT_TYPE);
        connection.setConnectTimeout(TIMEOUT);
        connection.setUseCaches(false);
        connection.setDoOutput(true);
        return connection;
    }

    /**
     * Send Post request
     * @param connection current connection
     * @param parameters parameters to send to the POST request
     * @throws IOException throw exception if wrong parameters or cant' open a connection
     */
    private void sentPostRequest(final HttpURLConnection connection, final String parameters) throws IOException {
        DataOutputStream wr = new DataOutputStream(connection.getOutputStream());
        wr.writeBytes(parameters);
        wr.flush();
        wr.close();
    }


    /**
     * Call the API without parameter
     * @param requestMethod HTTP protocol  (GET,DELETE)
     * @param url url to call
     * @return
     */
    private String executeHTTPRequest(final String requestMethod, final String url) {
        return executeHTTPRequest(requestMethod,url, null);
    }
    /**
     * Call the API, Only POST and PUT requests have parameters
     * @param requestMethod HTTP protocol  (PUT, GET,DELETE,POST)
     * @param url url to call
     * @param parameters parameters to send to the POST request. otherwise null
     * @return
     */
    private  String executeHTTPRequest(final String requestMethod, final String url, final String parameters)  {
        HttpURLConnection connection = null;
        StringBuilder response = new StringBuilder(); // or StringBuffer if not Java 5+
        try {
            //Create connection
            connection = createConnection(requestMethod, url);

            if (POST.equals(requestMethod))
                sentPostRequest(connection, parameters);

            // read stream
            InputStream is = connection.getInputStream();
            BufferedReader rd = new BufferedReader(new InputStreamReader(is));
            String line;
            while((line = rd.readLine()) != null) {
                response.append(line); // append result
            }
            rd.close();
        } catch (IOException e) {
            System.err.println("Cant connect to the server. Please try later on");
        }
        finally {
            // close connection no matter what
            if (connection != null) {
                connection.disconnect();
            }
        }
        return response.toString();
    }

    /**
     * POST method
     * @param collection collection to call
     * @param objectToAdd object to add in the collection
     * @return result from the server
     */
    public  String post(final String collection, final String objectToAdd) {
        return executeHTTPRequest(POST, collection, objectToAdd);
    }

    /**
     * GET method, get the list of items in the given collection
     * @param collection collection to call
     * @return list of items in the collection
     */
    public  String get(final String collection) {
        return executeHTTPRequest(GET, collection);
    }

    /**
     * PUT method, update a given object by its ID
     * More info about the query here : https://restdb.io/docs/querying-with-the-api
     * @param collection collection to call, with the ID of the object to update
     * @return ID of the object updated
     */
    public  String put(final String collection, final String query) {
        return executeHTTPRequest(PUT, collection, query);
    }

    /**
     * DELETE method, delete a given object by its ID
     * @param collection collection to call, with the ID of the object to delete
     * @return List of ID's ( the deleted objects )
     */
    public  String delete(final String collection) {
        return executeHTTPRequest(DELETE, collection);
    }
}
