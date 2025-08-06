// index.js
// where your node app starts

// init project
var express = require('express');
var app = express();

// enable CORS (https://en.wikipedia.org/wiki/Cross-origin_resource_sharing)
// so that your API is remotely testable by FCC 
var cors = require('cors');
app.use(cors({optionsSuccessStatus: 200}));  // some legacy browsers choke on 204

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (req, res) {
  res.sendFile(__dirname + '/views/index.html');
});


// your first API endpoint... 
app.get("/api/hello", function (req, res) {
  res.json({greeting: 'hello API'});
});

app.get("/api/:date?", (req, res) => {
  let { date } = req.params;

  let parsedDate;

  // If no date is provided, use current date
  if (!date) {
    parsedDate = new Date();
  } else {
    // If date is a number (unix in ms or seconds?)
    if (!isNaN(date)) {
      if (date.length === 13) {
        parsedDate = new Date(Number(date)); // milliseconds
      } else {
        parsedDate = new Date(Number(date) * 1000); // seconds
      }
    } else {
      // Otherwise, try to parse date string
      parsedDate = new Date(date);
    }
  }

  // Check if date is valid
  if (parsedDate.toString() === "Invalid Date") {
    return res.json({ error: "Invalid Date" });
  }

  res.json({
    unix: parsedDate.getTime(),
    utc: parsedDate.toUTCString(),
  });
});

// Listen on port set in environment variable or default to 3000
var listener = app.listen(process.env.PORT || 3000, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
