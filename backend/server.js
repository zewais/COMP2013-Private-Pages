//Intialize Server
const express = require("express");
const User = require("./models/user");
const cors = require("cors");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const server = express();
const port = 3000;
require("dotenv").config();
const { DB_URI, SECRET_KEY } = process.env;

//Middleware
server.use(cors());
server.use(express.json());
server.use(express.urlencoded({ extended: true }));

//Connections
mongoose
  .connect(DB_URI)
  .then(() => {
    server.listen(port, () => {
      console.log(`Connected to DB\nServer is listening on port ${port}`);
    });
  })
  .catch((error) => console.log(error));

//Routes
server.get("/", (request, response) => {
  response.send("Server is live!");
});

//Register new user route
server.post("/register", async (request, response) => {
  const { username, password } = request.body;
  try {
    //Hashing a password need bcrypt and salt rounds as an int
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      username,
      password: hashedPassword,
    });
    await newUser.save();
    response.send({ message: "User Created!" });
  } catch (error) {
    response
      .status(500)
      .send({ message: "User Already Exists, please find another username" });
  }
});

//Login existing user route
server.post("/login", async (request, response) => {
  const { username, password } = request.body;

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return response.status(404).send({ message: "User does not exist" });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return response
        .status(403)
        .send({ message: "Incorrect username or password" });
    }

    const jwtToken = jwt.sign({ id: user._id, username }, SECRET_KEY);
    return response
      .status(201)
      .send({ message: "User Authenticated", token: jwtToken });
  } catch (error) {
    response.status(500).send({ message: error.message });
  }
});
