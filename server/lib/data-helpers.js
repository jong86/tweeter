"use strict";

const mongo = require("mongodb");

// Simulates the kind of delay we see with network or filesystem operations
// const simulateDelay = require("./util/simulate-delay");

// Defines helper functions for saving and getting tweets, using the database `db`
module.exports = function makeDataHelpers(db) {
  return {

    // Saves a tweet to `db`
    saveTweet: function(newTweet, callback) {
      db.collection("tweets").insertOne(newTweet, callback);
    },

    // Get all tweets in `db`, sorted by newest first
    getTweets: function(callback) {
      db.collection("tweets").find().toArray(callback);
    },

    likeTweet: function(id, callback) {
      console.log("likeTweet method called.");
      db.collection("tweets").findAndModify({ _id: mongo.ObjectId(id) }, [], { $inc: { likes: 1 }}, {}, callback);
    },

    loginUser: function(email, password, callback) {
      console.log("loginUser called for", email, password);
      db.collection("users").findOne({ "email": email }, { email: 1, password: 1, _id: 1 }, callback);
    },
    
    registrationRequest: function(email, callback) {
      console.log("registerUser called for", email);
      db.collection("users").findOne({ "email": email }, { _id: 1 }, callback);
    },
    
    registerUser: function(userObj, callback) {
      console.log("Attempting to register new user:", userObj);
      db.collection("users").insertOne(userObj, callback);
    },

    getUserDataForTweet: function(id, callback) {
      console.log("getUserDataForTweet called for", id);
      db.collection("users").findOne({ "_id": mongo.ObjectId(id) }, { name: 1, handle: 1 }, callback);
    }
    
  }
}
