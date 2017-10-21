"use strict";

const userHelper    = require("../lib/util/user-helper")

const express       = require('express');
const tweetsRoutes  = express.Router();

module.exports = function(DataHelpers) {

  tweetsRoutes.get("/", function(req, res) {
    DataHelpers.getTweets((err, tweets) => {
      if (err) {
        res.status(500).json({ error: err.message });
      } else {

        const response = {
          tweets: tweets,
          session: req.session
        };
        console.log(req.session.user_id);
        res.json(response);
      }
    });
  });

  tweetsRoutes.post("/", function(req, res) {
    if (!req.body.text) {
      res.status(400).json({ error: "invalid request: no data in POST body"});
      return;
    }
    const userHelp = userHelper.generateRandomUser();

    DataHelpers.getUserDataForTweet(req.session.user_id, function(err, results) {
      
      const userData = results;

      console.log("userData: ", userData);

      const userObj = {
        name: userData.name,
        avatars: userHelp.avatars,
        handle: "@" + userData.handle
      };

      const tweetData = {
        "user": userObj,
        content: {
          text: req.body.text
        },
        created_at: Date.now(),
        likes: 0
      };

      console.log("tweetData.user:", tweetData.user);

      DataHelpers.saveTweet(tweetData, (err) => {
        if (err) {
          res.status(500).json({ error: err.message });
        } else {
          res.status(201).send();
        }
      });

    });

  });

  tweetsRoutes.post("/like/:id", function(req, res) {
    console.log("Like post route entered for id: ", req.params.id);
    DataHelpers.likeTweet(req.params.id, function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
      } else {
        res.status(201).send();
        console.log("likeTweet succesful.");
      }
    });
  });


  return tweetsRoutes;
}
