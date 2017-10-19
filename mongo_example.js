"use strict";

const MongoClient = require("mongodb").MongoClient;
const MONGODB_URI = "mongodb://localhost:27017/tweeter";

MongoClient.connect(MONGODB_URI, (err, db) => {
  if (err) {
    console.error(`Failed to connect: ${MONGODB_URI}`);
    process.exit(1);
  }

  console.log(`Connected to mongodb: ${MONGODB_URI}`);


  // Refactored and wrapped as new, tweet-specific function:
  function getTweets(callback) {
    db.collection("tweets").find().toArray((err, tweets) => {
      
      if (err) {
        console.error(err);
        process.exit(2);
      }
      callback(null, tweets);
    });
    
  }

  // Later it can be invoked, Remember even if you pass
  // getTweets to another scope, it still has closure over
  // db, so it will still work, YAY!

  getTweets((err, tweets) => {
    if (err) {
      console.error(err);
      process.exit(2);
    }
    console.log("Logging each tweet:");

    for (let tweet of tweets) {
      console.log(tweet);
    }

    db.close();

  });

});