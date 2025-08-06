require('dotenv').config();
const express = require('express');
const cors = require("cors");
const dns = require("dns");
const urlParser = require("url");
const app = express();

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.urlencoded({ extended: false }));

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

let urls = []; // in-memory "database"

// POST endpoint
app.post("/api/shorturl", (req, res) => {
  const originalUrl = req.body.url;

  // Validate URL format
  const urlObj = urlParser.parse(originalUrl);

  if (!/^https?:\/\//i.test(originalUrl) || !urlObj.hostname) {
    return res.json({ error: "invalid url" });
  }

  // DNS lookup to verify host
  dns.lookup(urlObj.hostname, (err) => {

    if (err) {
      return res.json({ error: "invalid url" });
    } else {
      const shortUrl = urls.length + 1;

      urls.push({ original_url: originalUrl, short_url: shortUrl });
      res.json({ original_url: originalUrl, short_url: shortUrl });
    }
  });
});

// Redirect endpoint
app.get("/api/shorturl/:short_url", (req, res) => {

  const shortUrl = parseInt(req.params.short_url);
  const found = urls.find((u) => u.short_url === shortUrl);
  
  if (found) {
    res.redirect(found.original_url);
  } else {
    res.status(404).json({ error: "No short URL found for given input" });
  }
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
