const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);
const express = require("express");
const morgan = require("morgan");
const mongoose = require("mongoose");

const genres = require("./routes/genres");
const customers = require("./routes/customer");
const movies = require("./routes/movies");
const users = require("./routes/users");
const auth = require("./routes/auth");

const app = express();

require("dotenv").config();


mongoose
  .connect("mongodb://localhost/vidly")
  .then(() => console.log("connected to mongo db successfully"))
  .catch(() => console.log("cannot connect to mongo"));

app.set("view engine", "pug");
app.set("views", "./views");

app.use(express.json());
//To get the url encoded data
// app.use(express.urlencoded({ extended: true }));
//To host the static content present in our application
// app.use(express.static("public"));
// app.use(helmet());
//log the http request
//only enable morgan in the development environment
app.use(morgan("tiny"));
// app.use(logger);
//For ever route that starts with /api/courses use the courses router
app.use("/api/genres", genres);
app.use("/api/customer", customers);
app.use("/api/movies", movies);
app.use("/api/users", users);
app.use("/api/auth", auth);

const port = process.env.PORT || 3005;
app.listen(port, () => console.log(`listeining to port ${port}!!`));
