from PostgreSQL.pass_db import Pass_DB
from PostgreSQL.endpoints_db import EndP_DB
from terminal import Terminal
import datetime, urllib.request, json
from time import sleep

class API_Data:
    def __init__(self):
        #self.db = Data_DB()
        pass

    def __del__(self):
        pass


    def refrech_zoezi_data(self):
        db = Pass_DB()
        ep = EndP_DB()
        first = True
        data = False
        endpoints = ep.get_endpoints()
        for endpoint in endpoints:
            while data == False:
                now = datetime.datetime.now()
                end = now + datetime.timedelta(days = 30)
                data = self.get_json_from_db(endpoint[1], endpoint[2], now.strftime("%Y-%m-%d"),end.strftime("%Y-%m-%d"))
                if data == False:
                    Terminal.warning(endpoints[2]+" backend could not be reached, trying again in 10 sec")
                    sleep(10)
                else:
                    if(first):
                        db.empty() #should not be run here!
                        first = False

                    for i in data:
                        i["owner"] = endpoint[2]
                    db.insert_many(data) ################# should be changed!!! takes s_id

                    Terminal.affirmative("New data from " + endpoint[2] + " recieved and backend data updated")
                    return True


    def get_json_from_db(self, endpoint, owner, from_date = None, to_date = None):
        try:
            with urllib.request.urlopen(endpoint+"get?fromDate="+from_date+"&toDate="+to_date) as url:
                a = url.read().decode()
                data = json.loads(a)
        except urllib.error.HTTPError:
            Terminal.error("get_json_from_db: HTTP Error, One or more of the Arguments are faulty")
            return False
        except:
            Terminal.error("get_json_from_db: Something went wrong while getting data from: " + owner)
            return False
        if data == None:
            Terminal.error("get_json_from_db: No data was recieved, continuing with old database")
            return False
        else:
            return data
        try:
            with urllib.request.urlopen(endpoint+"get?fromDate="+from_date+"&toDate="+to_date) as url:
                a = url.read().decode()
                data = json.loads(a)
        except urllib.error.HTTPError:
            Terminal.error("get_json_from_db: HTTP Error, One or more of the Arguments are faulty")
            return False
        except:
            Terminal.error("get_json_from_db: Something went wrong while getting data from: " + owner)
            return False
        if data == None:
            Terminal.error("get_json_from_db: No data was recieved, continuing with old database")
            return False
        else:
            return data






    def get_workout_from_id(self, workout_id): #int id
        db = Pass_DB()
        return db.get_one(workout_id)

    def get_all_workouts(self):
        db = Pass_DB()
        return db.find({}) #int id


    def search_by_city(self, city):
        db = Pass_DB()
        return db.find({"city":city})


    def search_by_type(self, activity):
        db = Pass_DB()
        return db.find({"type":activity})


    def search_by_city_and_type(self, city, activity):
        db = Pass_DB()
        return db.find({"type":activity, "city":city})


    def add_endpoint(self, url, owner):
        ep = EndP_DB()
        return ep.add_endpoint(url, owner)


    def update_one(self, record): #s_id
        db = Pass_DB()
        return db.update_many([record])


    def add_workout(self, workout, owner):
        db = Pass_DB()
        try:
            #workout = json.loads(workout)
            workout["owner"] = owner
            workout["id"] = None ################# what?
            i = int(workout["available"])
            return db.insert_many([workout]) #s_id
        except Exception as e:
            print("ERROR: ", e)
            return False
