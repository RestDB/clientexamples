# RestDBClient-JAVA

RestDB client example in  Java

The sources are into the folder src/guillaume/agis. Guillaume.agis is actually the name of the package.

## How to launch the program

- Just run ./restdb.sh in your term. The script will compile and execute the program.
- if you can't run restdb.sh, please verify the right on the file.

You can change the right of the file with this command : 
``` 
chmod 744 restdb.sh
```

## OUTPUT

```
resultWoobly postRequest : {"_id":"56e9d0b301bf3408000006f4","_created":"2016-03-16T21:31:31.627Z","_changed":"2016-03-16T21:31:31.627Z","_createdby":"api","_changedby":"api","_keywords":["api"],"_tags":"api","_version":0}
resultSnuttgly postRequest : {"_id":"56e9d0b401bf3408000006f5","_created":"2016-03-16T21:31:32.783Z","_changed":"2016-03-16T21:31:32.783Z","_createdby":"api","_changedby":"api","_keywords":["api"],"_tags":"api","_version":0}
result getRequest : [{"_id":"56e9d0b301bf3408000006f4"},{"_id":"56a7af4f0075c62a000012c4","description":"POST from Pyhon code","title":"Python title"},{"_id":"56a7aec20075c62a000012bb","description":"POST from Pyhon code kakemiks","title":"Python title","count":0,"email":""},{"_id":"56992027c429a20e0000061e","title":"jones was here now","description":"They are the best oh yeah","count":8,"email":"wobble@wobble.com"},{"_id":"56a7aef50075c62a000012c2","description":"POST from Pyhon code","title":"Python title"},{"_id":"56992036c429a20e00000621","title":"changed by Python PUT","description":"They are the worst","count":8,"email":"snuggle@snuggle.com"},{"_id":"56a7b1b70075c62a000012cb","description":"POST from Pyhon code","title":"Python title"},{"_id":"56aa23059ed96c3900000b4d","description":"POST from Pyhon code","title":"Python title"},{"_id":"56e87bc7bba86b5900000000"},{"_id":"56e87c52bba86b5900000001"},{"_id":"56e87d39bba86b5900000002"},{"_id":"56e87d61bba86b5900000003"},{"_id":"56e883d9d8c9f74b00000009"},{"_id":"56e883dad8c9f74b0000000a"},{"_id":"56e89dccd8c9f74b0000000b"},{"_id":"56e89dcdd8c9f74b0000000c"},{"_id":"56e89e92d8c9f74b0000000d"},{"_id":"56e89e93d8c9f74b0000000e"},{"_id":"56e8a2cfd8c9f74b00000010"},{"_id":"56e8a301d8c9f74b00000011"},{"_id":"56e8a303d8c9f74b00000012"},{"_id":"56e9c05c01bf3408000006e3"},{"_id":"56e9c1d101bf3408000006e5"},{"_id":"56e9c1ea01bf3408000006e7"},{"_id":"56e9c20d01bf3408000006e9"},{"_id":"56e9c22801bf3408000006eb"},{"_id":"56e9c26d01bf3408000006ed"},{"_id":"56e9c2c801bf3408000006ef"},{"_id":"56e9c2dc01bf3408000006f1"},{"_id":"56e9cdb401bf3408000006f3"},{"_id":"56e9d0b401bf3408000006f5"}]
result getRequestWithFilter : [{"_id":"56a7aec20075c62a000012bb","description":"POST from Pyhon code kakemiks","title":"Python title","count":0,"email":""}]
{"_id":"56e9d0b301bf3408000006f4"}
{"_id":"56e9d0b301bf3408000006f4","_created":"2016-03-16T21:31:31.627Z","_changed":"2016-03-16T21:31:36.457Z","_createdby":"api","_changedby":"api","_keywords":["api"],"_tags":"api","_version":1}
{"result":["56e9d0b301bf3408000006f4"]}

Process finished with exit code 0
```




Dev by Guillaume Agis, 2016
