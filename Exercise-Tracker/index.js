<<<<<<< HEAD
var express = require('express');
var cors = require('cors');
require('dotenv').config()
const multer = require("multer");
const path = require("path");

var app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use('/public', express.static(process.cwd() + '/public'));

const storage = multer.diskStorage({

  destination: function (req, file, cb) {

    cb(null, path.join(__dirname, "./public/images"));
  },
  filename: function (req, file, cb) {

    cb(null, file.originalname)
  }
})

const upload = multer({ storage: storage })

app.get('/', function (req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

app.post("/api/fileanalyse", upload.single("upfile"), (req, res) => {

  const file = req.file;

  console.log(file);

  res.json({

    "name": file.originalname,
    "type": file.mimetype,
    "size": file.size
  })
})


const port = process.env.PORT || 3000;
app.listen(port, function () {
  console.log('Your app is listening on port ' + port)
=======
const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

let users = [];
let exercises = [];
let userId = 1;

// ⨳ Home Page
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/views/index.html");
});

// ⨳ POST /api/users (Create new user)
app.post("/api/users", (req, res) => {
  const username = req.body.username;

  const user = {
    username,
    _id: userId.toString(),
  };

  users.push(user);
  userId++;

  res.json(user);
});

// ⨳ GET /api/users (Get all users)
app.get("/api/users", (req, res) => {
  res.json(users);
});

// ⨳ POST /api/users/:_id/exercises (Add exercise)
app.post("/api/users/:_id/exercises", (req, res) => {
  const { description, duration, date } = req.body;
  const user = users.find(u => u._id === req.params._id);

  if (!user) return res.status(400).json({ error: "User not found" });

  const exercise = {
    _id: user._id,
    username: user.username,
    description,
    duration: parseInt(duration),
    date: date ? new Date(date).toDateString() : new Date().toDateString()
  };

  exercises.push(exercise);

  res.json(exercise);
});

// ⨳ GET /api/users/:_id/logs (Get user's log)
app.get("/api/users/:_id/logs", (req, res) => {
  const user = users.find(u => u._id === req.params._id);
  if (!user) return res.status(400).json({ error: "User not found" });

  let log = exercises.filter(ex => ex._id === user._id);

  const { from, to, limit } = req.query;

  if (from) {
    const fromDate = new Date(from);
    log = log.filter(ex => new Date(ex.date) >= fromDate);
  }

  if (to) {
    const toDate = new Date(to);
    log = log.filter(ex => new Date(ex.date) <= toDate);
  }

  if (limit) {
    log = log.slice(0, parseInt(limit));
  }

  res.json({
    username: user.username,
    _id: user._id,
    count: log.length,
    log: log.map(({ description, duration, date }) => ({
      description,
      duration,
      date
    }))
  });
});

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log("Your app is listening on port " + listener.address().port);
>>>>>>> exercisetracker/main
});