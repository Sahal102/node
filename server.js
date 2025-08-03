const express = require('express');
const os = require('os');
const path = require('path');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;
const APP_NAME = process.env.APP_NAME || 'Node App';

app.use(bodyParser.urlencoded({ extended: true }));
app.use('/static', express.static(path.join(__dirname, 'public')));

// Home
app.get('/', (req, res) => {
  res.send(`
    <h1>${APP_NAME}</h1>
    <p>Welcome to Dockerized Node.js app!</p>
    <a href="/contact">Go to Contact Form</a>
  `);
});

// Contact form (GET)
app.get('/contact', (req, res) => {
  res.send(`
    <h2>Contact Us</h2>
    <form method="POST" action="/contact">
      <input name="name" placeholder="Your name" required/><br/><br/>
      <textarea name="message" placeholder="Your message" required></textarea><br/><br/>
      <button type="submit">Send</button>
    </form>
    <br/><a href="/">Back</a>
  `);
});

// Contact form (POST)
app.post('/contact', (req, res) => {
  const { name, message } = req.body;
  console.log(`📨 New message from ${name}: ${message}`);
  res.send(`<h3>Thanks, ${name}!</h3><p>Your message has been received.</p><a href="/">Home</a>`);
});

// Health check
app.get('/healthz', (_, res) => res.send('OK'));

// 404
app.use((_, res) => res.status(404).send('<h1>404 - Not Found</h1>'));

app.listen(PORT, () => {
  console.log(`${APP_NAME} running at http://localhost:${PORT}`);
});
