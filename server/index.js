require("dotenv").config();
"use strict";

// Basic express setup:

const PORT          = process.env.PORT || 8080;
const express       = require("express");
const bodyParser    = require("body-parser");
const cookieSession = require("cookie-session");
const bcrypt        = require("bcrypt");

const app           = express();

const MongoClient = require("mongodb").MongoClient;
const MONGODB_URI = process.env.MONGODB_URI;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.use(cookieSession({ // For encrypted cookies
  name: 'session',
  // Define these keys with .env file:
  keys: [process.env.COOKIE_KEY],
  // Cookie Options:
  maxAge: 24 * 60 * 60 * 1000 // 24 hours
}))

MongoClient.connect(MONGODB_URI, (err, db) => {

  if (err) {
    console.error(`Failed to connect: ${MONGODB_URI}`);
    process.exit(1);
  }

  const DataHelpers = require("./lib/data-helpers.js")(db);
  const tweetsRoutes = require("./routes/tweets")(DataHelpers);
  const usersRoutes = require("./routes/users")(DataHelpers);

  app.use("/tweets", tweetsRoutes);
  app.use("/users", usersRoutes);

  app.listen(PORT, () => {
    console.log("Server listening on port " + PORT);
  });

});


