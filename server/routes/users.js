"use strict";



const userHelper    = require("../lib/util/user-helper")

const express       = require('express');
const bcrypt        = require("bcrypt");


const usersRoutes   = express.Router();

module.exports = function(DataHelpers) {



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
          console.log("Logged in. req.session.user_id = " + req.session.user_id);
          res.status(201).send(req.session.user_id);
          return;
        } else {
          console.log("Login attempt failed.");
        }

      }
    });
  });

  usersRoutes.post("/logout", function(req, res) {
    if (req.session) {
      req.session = null;
    }
    console.log("Logged out, req.session.user_id = " + req.session.user_id);
  });


  
  usersRoutes.post("/register", function(req, res) {
    console.log("Register route entered.");
    const userObj = {
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password, 10),
      name: req.body.name,
      handle: req.body.handle
    };
    DataHelpers.registrationRequest(userObj.email, function(err, results) {
      if (err) {
        res.status(500).json({ error: err.message });
      } else {
        res.status(201).send();
        console.log("Registration response received.");
        if (results === null) {
          DataHelpers.registerUser(userObj, function(err, results) {
            if (err) {
              res.status(500).json({ error: err.message });
            } else {
              res.status(201).send();
              console.log("Registration successful.");
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