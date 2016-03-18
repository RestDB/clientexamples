package guillaume.agis;

import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.json.simple.parser.ParseException;

@SuppressWarnings("unchecked")
public class Main {

    /**
     * Collection name
     */
    private static final String COLLECTION = "stuff";

    /**
     * Create 2 JSON Objects and add them to the collection
     * @param client restDB client
     */
    private static void postRequest(final RestDBClient client) {
        JSONObject woobly = new JSONObject();
        woobly.put("title", "Wobbly bubbles");
        woobly.put("description", "They are the best");
        woobly.put("count", 4);
        woobly.put("email", "wobble@wobble.com");


        JSONObject snuttgly = new JSONObject();
        snuttgly.put("title", "Snuggly snuggles");
        snuttgly.put("description", "They are the worst");
        snuttgly.put("count", 8);
        snuttgly.put("email", "snuggle@snuggle.com");

        String resultWoobly = client.post(COLLECTION, woobly.toJSONString());

        System.out.println("result Woobly postRequest : " + resultWoobly);
        String resultSnuttgly = client.post(COLLECTION, snuttgly.toJSONString());
        System.out.println("result Snuttgly postRequest : " + resultSnuttgly);

        // call Garbage collection
        snuttgly = null;
        woobly = null;
    }

    /**
     *  Get the list of items in the collection
     * @param client RestDBClient
     * @return list of items in the collection, String format
     */
    private static String getRequest(final RestDBClient client) {
        String result = client.get(COLLECTION);
        System.out.println("result getRequest : " + result);
        return result;
    }


    /**
     *  Get the list of items in the collection where count = 0
     *  More info about the parameters of the queries here : https://restdb.io/docs/querying-with-the-api
     * @param client RestDBClient
     * @return list of items in the collection, String format
     */
    private static String getRequestWithFilter(final RestDBClient client) {
        JSONObject jsonQuery = new JSONObject();
        jsonQuery.put("count", 8);
        String query = "?q=" + jsonQuery.toJSONString();
        String result = client.get(COLLECTION + query);
        System.out.println("result getRequestWithFilter : " + result);
        return result;
    }

    /**
     * Update an item from a collection given its ID
     * @param client RestDBClient
     * @param resultGetAll list of items from the collection
     * @return ID of the updated item
     */
    private static String putRequest(final RestDBClient client, final String resultGetAll) {
        JSONParser parser = new JSONParser();
        Object obj = null;
        String id = null;
        try {
            obj = parser.parse(resultGetAll);
            JSONArray results = (JSONArray)(obj);
            if (!resultGetAll.isEmpty() && results.size() > 0)
            {
                JSONObject firstOne = (JSONObject)results.get(0); // take first item
                System.out.println(firstOne.toJSONString());
                firstOne.put("title", "updated title");
                id = (String)firstOne.get("_id");
                String resultPut = client.put(COLLECTION + "/" + id, firstOne.toJSONString());
                System.out.println(resultPut);
            }
        } catch (ParseException e) {
            e.printStackTrace();
        }
        return id;
    }

    /**
     *  Delete item from a collection by aa given ID
     * @param client RestDBCliet
     * @param id ID of the item to delete from the collection
     */
    private static void deleteRequest(final RestDBClient client, final String id) {
        String resultDelete = client.delete(COLLECTION + "/" + id);
        System.out.println(resultDelete);
    }

    /**
     * entry point
     * @param args arguments, there is currently no argument given to this app
     */
    public static void main(String[] args) {

        RestDBClient client = new RestDBClient();

        postRequest(client);
        String resultGetAll = getRequest(client);
        getRequestWithFilter(client);
        String id = putRequest(client, resultGetAll);
        deleteRequest(client, id);

        // Garbage collection
        client = null;
    }
}
