const express = require('express');
     const jwt = require('jsonwebtoken');
     const User = require('../../models/User');
     const Store = require('../../models/Store');
     const Event = require('../../models/Event');
     const router = express.Router();

     // Middleware to verify JWT
     const authMiddleware = (req, res, next) => {
       const token = req.header('Authorization')?.replace('Bearer ', '');
       if (!token) {
         return res.status(401).json({ error: 'No token provided' });
       }

       try {
         const decoded = jwt.verify(token, process.env.JWT_SECRET);
         req.user = decoded; // Attach user data (userId, email, role)
         next();
       } catch (err) {
         res.status(401).json({ error: 'Invalid token' });
       }
     };

     // POST /api/events
     router.post('/', authMiddleware, async (req, res) => {
       try {
         const { title, description, date, price, storeId } = req.body;

         // Validate input
         if (!title || !date || !price || !storeId) {
           return res.status(400).json({ error: 'Title, date, price, and storeId are required' });
         }

         // Verify store exists and belongs to the user
         const store = await Store.findById(storeId);
         if (!store) {
           return res.status(404).json({ error: 'Store not found' });
         }
         if (store.owner.toString() !== req.user.userId) {
           return res.status(403).json({ error: 'Not authorized to create events for this store' });
         }

         // Create new event
         const event = new Event({
           title,
           description,
           date,
           price,
           store: storeId,
         });
         await event.save();

         res.status(201).json({ message: 'Event created successfully', event: { title, description, date, price, store: storeId } });
       } catch (err) {
         res.status(500).json({ error: err.message });
       }
     });

     module.exports = router;