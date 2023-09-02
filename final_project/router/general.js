const express = require("express");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req, res) => {
  if (req.body.username === undefined || req.body.password === undefined) {
    return res
      .status(400)
      .json({ message: "Username and Password are required for this request" });
  }

  const username = req.body.username;
  const password = req.body.password;

  if (!isValid(username)) {
    return res.status(400).json({ message: "Username already exist" });
  }

  users.push({ username: username, password: password });

  return res.send("User successfully registered");
});

// Get the book list available in the shop
public_users.get("/", async function (req, res) {
  //Creating a promise method. The promise will get resolved when timer times out after 6 seconds.
  let myPromise = new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(books);
    }, 6000);
  });

  const result = await myPromise;

  res.send(result);
});

// Get book details based on ISBN
public_users.get("/isbn/:isbn", async function (req, res) {
  let myPromise = new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(books[req.params.isbn]);
    }, 6000);
  });

  const book = await myPromise;

  if (book) {
    res.send(book);
  } else {
    return res.status(404).json({ message: "Book Not Found" });
  }
});

// Get book details based on author
public_users.get("/author/:author", async function (req, res) {
  const filter_by_author = (author) => {
    for (key in books) {
      if (books[key].author === author) {
        return books[key];
      }
    }

    return undefined;
  };

  let myPromise = new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(filter_by_author(req.params.author));
    }, 6000);
  });

  const book = await myPromise;

  if (book) {
    res.send(book);
  } else {
    return res.status(404).json({ message: "Book Not Found" });
  }
});

// Get all books based on title
public_users.get("/title/:title", async function (req, res) {
  const filter_by_author = (title) => {
    for (key in books) {
      if (books[key].title === title) {
        return books[key];
      }
    }

    return undefined;
  };

  let myPromise = new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(filter_by_author(req.params.title));
    }, 6000);
  });

  const book = await myPromise;

  if (book) {
    res.send(book);
  } else {
    return res.status(404).json({ message: "Book Not Found" });
  }
});

//  Get book review
public_users.get("/review/:isbn", function (req, res) {
  const book = books[req.params.isbn];

  if (book) {
    res.send(book.reviews);
  } else {
    return res.status(404).json({ message: "Book Not Found" });
  }
});

module.exports.general = public_users;
