# IPBAN 
A system to currate malicious TOR ips for the security team's use. 

## Developer note
I was having issues getting the docker containers to communicate with each other and the application is not fully containerized. Instructions on how to run the application outline how to run the database container, run a python script for external data retrieval, and run a nodejs api server. 

I still created a dockerfile and docker-compose file to build application server, but it is not returning data properly in its current state.

I wanted to use a different language for my api server and data retrieval program to outline proficiency in multiple computer languages, with the understanding that it is more effective and efficient to create a fully containerized application in one language. 

## Running Application 

### Run mongo container from dockerfile
from ipban directory
docker-compose build
docker-compose up -d mongo

### Run python script to get data from external sources
from pythong-extraction/extraction directory
initialize python virtual environment (OS specific)
pip install -r requirements.txt
python extract.py

### Run node server
from api directory
npm install

run dev (nodemon)
npm run dev

run prod (node)
npm run prod


## endpoints
api docs
localhost:8080/

GET for all IPs extracted and not added to goodip list
localhost:8080/badip

POST for adding ip to goodip collection
localhost:8080/updateip

GET for all goodips
localhost:8080/goodip

GET ALL ips showing allowed state
localhost:8080/ipban

/GET single ip passed in with body
localhost:8080/ipbanip

## adding IP to good IP
Send a post to /updateip with body
{
  "ip":"xx.xx.xx.xx"
}

## get single IP passed back all records good and bad
Send a get to /ipbanip with body
{
  "ip":"xx.xx.xx.xx"
}


## Technologies stack
ide: VScode

Database: mongodb

api server
nodejs with dependecies nodemon, express, mongoose, body-parser

containerization
docker, docker-compose, dockerfile

api-testing
postman

extraction of tor node (script)
python with dependencies requests and pymongo

## Notes
Run python script only once as the dan endpoint only allows 1 call per 30 minutes. If you need to run again, please comment out the extract_dan_to_text() function in main and drop ipdb database in mongo container. 

drop database commands
mongosh localhost:8080
db.dropDatabase()

There is no error handling currently for running extraction scripts more than once.
