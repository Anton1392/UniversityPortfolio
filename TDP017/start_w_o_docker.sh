#!bin/#!/usr/bin/env bash

hostDB='"host": "localhost",'
portDB='"port": 5432,'

# Check port and host of api. This script is without docker
jsonFile=api/src/main/resources/application.json
host=$(cat $jsonFile | grep '"host":')
port=$(cat $jsonFile | grep '"port":')

if [[ "$host" == *"$hostDB"* ]]
then
  echo "Host is set to localhost..."
else
  echo "Host is not set correct. Change host to localhost"
  $(sed -i.bak "s/${host}/    ${hostDB}/g" $jsonFile)
fi

if [[ "$port" == *"$portDB"* ]]
then
  echo "Port is set to default portsql"
else
  echo "Port is not set correct. Change port to 5432"
  sed -i.bak "s/${port}/    ${portDB}/g" $jsonFile
fi

# Create a new terminal for API
# Change to gnome-terminal/mate-terminal depending on default terminal
terminal=$(cat /etc/os-release | grep '^NAME="Ubuntu"')
echo $terminal

if [ $terminal == 'NAME="Ubuntu"' ]
then
  echo "Starting a second gnome-terminal in Linux Ubuntu"
  gnome-terminal --tab --title="api" -e 'sh -c "cd api; mvn clean compile; mvn package; java -jar target/esdcheck-api-0.0.1.jar exec bash"'
else
  echo "Starting a second mate-terminal in Linux Mint"
  mate-terminal --tab --title="api" -e 'sh -c "cd api; mvn clean compile; mvn package; java -jar target/esdcheck-api-0.0.1.jar exec bash"'
fi

# Execute frontend
cd frontend/admin-web-app
npm install
npm start
