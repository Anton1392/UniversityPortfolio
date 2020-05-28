const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors());
app.options("*", cors());

var path = require("path");

// Create mongo db
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/mydb"
var ObjectID = require('mongodb').ObjectID;

// Need to start Mongod before you're able to connect
MongoClient.connect(url, function(err, db){
	if(err) throw err;

	console.log("Database [mydb] created.")

	// Global variable, come at me
	dbo = db.db("mydb");
	dbo.createCollection("messages", function(err, res){
		if(err) throw err;
		console.log("Message collection created.")
	});
});

app.get('/', function(req, res)	{
	res.sendFile(__dirname + "/index.html")
	});

app.get('/script.js', function(req, res)	{
	res.sendFile(__dirname + "/script.js")
	});

app.get('/style.css', function(req, res)	{
	res.sendFile(__dirname + "/style.css")
	});


app.get('/save', function(req, res)	{
	var _message = req.query.msg;
	if(_message == null)
	{
		res.status(400).send("Bad parameters.");
	}
	else
	{
		var msgObj = {message: _message, flag : false};

		// Insert the message object into the messages collection
		dbo.collection("messages").insertOne(msgObj, function(err, res){
			if(err){res.status(500).send("Unknown error.");}
			console.log("Inserted message.");
		});

		res.status(200).send("OK, saving message " + _message);
	}
});

app.get('/flag', function(req, res)	{
	var id = req.query.id;
	console.log("ID IS: " + id)
	if(id == null)
	{
		res.status(400).send("Bad parameters.");
	}
	else
	{
		// Finds the object by it's ID, updates the field to true.
		try{ id = ObjectID(id); }
		catch(err){ res.status(400).send("Bad parameters, invalid ID."); }

		dbo.collection("messages").updateOne(
			{"_id" : ObjectID(id)},
			{$set: {"flag" : true}},
			function(err, res)
			{
				if(err){res.status(500).send("Unknown error.");}
			}
		);

		res.status(200).send("OK, flagging message");
	}
});

app.get('/getall', function(req, res)	{
	// Finds all messages, formats into array, sends it in return.
	dbo.collection("messages").find({}).toArray(function(err, result){
		if(err){res.status(500).send("Unknown error.");}

		res.send(result);
	});
});

// 405 handler if method is wrong
app.all('/save', function(req, res)	{
	res.status(405).send("Wrong method.");
});
app.all('/flag', function(req, res)	{
	res.status(405).send("Wrong method.");
});
app.all('/getall', function(req, res)	{
	res.status(405).send("Wrong method.");
});

// 404 handler if no other subpages matched
app.use(function(req, res, next)	{
	res.status(404).send("404, no matching page found.");
});

module.exports = app;

// Start server
app.listen(3000, function()
	{
		console.log('Example app listening on port 3000!');
	});
