const express = require('express');
const os = require('os');
const app = express();
const port = 3000;

// Middleware to log requests
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Serve home HTML page
app.get('/', (req, res) => {
  res.send(`
    <html>
      <head>
        <title>Node.js App</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            background-color: #f2f2f2;
            text-align: center;
            margin-top: 50px;
          }
          h1 {
            color: #333;
          }
          p {
            font-size: 1.2em;
          }
        </style>
      </head>
      <body>
        <h1>Welcome to My Node.js App!</h1>
        <p>Running inside a Docker container 🚀</p>
        <p>Server Hostname: <strong>${os.hostname()}</strong></p>
        <p>Current Time: ${new Date().toLocaleString()}</p>
        <p>Visit <a href="/api/status">/api/status</a> for JSON output.</p>
      </body>
    </html>
  `);
});

// Simple API route
app.get('/api/status', (req, res) => {
  res.json({
    status: 'ok',
    uptime: process.uptime(),
    hostname: os.hostname(),
    time: new Date()
  });
});

app.listen(port, () => {
  console.log(`App is running at http://localhost:${port}`);
});
