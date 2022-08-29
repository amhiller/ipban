import requests
import pymongo
import os


#Make get request to domain and save response as txt file
def extract_dan_to_text():

  if os.path.exists("response.txt"):
    os.remove("response.txt")
  else:
    print("The file does not exist")
  #URL rate limited: 1 reqest/30min
  url = "https://www.dan.me.uk/torlist"
  try:
    response = requests.get(url)
    with open("response.txt", "w") as f:
      f.write(response.text)
  except:
    print("Error Occured")
  return 

#Parse text file from dan request - return list of IPs
#Limit 50
def extract_dan_text():
  print("Initiating extract dan from file")
  dan_ip_list = []
  with open("response.txt", "r") as f:
    kill = 0
    for a in f:
      if(kill == 50):
        break
      else:
        dan_ip_list.append(a.strip("\n"))
        kill+=1

  return dan_ip_list

#extract udger test data from github - return list of IPs ['91.54.78.34', '91.55.246.9', etc..
def extract_udger_test():
  print("Initating udger test ips extraction")
  ip_list = []
  url = "https://raw.githubusercontent.com/udger/test-data/master/CSV_data_example/tor_exit_node.csv"
  try:
    response = requests.get(url)
    ip_list = list(response.text.split("\n"))
    ip_list_final = []
    for a in ip_list:
      li = list(a.split(","))
      ip_list_final.append(li)
  except:
    print("Error Occured")

  ip_stripped = []
  for a in ip_list_final:
    ip_stripped.append(a[0].strip('"')) 

  return ip_stripped

def add_data_to_database(list1, list2):

  print("Adding data to database")


  connect_url = "mongodb://localhost:27017"

  try:
    client = pymongo.MongoClient(
    host = connect_url
    )
    ipdb = client.ipdb
    #print(ipdb)
    collection = ipdb.badips
    #print(collection)

  except:
    print("Error connecting to ipdb database - add_data_to_database")
  
  for a in list1:
    temp_dict = {"ip": a, "allow_list": 0}
    #print(temp_dict)
    try:
      x = collection.insert_one(temp_dict)
    except:
      print("database update failed")

  for b in list2:
    temp_dict = {"ip": b, "allow_list": 0}
    #print(temp_dict)
    try:
      x = collection.insert_one(temp_dict)
    except:
      print("database update failed")

  return

def initialize_db():

  print("Initializing DB")
  connect_url = "mongodb://localhost:27017/"

  try:
    client = pymongo.MongoClient(
      host = connect_url
    )
  except:
    print("Error connecting to mongodb container")

  dblist = client.list_database_names()
  
  #print(dblist)
  if "ipdb" not in dblist:
    print("Initializing ipdb database")
    ipdb = client["ipdb"]
    collectionlist = ipdb.list_collection_names()
    #collection initialize
    if "badips" not in collectionlist:
      print("initializing badips collection")
      ipcollection = ipdb["badips"]
      #opendns = { "ip": "208.67.222.222", "allow_list": 0}
      #x = allowipcollection.insert_one(opendns)
    else:
      print("badips collection initialized")
    
    if "goodips" not in collectionlist:
      print("initializing goodips collection")
      allowipcollection = ipdb["goodips"]
      google_ip = { "ip": "8.8.8.8", "allow_list": 1}
      x = allowipcollection.insert_one(google_ip)
    else:
      print("goodips collection initialized")


  else:
    print("ipdb database already initialized")
    


  return


def main():
  print("Starting IP extraction")
  
  #Comment if API limit reached for extraction - 1 request / 30 min
  #COMMENT THIS IF YOU WANT TO RUN THIS SCRIPT MORE THAN ONCE
  extract_dan_to_text()

  udger_list = extract_udger_test()
  dan_list = extract_dan_text()

  initialize_db()
  add_data_to_database(udger_list, dan_list)


if __name__ == "__main__":
  main()