// MongoDB
const MongoClient = require('mongodb').MongoClient;
//exports.MongoClient = MongoClient;
const db_name = "unit_test"
exports.name = db_name;
const url = "mongodb://localhost:27017/" + db_name;
const ObjectID = require('mongodb').ObjectID;
exports.ObjectID = ObjectID;
MongoClient.connect(url, function(err, db){
    if(err) throw err;

    console.log("Database [" + db_name + "] created.")

    dbo = db.db(db_name); //global database object

    dbo.createCollection("messages", function(err, res){
        if(err) throw err;
        console.log("Message collection created.")
    });
});

//TODO: export dbo (err: undefined)
