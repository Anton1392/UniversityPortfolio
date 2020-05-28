const request = require("supertest");
const assert = require("assert");

const app = require("../app");

// Tests
describe("Code coverage and unit tests", function() {
    it("Should return home page", function(){
        request(app).get("/").expect(200).end(function(err, res){
        if(err) throw err;
        });
    });

    it("Should save a message", function(){
        request(app).get("/save").query({ msg: 'TestMessage' })
        .expect(200).end(function(err, res){
        if(err) throw err;
        });
    });

    // for setting flag

    it("Should get all messages in JSON form", function(){
        request(app).get("/getall")
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res){
            if(err) throw err;
        });
    });

    it("Should flag a message", function(){
        request(app).get("/flag").query({ id: "5ba2328e1804c615df737e30" })
        .expect(200).end(function(err, res){
            if(err) throw err;
        });
    });

    it("Should mess up save, bad parameters", function(){
        request(app).get("/save")
        .expect(400).end(function(err, res){
        if(err) throw err;
        });
    });

    it("Should mess up flag, bad parameters", function(){
        request(app).get("/flag")
        .expect(400).end(function(err, res){
        if(err) throw err;
        });
    });

    it("404 test", function(){
        request(app).get("/thisdoesntexist")
        .expect(404).end(function(err, res){
        if(err) throw err;
        });
    });

    it("405 test, wrong method", function(){
        request(app).post("/save")
        .expect(405).end(function(err, res){
        if(err) throw err;
        });
    });
    it("405 test, wrong method", function(){
        request(app).post("/flag")
        .expect(405).end(function(err, res){
        if(err) throw err;
        });
    });
    it("405 test, wrong method", function(){
        request(app).post("/getall")
        .expect(405).end(function(err, res){
        if(err) throw err;
        });
    });
});
