const request = require("supertest");
const assert = require("assert");

const app = require("../app");

function sleep(ms)
{
	return new Promise(resolve => setTimeout(resolve, ms));
}

// Tests
describe("Code coverage and unit tests", function() {
	before(async function(){
		// Perfect solution, absolutely up to par, no issues, impeccable coding. It fixes the "dbo is not defined" error.
		this.timeout(11000);
		app.connect("testDB", true); // Connect and wipe testDB
		await sleep(10000); // Wait for dbo to initialize properly
	});

	it("/: return home page", function(done){
		request(app).get("/").expect(200).end(function(err, res){
			if(err) return done(err);
			done();
		});
	});

	it("register: success", function(done){
		var d = new Date(); // Pseudo random username, prevents wierd async collision
		request(app).get("/register").query({username: d, password : "hejsan"})
			.expect(200)
			.end(function(err, res){
				if(err) throw done(err);
				done();
			});
	});

	it("register: bad parameters", function(done){
		request(app).get("/register").query({username: "", password : "hejsan"}).expect(400).end(function(err, res){
			if(err) return done(err);
			done();
		});
	});

	it("register: user exists", function(done){
		request(app).get("/register").query({username: "testUser", password : "hejsan"}).expect(406).end(function(err, res){
			if(err) return done(err);
			done();
		});
	});

	it("authenticate: success", function(done){
		request(app).get("/authenticate").query({username: "testUser", password : "hejsan"}).expect(200).end(function(err, res){
			if(err) return done(err);
			done();
		});
	});

	it("authenticate: bad parameters", function(done){
		request(app).get("/authenticate").query({username: "", password : "hejsan"}).expect(400).end(function(err, res){
			if(err) return done(err);
			done();
		});
	});

	it("authenticate: not authenticated", function(done){
		request(app).get("/authenticate").query({username: "Ooga", password : "tjena"}).expect(406).end(function(err, res){
			if(err) return done(err);
			done();
		});
	});

	it("getUser: by username", function(done){
		request(app).get("/getUser").query({username: "testUser"}).expect(200).end(function(err, res){
			if(err) return done(err);
			done();
		});
	});

	it("getUser: by ID", function(done){
		request(app).get("/getUser").query({userID: "5bbb2bd80d9f3f2f0cc924cb"}).expect(200).end(function(err, res){
			if(err) return done(err);
			done();
		});
	});

	it("getUser: bad parameters", function(done){
		request(app).get("/getUser").query({username: null, userID: null}).expect(400).end(function(err, res){
			if(err) return done(err);
			done();
		});
	});

	it("getUser: bad id", function(done){
		request(app).get("/getUser").query({userID: "INTE ETT ID"}).expect(400).end(function(err, res){
			if(err) return done(err);
			done();
		});
	});

	it("getAllUsernames: success", function(done){
		request(app).get("/getAllUsernames").expect(200).end(function(err, res){
			if(err) return done(err);
			done();
		});
	});

	it("addFriend: success", function(done){
		request(app).get("/addFriend").query({userID: "5bbb2bd80d9f3f2f0cc924cb", friendName : "Banton"}).expect(200).end(function(err, res){
			if(err) return done(err);
			done();
		});
	});

	it("addFriend: bad parameters", function(done){
		request(app).get("/addFriend").query({userID: "5bbb2bd80d9f3f2f0cc924cb", friendName : ""}).expect(400).end(function(err, res){
			if(err) return done(err);
			done();
		});
	});

	it("addFriend: invalid id", function(done){
		request(app).get("/addFriend").query({userID: "INTE ETT ID", friendName : "Banton"}).expect(400).end(function(err, res){
			if(err) return done(err);
			done();
		});
	});

	it("getFriends: success", function(done){
		request(app).get("/getFriends").query({userID: "5bbb2bd80d9f3f2f0cc924cb"}).expect(200).end(function(err, res){
			if(err) return done(err);
			done();
		});
	});

	it("getFriends: null userID", function(done){
		request(app).get("/getFriends").query({userID: null}).expect(400).end(function(err, res){
			if(err) return done(err);
			done();
		});
	});

	it("getFriends: bad userID", function(done){
		request(app).get("/getFriends").query({userID: "OOGA BOOGA"}).expect(400).end(function(err, res){
			if(err) return done(err);
			done();
		});
	});

	it("addMessage: success", function(done){
		request(app).get("/addMessage").query({userID: "5bbb2bd80d9f3f2f0cc924cb", friendName: "testUser", msg: "U SUX"}).expect(200).end(function(err, res){
			if(err) return done(err);
			done();
		});
	});

	it("addMessage: bad parameters", function(done){
		request(app).get("/addMessage").query({userID: "5bbb2bd80d9f3f2f0cc924cb", friendName: "", msg: "U SUX"}).expect(400).end(function(err, res){
			if(err) return done(err);
			done();
		});
	});

	it("addMessage: bad ID", function(done){
		request(app).get("/addMessage").query({userID: "INVALID", friendName: "testUser", msg: "U SUX"}).expect(400).end(function(err, res){
			if(err) return done(err);
			done();
		});
	});

	it("privateChat: success", function(done){
		request(app).get("/privateChat.html?friendName=testUser").query({userID: "5bbb2bd80d9f3f2f0cc924cb"}).expect(200).end(function(err, res){
			if(err) return done(err);
			console.log(res);
			done();
		});
	});

	it("privateChat: invalid user", function(done){
		request(app).get("/privateChat.html?friendName=nonExistingUser1337").query({userID: "5bbb2bd80d9f3f2f0cc924cb"}).expect(200).end(function(err, res){
			if(err) return done(err);
			console.log(res);
			done();
		});
	});

	it("privateChat: no user", function(done){
		request(app).get("/privateChat.html").query({userID: "5bbb2bd80d9f3f2f0cc924cb"}).expect(200).end(function(err, res){
			if(err) return done(err);
			console.log(res);
			done();
		});
	});

	it("404 test", function(done){
		request(app).get("/thisdoesntexist")
			.expect(404).end(function(err, res){
				if(err) return done(err);
				done();
			});
	});
});
