const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../../models/User');
const Store = require('../../models/Store');
const router = express.Router();

// Middleware to verify JWT
const authMiddleware = (req, res, next) => {
const token = req.header('Authorization')?.replace('Bearer ', '');
if (!token) {
    return res.status(401).json({ error: 'No token provided' });
}

try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Attach user data (userId, email, role) to request
    next();
} catch (err) {
    res.status(401).json({ error: 'Invalid token' });
}
};

// POST /api/stores
router.post('/', authMiddleware, async (req, res) => {
try {
    const { name, slug } = req.body;

    // Validate input
    if (!name || !slug) {
    return res.status(400).json({ error: 'Name and slug are required' });
    }

    // Check for existing slug
    const existingStore = await Store.findOne({ slug });
    if (existingStore) {
    return res.status(400).json({ error: 'Slug already exists' });
    }

    // Create new store
    const store = new Store({
    name,
    slug: slug.toLowerCase().trim(),
    owner: req.user.userId,
    });
    await store.save();

    // Update user's storeIds
    const user = await User.findById(req.user.userId);
    user.storeIds.push(store._id);
    await user.save();

    res.status(201).json({ message: 'Store created successfully', store: { name, slug, owner: user.email } });
} catch (err) {
    res.status(500).json({ error: err.message });
}
});

module.exports = router;