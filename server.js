const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const app = express();
const mongoose = require('mongoose');
const Store = require('./models/Store');
const port = 5000;

// Middleware to extract subdomain
app.use((req, res, next) => {
  const host = req.headers.host; // e.g., mystore.platform.com:5000
  const subdomain = host.includes('.') ? host.split('.')[0] : null;
  req.subdomain = subdomain;
  next();
});

// Main domain route
app.get('/', (req, res) => {
  if (req.subdomain === 'localhost' || req.headers.host.startsWith('localhost')) {
    res.json({ message: 'Welcome to the Event Ticket Platform' });
  } else {
    res.json({ message: `Welcome to the store: ${req.subdomain}` });
  }
});

// Import models
require('./models/User');
require('./models/Store');
require('./models/Event');
app.use(express.json());
// Mount auth routes
app.use('/api/auth', require('./api/auth/auth'));
app.use('/api/stores', require('./api/stores/stores'));
app.use('/api/events', require('./api/events/events'));

// Load environment variables
dotenv.config();

// Log environment variables to verify (remove in production)
console.log('Environment Variables:');
console.log('PORT:', process.env.PORT);
console.log('MONGODB_URI:', process.env.MONGODB_URI);
console.log('JWT_SECRET:', process.env.JWT_SECRET ? '[REDACTED]' : 'Not set');
console.log('STRIPE_SECRET_KEY:', process.env.STRIPE_SECRET_KEY ? '[REDACTED]' : 'Not set');
console.log('STRIPE_PUBLIC_KEY:', process.env.STRIPE_PUBLIC_KEY ? '[REDACTED]' : 'Not set');

// Middleware to extract subdomain
app.use((req, res, next) => {
  const host = req.headers.host; // e.g., mystore.platform.com:5000
  const subdomain = host.split('.')[0];

  // Store subdomain in request object
  req.subdomain = subdomain;
  next();
});

// Main domain route
// app.get('/', (req, res) => {
//   if (req.subdomain === 'localhost' || req.headers.host.startsWith('localhost')) {
//     res.json({ message: 'Welcome to the Event Ticket Platform' });
//   } else {
//     res.json({ message: `Welcome to the store: ${req.subdomain}` });
//   }
// });

// Connect to MongoDB
     mongoose.connect(process.env.MONGODB_URI, {
      //  useNewUrlParser: true,
      //  useUnifiedTopology: true,
     })
       .then(() => console.log('Connected to MongoDB'))
       .catch((err) => console.error('MongoDB connection error:', err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
// mongodb+srv://atashaikh:ci9FRVYn0JnW6AF7@cluster0.nmtsfc8.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0