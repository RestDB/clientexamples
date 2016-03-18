#!/bin/sh
echo "Start compiling RESTDBClient in Java..."
mkdir bin ; javac -cp lib/json-simple-1.1.1.jar src/guillaume/agis/* -d bin
echo "Compilation done. Execute sample..."
java -cp "./bin:./lib/json-simple-1.1.1.jar" guillaume/agis/Main