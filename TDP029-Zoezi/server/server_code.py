#!/usr/bin/env python3.7
import json, datetime, config, sys, signal, jwt, crypt, time, queue
from flask import request
from threading import Thread
from io_socket import *

from terminal import Terminal
from flask_socketio import SocketIO, emit

from api_user import API_User
from api_data import API_Data
from api_synonym import API_Synonym
from api_search_log import API_Search_Log




class Server:
    def __init__(self, app):
        self.socketio  = app
        self.api_data  = API_Data()
        self.api_user  = API_User()
        self.api_syn   = API_Synonym()
        self.api_search_log   = API_Search_Log()

        self.update_queue = queue.Queue()

        self.server_key = crypt.mksalt(crypt.METHOD_SHA256)
        self.sessions = {}
        self.threads = {}

        self.last_update = datetime.datetime.now()

        # Zoezi db refresh thread
        self.threads['update_thread'] = Thread(target=self.update)
        self.threads['update_thread'].start()

        # Zoezi (socket) update thread
        self.threads['inbound_thread'] = Thread(target=self.get_live_updates)
        self.threads['inbound_thread'].start()

        # Update cleaning thread
        self.threads['handle_update_thread'] = Thread(target=self.handle_updates)
        self.threads['handle_update_thread'].start()

        # Socket update tread
        self.threads['update_client_thread'] = Thread(target=self.update_clients)
        self.threads['update_client_thread'].start()

        # Ctr+C  handler
        signal.signal(signal.SIGINT, self.signal_handler)
        #Terminal.debug1("Server init done")


############################################################
### Internal functions
############################################################

    # Update zoezi data after a specific time
    def update(self):
        to_sleep = 0
        while(True):
            time.sleep(to_sleep)
            self.api_data.refrech_zoezi_data()
            self.clean_sessions()
            to_sleep=int(CONFIG["BACKEND"]["SLEEP_TIME"])
            #should also run admin_db_clean



    def handle_updates(self):
        while(True):
            unhandled_update = self.inbound_socket.request_queue.get()
            try:
                unhandled_update = unhandled_update['data']['data'][0]
                self.api_data.update_one(unhandled_update)


                id = unhandled_update['id']
                available = unhandled_update['available']
                self.update_queue.put({'id':id, 'available':available})
            except:
                continue



    def get_live_updates(self): # Open a socket and listen for updates
        self.inbound_socket = inbound_socket()
        self.inbound_socket.listen()



    def update_clients(self): # Broadcasts updates as they are processed
        while(True):
            update = self.update_queue.get()
            self.socketio.emit('broad', {'data': update})



    def signal_handler(self, sig, frame): #Manage Ctrl-C interrupt
        Terminal.error("Kill signal recieved")
        for key, thread in self.threads.items():
            try:
                thread.join(0)
            except:
                raise Exception
            Terminal.affirmative(key + " Exited Successfully")
        sys.exit(0)



    def clean_sessions(self): #Cleans expired sessions from the session dict
        for key, session_timeout in self.sessions:
            if session_timeout + datetime.timedelta(seconds=int(CONFIG["BACKEND"]["TOKEN_TIMEOUT"])) >= datetime.datetime.now():
                self.sessions.pop(key)



    def create_user(self, username, password, permission):
        return self.api_user.create_user(username, password, permission)


    def validate(self, token, required_permission):
        try:
            token = jwt.decode(token, self.server_key, algorithms='HS256')
            user = self.api_user.get_user(token['username'])
            if(self.sessions.get(token['session_id'], None) != None):
                if(user[3] >= required_permission):
                    return True
                else:
                    raise PermissionError
            else:
                raise TimeoutError
        except (jwt.ExpiredSignature, TimeoutError) as e:
            #Terminal.status(e)
            self.clean_sessions()
            return False
        except PermissionError as e:
            #Terminal.status(e)
            try:
                token = jwt.decode(request.get_json()['token'], self.server_key, algorithms='HS256')
                self.sessions.pop(token['session_id'])
            except:
                pass
            return False
        except jwt.DecodeError as e:
            #Terminal.status(e)
            return False
            #return "Internal Server Error", 500



    def create_token(self, username):
        key = crypt.mksalt(crypt.METHOD_SHA256)
        if(self.sessions.get(key) != None):
            key = crypt.mksalt(crypt.METHOD_SHA256)
        self.sessions[key] = datetime.datetime.utcnow()
        token =  jwt.encode({
                    'session_id': key,
                    'username': username,
                    'exp': datetime.datetime.utcnow() + datetime.timedelta(seconds=int(CONFIG["BACKEND"]["TOKEN_TIMEOUT"]))
                },
                self.server_key,
                algorithm='HS256'
                ).decode('utf-8')
        return token

############################################################
### Public functions
############################################################

    def search(self, search_term, city=""):
        try:
            return_data = []
            valid = True
            if len(search_term) == 0:
                valid = False

            if not valid and city == "":
                return return_data

            # Get main categories of search term.
            main_cats = self.api_syn.get_main_categories(search_term.lower())

            # City and activity
            if city != "" and valid:
                for cat in main_cats:
                    return_data += self.api_data.search_by_city_and_type(city, cat)
            # Just activity
            elif city == "" and valid:
                # Search by main categories
                for cat in main_cats:
                    return_data += self.api_data.search_by_type(cat)
            # Just city
            elif city != "" and not valid:
                return_data += self.api_data.search_by_city(city)

            if len(return_data) == 0:
                # Log uncategorized search in database.
                self.api_search_log.add_search(search_term)

            # Sorts by starting time
            # Can handle NoneType
            return_data.sort(key=lambda x: (x["startTime"] is None, x["startTime"]))
            return_data = return_data[:int(CONFIG["BACKEND"]["SEARCH_RESULT_COUNT"])]
            return return_data

        except Exception as e:
            print(e)


    def get_workout_from_id(self, workout_id):
        res = self.api_data.get_workout_from_id(workout_id)
        if res == {}:
            res = self.api_data.get_workout_from_id(workout_id)
        return res



    def get_synonyms(self): # Get synonym dict
        return self.api_syn.get_synonyms()



    def get_suggestions(self): # Generates a list of words to be used as search suggestions
        suggestions = set()
        # Gets all names, cities, and descriptions from all workouts.
        cats = self.api_syn.get_synonyms()
        to_ret = []
        for k,v in cats.items():
            to_ret.append(k)
            to_ret += v
        to_ret = { "label" : to_ret}
        return to_ret



    def get_cities(self):     # Generates a list of cities to be used as search suggestions
        suggestions = set()
        workouts = self.api_data.get_all_workouts()
        for workout in workouts:
            suggestions.add(workout["site"]["city"])
        ret = { "label" : list(suggestions)}
        return ret


  # Validate password, and return session token
    def login(self, username, password):
        to_ret = {}
        db_user = self.api_user.validate_user(username, password)
        if (db_user == False):
            to_ret['success'] = False
            Terminal.warning("User " + username + " failed to login!")
            to_ret["error"] = "Invalid username or password"
        else:
            #Creating Session Token
            to_ret['token'] = self.create_token(username)
            to_ret['permission'] = db_user[1] #should be encrypted in token
            to_ret['success'] = True
            to_ret['username'] = username
            Terminal.affirmative("User " + username + " successfully logged in!")
        return to_ret



############################################################
### ACCES RESTRICTED FUNCTIONS
############################################################
    def logout(self, token):
        token = jwt.decode(token, self.server_key, algorithms='HS256')
        self.sessions.pop(token['session_id'])
        return { "success": True }



    def add_endpoint(self, owner, url):
        return {"success": self.api_data.add_endpoint(url, owner)}



    def add_activity(self, owner, activity):
        try:
            obj = json.loads(activity)

            r = self.api_data.add_workout(obj, owner)
            if r == False:
                return {"success":False}

            # Adds synonym to activity if it doesn't exist
            syns = self.api_syn.get_main_categories(obj["type"])
            if(obj["type"] not in syns):
                self.api_syn.add_category(obj["type"])

            return {"success":True}
        except Exception as e:
            #print("in add activity"+ str(e))
            return {"success":False}


    def get_searches(self): # Gets all uncategorized searches
        return self.api_search_log.get_all()


    def remove_search(self, term): # Removes an uncategorized search
        return {"success": self.api_search_log.remove_one(term) }


    def add_category(self, cat): # Adds empty synonym category
        return {"success": self.api_syn.add_category(cat) }


    def add_to_category(self, cat, term): # Adds synonym to existing category
        return{"success":  self.api_syn.add_synonym(cat, term) }


    def remove_from_category(self, cat, term):
        return {"success": self.api_syn.delete_synonym(cat, term) }


    def remove_category(self, cat):
        return {"success": self.api_syn.delete_category(cat) }


    def nuke_and_replace_synonyms(self, syns):
        return {"success": self.api_syn.nuke_and_replace(syns) }


    def add_admin(self, username, password):
            return self.create_user(username, password, int(CONFIG["BACKEND"]["UP_ADMIN"]))



if __name__ == "__main__":
    print("This is not what you are looking for, run this from middleware please!")
