const express = require('express');
const os = require('os');
const path = require('path');
const fs = require('fs');
const dotenv = require('dotenv');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { body, validationResult } = require('express-validator');
const bodyParser = require('body-parser');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const APP_NAME = process.env.APP_NAME || 'Node App';
const CONTACTS_FILE = path.join(__dirname, 'contacts.json');

// Middleware
app.use(helmet());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use('/static', express.static(path.join(__dirname, 'public')));

// Rate limiting (5 requests per minute per IP for form POSTs)
const limiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 5,
  message: 'Too many requests, try again later.',
});
app.use('/contact', limiter);

// Home
app.get('/', (req, res) => {
  res.send(`
    <h1>${APP_NAME}</h1>
    <p>Welcome to the Dockerized Node.js app!</p>
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

// Contact form (POST with validation)
app.post('/contact',
  [
    body('name').isLength({ min: 2 }).trim().escape(),
    body('message').isLength({ min: 5 }).trim().escape(),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).send('<h4>Invalid input. Please check your data.</h4><a href="/contact">Go Back</a>');
    }

    const { name, message } = req.body;
    const logEntry = {
      name,
      message,
      userAgent: req.headers['user-agent'],
      timestamp: new Date().toISOString(),
    };

    let allContacts = [];
    if (fs.existsSync(CONTACTS_FILE)) {
      allContacts = JSON.parse(fs.readFileSync(CONTACTS_FILE));
    }
    allContacts.push(logEntry);
    fs.writeFileSync(CONTACTS_FILE, JSON.stringify(allContacts, null, 2));

    console.log(`📨 New message from ${name}: ${message}`);
    res.send(`<h3>Thanks, ${name}!</h3><p>Your message has been saved.</p><a href="/">Home</a>`);
  }
);

// API to view messages (for admin/debug)
app.get('/api/contacts', (req, res) => {
  if (!fs.existsSync(CONTACTS_FILE)) {
    return res.json([]);
  }
  const data = JSON.parse(fs.readFileSync(CONTACTS_FILE));
  res.json(data);
});

// Health check
app.get('/healthz', (_, res) => res.send('OK'));

// 404
app.use((_, res) => res.status(404).send('<h1>404 - Not Found</h1>'));

// Start server
app.listen(PORT, () => {
  console.log(`${APP_NAME} running at http://localhost:${PORT}`);
});
