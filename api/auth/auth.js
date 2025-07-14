const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../../models/User');
const router = express.Router();

// POST /api/auth/register
router.post('/register', async (req, res) => {
try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
    }

    // Check for existing user
    const existingUser = await User.findOne({ email });
    if (existingUser) {
    return res.status(400).json({ error: 'Email already exists' });
    }

    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create new user
    const user = new User({
    email,
    password: hashedPassword,
    role: 'user',
    });
    await user.save();

    res.status(201).json({ message: 'User registered successfully', user: { email, role: user.role } });
} catch (err) {
    res.status(500).json({ error: err.message });
}
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
    }

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
    return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Verify password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
    return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Generate JWT
    const token = jwt.sign(
    { userId: user._id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
    );

    res.json({ message: 'Login successful', token, user: { email, role: user.role } });
} catch (err) {
    res.status(500).json({ error: err.message });
}
});

module.exports = router;