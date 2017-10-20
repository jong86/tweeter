"use strict";

const userHelper    = require("../lib/util/user-helper")

const express       = require('express');
const usersRoutes  = express.Router();

module.exports = function(DataHelpers) {

  usersRoutes.post("/login", function(req, res) {

    console.log("Login route entered for: ", req.body.email);

    DataHelpers.loginUser(req.body.email, req.body.password, function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
      } else {
        res.status(201).send();
        console.log("Login succesful");
      }
    });
  });
  
  return usersRoutes;
}
