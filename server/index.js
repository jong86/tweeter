"use strict";

// Basic express setup:

const PORT          = 8080;
const express       = require("express");
const bodyParser    = require("body-parser");
const cookieSession = require("cookie-session");
const bcrypt        = require("bcrypt");
const app           = express();

const MongoClient = require("mongodb").MongoClient;
const MONGODB_URI = "mongodb://localhost:27017/tweeter";

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));


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
    console.log("Example app listening on port " + PORT);
  });
  
});


