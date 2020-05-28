#! /usr/bin/env python3.7
from flask import Flask, request, jsonify
from server_code import *
from flask_cors import CORS
import config, logging
from terminal import Terminal
from flask_socketio import SocketIO

app = Flask(__name__)
CORS(app)
socketio = SocketIO(app, async_mode='threading')
logging.getLogger('werkzeug').setLevel(logging.ERROR)

print() # Im here just to look pretty!

app.config['SECRET_KEY'] = CONFIG["BACKEND"]["SECRET_KEY"]
app.debug = False # Should be False in production
app.use_reloader = False

serv = Server(socketio)

# All json usaege after calling validate_access is garanteed to work
def validate_access(request, level):
    try:
        body = request.get_json()
        if body["token"] == None:
            return False
        else:
            if serv.validate(body["token"], level):
                return True
            else:
                return False
    except:
        return False


@app.route('/')
def default():
    return "This is not the thing you are looking for.", 418


@app.route("/search/", methods=(['get']))
def get_search():
    search_term = request.args.get("search")
    search_city = request.args.get("city")
    if search_term == None or search_city == None:
        return jsonify("Missing parameters"), 400
    else:
        return jsonify(serv.search(search_term, search_city))


@app.route("/getWorkout/", methods=(['get']))
def get_workout():
    id_ = request.args.get("id")
    if (id_ == None):
        return jsonify("Missing parameter"), 400
    else:
        return jsonify(serv.get_workout_from_id(id_)), 200


@app.route("/synonyms/", methods=(['get']))
def get_synonyms():
    return jsonify(serv.get_synonyms()), 200

@app.route("/getSuggestions/", methods=(['get']))
def get_suggestions():
    return jsonify(serv.get_suggestions())


@app.route("/getCities/", methods=(['get']))
def get_cities():
    return jsonify(serv.get_cities())


@app.route("/auth/", methods=(['POST']))
def post_auth():
    #print(request.args)
    #print(request.data)
    #print(request.form)
    try:
        username = request.get_json()['username']
        password = request.get_json()['password']
    except:
        return jsonify("Missing parameter"), 400
    if (username == None or username == "" or password == None or password ==  ""):
        return jsonify("Missing parameter"), 400
    else:
        return jsonify(serv.login(username, password))


###################################################
###   ACCES RESTRICTED FUNCS
###################################################
@app.route("/logout/", methods=(['POST']))
def logout():
    if not validate_access(request, int(CONFIG["BACKEND"]["UP_ADMIN"])):
        return jsonify("You shall not pass!"), 401
    else:
        return jsonify(serv.logout(request.get_json()["token"])), 200 #unpack json##############!!!!

@app.route("/validateUser/", methods=(['POST']))
def validate_user():
    if not validate_access(request, int(CONFIG["BACKEND"]["UP_ADMIN"])):
        return jsonify("You shall not pass!"), 401
    else:
        return jsonify({ "success": True }), 200


@app.route("/addEndpoint", methods=(['POST']))
def post_add_endpoint():
    if not validate_access(request, int(CONFIG["BACKEND"]["UP_ADMIN"])):
        return jsonify("You shall not pass!"), 401
    else:
        owner = request.get_json()['user']
        url = request.get_json()['url']
        if owner == None or owner == "" or url == None or url == "":
            return jsonify("Missing parameter"), 400
        else:
            return jsonify(serv.add_endpoint(owner, url)), 200


@app.route("/addActivity", methods=(['POST']))
def add_activity():
    if not validate_access(request, int(CONFIG["BACKEND"]["UP_ADMIN"])):
        return jsonify("You shall not pass!"), 401
    else:
        owner = request.get_json()['user']
        activity = request.get_json()['activity']
        if owner == None or owner == "" or activity == None:
            return jsonify("Missing parameter"), 400
        else:
            return jsonify(serv.add_activity(owner, activity)), 200

#Should this be acces blocked
@app.route("/getSearches", methods=(['GET']))
def get_searches():

    return jsonify(serv.get_searches())




# Needs fields "term"
@app.route("/removeSearch", methods=(['POST']))
def remove_search():
    if not validate_access(request, int(CONFIG["BACKEND"]["UP_SUPER_ADMIN"])):
        return jsonify("You shall not pass!"), 401
    else:
        term = request.get_json()["term"]
        if term == None or term == "":
            return jsonify("Missing parameter"), 400
        else:
            return jsonify(serv.remove_search(term))


# Needs fields "cat"
@app.route("/addCategory", methods=(['POST']))
def add_category():
    if not validate_access(request, int(CONFIG["BACKEND"]["UP_SUPER_ADMIN"])):
        return jsonify("You shall not pass!"), 401
    else:
        cat = request.get_json()['cat']
        if cat == None or cat == "":
            return jsonify("Missing parameter"), 400
        else:
            return jsonify(serv.add_category(cat))


# Needs fields "cat" and "term"
@app.route("/addToCategory", methods=(['POST']))
def add_to_category():
    if not validate_access(request, int(CONFIG["BACKEND"]["UP_SUPER_ADMIN"])):
        return jsonify("You shall not pass!"), 401
    else:
        cat = request.get_json()['cat']
        term = request.get_json()['term']
        if cat == None or cat == "" or term == None or term == "":
            return jsonify("Missing parameter"), 400
        else:
            return jsonify(serv.add_to_category(cat, term))


# Needs fields "cat" and "term"
@app.route("/removeFromCategory", methods=(['POST']))
def remove_from_category():
    if not validate_access(request, int(CONFIG["BACKEND"]["UP_SUPER_ADMIN"])):
        return jsonify("You shall not pass!"), 401
    else:
        cat = request.get_json()['cat']
        term = request.get_json()['term']
        if cat == None or cat == "" or term == None or term == "":
            return jsonify("Missing parameter"), 400
        else:
            return jsonify(serv.remove_from_category())


# Needs fields "cat"
@app.route("/removeCategory", methods=(['POST']))
def remove_category():
    if not validate_access(request, int(CONFIG["BACKEND"]["UP_SUPER_ADMIN"])):
        return jsonify("You shall not pass!"), 401
    else:
        cat = request.get_json()['cat']
        if cat == None or cat == "":
            return jsonify("Missing parameter"), 400
        else:
            return jsonify(serv.remove_category(cat))

# Needs fields "synonyms"
@app.route("/nukeReplaceSynonyms", methods=(['POST']))

def nuke_replace_synonyms():
    if not validate_access(request, int(CONFIG["BACKEND"]["UP_SUPER_ADMIN"])):
        return jsonify("You shall not pass!"), 401
    else:
        syns = request.get_json()['synonyms']
        if syns == None:
            return jsonify("Missing parameter"), 400
        else:
            return jsonify(serv.nuke_and_replace_synonyms(syns))


@app.route("/addAdmin", methods=(['POST']))
def add_admin():
    if not validate_access(request, int(CONFIG["BACKEND"]["UP_SUPER_ADMIN"])):
        return jsonify("You shall not pass!"), 401
    else:
        username = request.get_json()['username']
        password = request.get_json()['password']
        if username == None or username == "" or password == None or password == "":
            return jsonify("Missing parameter"), 400
        else:
            return jsonify(serv.add_admin(username, password)), 200


############################################################
### FLASK FUNKTIONS
############################################################
@app.after_request
def after_request(response):
    Terminal.status("GOOD: A "+ str(request) +" from " + request.remote_addr + " was successfully handled!") #requet should be unpaced
    return response


@app.errorhandler(Exception)
def exceptions(e):
    Terminal.error("BAAD: A "+ str(request) +" from " + request.remote_addr + " ended in error: " + str(e))
    return "Internal error, we suck", 500


@socketio.on('connect')
def test_connect(): # what is this used for ???
    Terminal.debug1("A new connection has been made from : " + request.remote_addr)
    pass

if __name__ == "__main__":
    serv.create_user("admin", "password", 1)
    serv.create_user("super_admin", "password", 2)
    socketio.run(app, host='127.0.0.1')
