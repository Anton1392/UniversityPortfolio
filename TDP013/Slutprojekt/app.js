const express = require('express');
const app = express();

const cors = require('cors');
app.use(cors());
app.options("*", cors());

const server = require('http').createServer(app);
const io = require('socket.io')(server);

var path = require("path");

// Create mongo db
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/mydb"
var ObjectID = require('mongodb').ObjectID;

var connected = false;
// Need to start Mongod before you're able to connect
function connect(dbName, testDB)
{
	if(!connected)
	{
		connected = true;
		MongoClient.connect(url, function(err, db){
			if(err) throw err;

			// Global variable, come at me
			dbo = db.db(dbName);

			// Initialize collections
			dbo.createCollection("users", function(err, res){
				if(err) throw err;
			});

			if(testDB)
			{
				dbo.dropDatabase(function(err, res){
					if(err) throw err;
					console.log("DROPPED DATABASE")
					var usrObject1 = {_id : ObjectID("5bbb2bd80d9f3f2f0cc924cb"), username : "testUser", password : "hejsan", messages : [], friends : []};
					dbo.collection("users").insertOne(usrObject1, function(err){
						if(err) throw err;
						console.log("ADDED TEST USER #1");
					});

					var usrObject2 = {username : "Billiam", password : "123", messages : [], friends : []};
					dbo.collection("users").insertOne(usrObject2, function(err){
						if(err) throw err;
						console.log("ADDED TEST USER #2");
					});

					var usrObject3 = {username : "Banton", password : "123", messages : [], friends : []};
					dbo.collection("users").insertOne(usrObject3, function(err){
						if(err) throw err;
						console.log("ADDED TEST USER #3");
					});
				});
			}
		});
	}
}

// Connect and do not wipe
//connect("finalProjectDB", false);
connect("testDB", true);

// - - - - - - - - - - - - - - - HTML5 PAGES - - - - - - - - - - - - - - - - - -
app.use(express.static("public"));
app.use("/external", express.static("external"));



// - - - - - - - - - - - - - - - AJAX DATA- - - - - - - - - - - - - - - - - - -
// http://localhost:3000/register?username=Banton&password=hejsan
app.get('/register', function(req, res)	{
	var _username = req.query.username;
	var _password = req.query.password;
	if(_username == null || _password == null || _username == "" || _password == "")
	{
		res.status(400).send("Bad parameters.")
		return;
	}
	else
	{
		var usrObject = {username : _username, password : _password, messages : [], friends : []};

		dbo.collection("users").find({}).toArray(function(err, result){
			if(err){res.status(500).send("Unknown error."); return;}
			var users = result;
			var failed = false;
			// If the user exists already, fail.
			for(var i = 0; i < users.length; i++)
			{
				if(users[i].username == _username)
				{
					failed = true;
				}
			}
			if(failed)
			{
				res.status(406).send("Failed. Username " + _username + " already exists.");
			}
			else
			{
				dbo.collection("users").insertOne(usrObject, function(err){
					if(err){res.status(500).send("Unknown error."); return;}
					res.status(200).send("Successfully registered " + _username + " with password " + _password);
				});
			}
		});
	}
});

// http://localhost:3000/authenticate?username=Banton&password=hejsan
app.get('/authenticate', function(req, res){
	var _username = req.query.username;
	var _password = req.query.password;
	if(_username == null || _password == null || _username == "" || _password == "")
	{
		res.status(400).send("Bad parameters.")
		return;
	}
	else
	{
		dbo.collection("users").find({}).toArray(function(err, result){
			if(err){res.status(500).send("Unknown error."); return;}
			var users = result;
			var auth = false;
			var matchingID = null;
			for(var i = 0; i < users.length; i++)
			{
				if(users[i].username == _username && users[i].password == _password)
				{
					auth = true;
					matchingID = users[i]._id;
				}
			}
			// The users ID should be used for a browser cookie.
			// When the user has the cookie set, he can load his profile page using it.
			// When the user presses log out, clear the cookie.
			if(auth){res.status(200).send(matchingID);}
			else {res.status(406).send("Not authenticated");}
		});
	}
});

// http://localhost:3000/getUser?userID=5bb4b1de325b620dc485fd1b
// http://localhost:3000/getUser?username=Banton
app.get('/getUser', function(req, res){
	var userID = req.query.userID;
	var username = req.query.username;

	if(userID == null && username == null)
	{
		res.status(400).send("Bad parameters");
		return;
	}
	else if(username != "" && username != null)
	{
		// Find based on username
		dbo.collection("users").findOne(
			{"username" : username},
			function(err, result)
			{
				if(err){res.status(500).send("Unknown error."); return;}
				res.status(200).send(result);
			}
		);
	}
	else
	{
		try{ id = ObjectID(userID); }
		catch(err){ res.status(400).send("Bad parameters, invalid ID."); return; }

		dbo.collection("users").findOne(
			{"_id" : ObjectID(userID)},
			function(err, result)
			{
				if(err){res.status(500).send("Unknown error."); return;}
				res.status(200).send(result);
			}
		);
	}
});

// http://localhost:3000/getAllUsernames
app.get('/getAllUsernames', function(req, res){
	dbo.collection("users").find({}).toArray(function(err, result){
		if(err){res.status(500).send("Unknown error."); return;}
		var usernames = [];
		for(var i = 0; i < result.length; i++)
		{
			usernames.push(result[i].username);
		}
		res.send(usernames);
	});
});

/*
// IDEA (untested)
// http://localhost:3000/searchUsers?name=Bill
app.get('/searchUsers', function(req, res){
	var name = req.query.name;
	dbo.collection("users").find({ "username": { $regex: name } }).toArray(function(err, result){
		if(err){res.status(500).send("Unkown error."); return;}
		var usernames = [];
		for(var i = 0; i < result.length; i++)
		{
			usernames.push(result[i].username);
		}
		res.send(usernames);
	});
});
*/

// http://localhost:3000/addFriend?userID=5bb214bee3bb932ce8e09777&friendName=Billiam
app.get('/addFriend', async function(req, res){
	var userID = req.query.userID;
	var friendName = req.query.friendName;
	if(userID == null || friendName == null || userID == "" || friendName == "")
	{
		res.status(400).send("Bad parameters.");
		return;
	}
	else
	{
		try{ id = ObjectID(userID); }
		catch(err){ res.status(400).send("Bad parameters, invalid ID."); return; }

		var found = false
		var user = await dbo.collection("users").findOne({"_id" : ObjectID(userID)});
		friends = user["friends"];
		i = friends.indexOf(friendName);
		if(i != -1){
			found = true;
		}

		if (found){
			res.status(200).send("Friend already added.");
		}
		else {
			dbo.collection("users").updateOne(
				{"_id" : ObjectID(userID)},
				{$addToSet: {"friends" : friendName}},
				function(err, res)
				{
					if(err){res.status(500).send("Unknown error."); return;}
				}
			);
			res.status(200).send("Added friend: " + friendName);
		}
	}
});

// http://localhost:3000/getFriends?userID=5bb214bee3bb932ce8e09777
app.get('/getFriends', function(req, res){
	var userID = req.query.userID;
	if(userID == null)
	{
		res.status(400).send("Bad parameters.");
		return;
	}
	else
	{
		try{ id = ObjectID(userID); }
		catch(err){ res.status(400).send("Bad parameters, invalid ID."); return; }

		dbo.collection("users").findOne(
			{"_id" : ObjectID(userID)},
			function(err, result)
			{
				if(err){res.status(500).send("Unknown error."); return;}
				res.status(200).send(result.friends);
			}
		);
	}
});

// http://localhost:3000/addMessage?userID=5bb214bee3bb932ce8e09777&friendName=Billiam&msg=Usux
app.get('/addMessage', function(req, res){
	var userID = req.query.userID;
	var friendName = req.query.friendName;
	var _message = req.query.msg;
	if(userID == null || friendName == null || _message == null || userID == "" || friendName == "" || _message == "" || _message.length > 140)
	{
		res.status(400).send("Bad parameters.");
		return;
	}
	else
	{
		try{ id = ObjectID(userID); }
		catch(err){ res.status(400).send("Bad parameters, invalid ID."); return; }

		// The posted message
		var messageObject = {message : _message, user : ObjectID(userID)};

		dbo.collection("users").updateOne(
			{"username" : friendName},
			{$addToSet: {"messages" : messageObject}},
			function(err, res)
			{
				if(err){res.status(500).send("Unknown error."); return;}
			}
		);
		res.status(200).send("Added message: " + _message + " to " + friendName);
	}
});

// http://localhost:3000/addMessage?friendName=Billiam
/*
app.get('/privateChat', function(req, res){
	var friendName = req.query.friendName;

	if(friendName == null || friendName == "")
	{
		res.status(400).send("Bad parameters.");
		return;
	}
	else
	{
		// Find based on username
		dbo.collection("users").findOne(
			{"username" : friendName},
			function(err, result)
			{
				if(err){res.status(400).send("Database error"); return;}
				if(result){console.log(result); res.status(200).send(result);}
				else{res.status(404).send("No such user.");}
			}
		);
	}
});
*/

		// Debug thing to view a particular collection and it's data.
		// http://localhost:3000/get?collection=users
		app.get('/get', function(req, res)	{
			var _collection = req.query.collection;

			dbo.collection(_collection).find({}).toArray(function(err, result){
				if(err){res.status(500).send("Unknown error."); return;}
				res.send(result);
			});
		});

// 404 handler if no other subpages matched
app.use(function(req, res, next)	{
	res.status(404).send("404, no matching page found.");
});

// Chat functionality
clients = {};

io.use(async function(socket, next){
	var userID = socket.handshake.query.userID;
	var friendName = socket.handshake.query.friendName;

	//console.log("userID: ", userID);
	//console.log("friendName: ", friendName);

	// call next() with an Error if you need to reject the connection.
	if(userID == null || userID == "" || friendName == null || friendName == "")
	{
		console.log("Chat connection denied");
		return next(new Error('Authentication error'));
	}

	var sender = await dbo.collection("users").findOne({"_id" : ObjectID(userID)});
	var reciever = await dbo.collection("users").findOne({"username" : friendName});

	console.log("sender: ", sender._id);
	console.log("reciever: ", reciever._id);
	var sender_id = sender._id;
	var reciever_id = reciever._id;


	// return the result of next() to accept the connection.
	if (sender != null && reciever != null) {
		clients[sender_id + "->" + reciever_id] = socket;

		// messages
		socket.on('message:private:send', function(msg){
			target = clients[reciever_id + "->" + sender_id];
			if (target) {
				console.log("Private message sent: " + sender.username + " -> " + reciever.username);
				target.emit('message:private:recieve', msg);
			}else{
				console.log("Partner offline!");
			}
		});

		// login status
		socket.on('disconnect', function(){
			clients[sender_id + "->" + reciever_id] = null;
			target = clients[reciever_id + "->" + sender_id];
			if (target) {
				target.emit('status', "offline");
			}
		});

		var target = clients[reciever_id + "->" + sender_id];
		if (target) {
			socket.emit('status', "online");
			target.emit('status', "online");
		}


		console.log("Chat connection accepted: " + sender.username + " -> " + reciever.username);
		return next();
	}
	else {
		console.log("Chat connection denied");
		return next(new Error('Authentication error'));
	}
});

// Legacy chat.js stuff
io.sockets.on('connection', function(socket){
	// client connected
	console.log('+ a user connected')

	socket.on('disconnect', function(){
		console.log('- user disconnected')
		// client disconnected
	});
	socket.on('send message', function(data){
		// Send to all users
		io.sockets.emit('new message', data);
	});
});

module.exports = app;
module.exports.connect = connect;

// Start server
server.listen(3000, function(){
	console.log('Example app listening on port 3000!');
});


/*
// Sample code below
//GETALL
	dbo.collection("messages").find({}).toArray(function(err, result){
		if(err){res.status(500).send("Unknown error.");}

		res.send(result);
	});

// Save message
	var msgObj = {message: _message, flag : false};

// Insert the message object into the messages collection
	dbo.collection("messages").insertOne(msgObj, function(err, res){
		if(err){res.status(500).send("Unknown error.");}
		console.log("Inserted message.");
	});

// GET parameters
	var _message = req.query.msg;
	*/
