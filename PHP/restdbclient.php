<?php
require 'vendor/autoload.php';
use GuzzleHttp\Client;

$client = new Client([
    // Base URI is used with relative requests
    'base_uri' => 'https://rdb-examples.restdb.io/rest/',
    // You can set any number of default request options.
    'timeout'  => 2.0,
    'headers' => ['X-apikey' => '58aef41e2c4ed27f0da9dd05a1720d6698be3']
]);

// Create object wobbly
$wobbly['title'] = 'Wobbly bubbles';
$wobbly['description'] = "They are the best";
$wobbly['count'] = 4;
$wobbly['email'] = "wobble@wobble.com";

// POST it
$response = $client->post("stuff",['json'=>$wobbly]);
$code = $response->getStatusCode();

//Create object snuttgly
$snuggly['title'] = 'Snuggly snuggles';
$snuggly['description'] = "They are the worst";
$snuggly['count'] = 8;
$snuggly['email'] = "snuggle@snuggle.com";

// POST another one
$response = $client->post("stuff",['json'=>$snuggly]);
$code = $response->getStatusCode();

// GET all
$response = $client->get("stuff");
$items = json_decode($response->getBody()); 
$item1 = $items[0];
$item1->count += 1; 

// PUT back a change
$puturl = "stuff/" . $item1->_id;
$response = $client->put($puturl,['json'=>$item1]);
$code = $response->getStatusCode();

// DELete an item
$item2 = $items[1];
$delurl = "stuff/" . $item2->_id;
$response = $client->delete($delurl);
$code = $response->getStatusCode();
echo $code

?>
