"use strict";

const mongo = require("mongodb");

module.exports = function makeDataHelpers(db) {
  return {

    //-----------------------------------------
    // Data helpers for getting/posting tweets:
    //

    saveTweet: function(newTweet, callback) {
      db.collection("tweets").insertOne(newTweet, callback);
    },

    getTweets: function(callback) {
      db.collection("tweets").find().toArray(callback);
    },

    getUserDataForTweet: function(id, callback) {
      db.collection("users").findOne(
        { "_id": mongo.ObjectId(id) },
        { name: 1, handle: 1 },
        callback
    );
    },



    //--------------------------------
    // Data helpers for liking tweets:
    //

    likeTweetCheckArray: function(tweet_id, callback) {
      db.collection("tweets").findOne(
        { _id: mongo.ObjectId(tweet_id) },
        { liked_by: 1 },
        callback
      );
    },

    likeTweet: function(tweet_id, user_id, callback) {
      db.collection("tweets").updateOne(
        { _id: mongo.ObjectId(tweet_id) },
        { $push: { liked_by: user_id } },
        callback
      );
    },

    unlikeTweet: function(tweet_id, user_id, callback) {
      db.collection("tweets").updateOne(
        { _id: mongo.ObjectId(tweet_id) },
        { $pull: { liked_by: user_id } },
        callback
      );
    },



    //--------------------------------------
    // Data helpers for user login/register:
    //

    loginUser: function(email, password, callback) {
      db.collection("users").findOne(
        { "email": email },
        { email: 1, password: 1, _id: 1 },
        callback
      );
    },

    registrationRequest: function(email, callback) {
      db.collection("users").findOne(
        { "email": email },
        { _id: 1 },
        callback
      );
    },

    registerUser: function(userObj, callback) {
      db.collection("users").insertOne(userObj, callback);
    }

  }
}
