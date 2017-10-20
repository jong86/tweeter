"use strict";

const userHelper    = require("../lib/util/user-helper")

const express       = require('express');
const bcrypt        = require("bcrypt");
const cookieSession = require("cookie-session");

const usersRoutes   = express.Router();

module.exports = function(DataHelpers) {
  usersRoutes.use(cookieSession({ // For encrypted cookies
    name: 'session',
    // Define these keys with .env file:
    keys: [process.env.COOKIE_KEY1, process.env.COOKIE_KEY2, process.env.COOKIE_KEY3],
    // Cookie Options:
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }))


  usersRoutes.post("/login", function(req, res) {
    console.log("Login route entered for: ", req.body.email);
    const email = req.body.email;
    const password = req.body.password;
    DataHelpers.loginUser(email, password, function(err, results) {
      if (err) {
        res.status(500).json({ error: err.message });
      } else {
        console.log("Login response received.");
        console.log(results);
        if (results && results.email === req.body.email && bcrypt.compareSync(password, results.password)) {
          req.session.user_id = results._id;
          console.log("Login attempt successful for user " + results._id);
          console.log("Cookies: " + req.session.user_id);
          res.status(201).send();
          return;
        } else {
          console.log("Login attempt failed.");
        }
      }
    });
  });

  usersRoutes.post("/logout", function(req, res) {
    if (req.session.user_id) {
      req.session.user_id = null;
    }
    console.log("Logged out: " + req.session.user_id);
  });


  
  usersRoutes.post("/register", function(req, res) {
    console.log("Register route entered.");
    const userObj = {
      // name: req.body.name,
      email: req.body.email,
      // handle: req.body.handle,
      password: bcrypt.hashSync(req.body.password, 10)
    };
    DataHelpers.registrationRequest(userObj.email, function(err, results) {
      if (err) {
        res.status(500).json({ error: err.message });
      } else {
        res.status(201).send();
        console.log("Registration response received.");
        console.log(results);
        if (results === null) {
          DataHelpers.registerUser(userObj, function(err, results) {
            if (err) {
              res.status(500).json({ error: err.message });
            } else {
              res.status(201).send();
              console.log("Registration successful.");
              console.log(results);
            }
          });
        } else {
          console.error("User already exists.")
        }
      }
    })

  });
  
  return usersRoutes;
}
