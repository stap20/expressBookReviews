const express = require("express");
const jwt = require("jsonwebtoken");
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
  //returns boolean
  return users.find((user) => user.username === username) === undefined;
};

const authenticatedUser = (username, password) => {
  //returns boolean
  return (
    users.find(
      (user) => user.username === username && user.password === password
    ) !== undefined
  );
};

//only registered users can login
regd_users.post("/login", (req, res) => {
  const user = req.body;
  if (user.username === undefined || user.password === undefined) {
    return res
      .status(400)
      .json({ message: "Username and Password are required for this request" });
  }

  if (!authenticatedUser(user.username, user.password)) {
    return res
      .status(401)
      .json({ message: "Username or Password are inccorect" });
  }

  let accessToken = jwt.sign(
    {
      data: user,
    },
    "access",
    { expiresIn: 60 * 60 }
  );

  req.session.authorization = {
    accessToken,
  };

  return res.send("User successfully logged in");
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const username = req.user.data.username;

  books[req.params.isbn].reviews[username] = req.query.review;

  return res.send("review added successffuly");
});

//Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const username = req.user.data.username;

  delete books[req.params.isbn].reviews[username];

  return res.send("review deleted successffuly");
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
