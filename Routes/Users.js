const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../Models/User');
const router = express.Router();

// User Registration
router.post('/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const newUser = new User({ username, email, password });
        await newUser.save();
        // Don't send password back, even if hashed
        res.status(201).json({ message: 'User created successfully', userId: newUser._id });
    } catch (error) {
        if (error.code === 11000) { // MongoDB duplicate key error
            res.status(400).json({ error: 'Username or email already exists' });
        } else {
            res.status(500).json({ error: error.message });
        }
    }
});

// User Authentication
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        // 1. Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        // 2. Compare provided password with hashed password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        // 3. If successful, send a success message (in a real app, you'd send a JWT token here)
        res.json({ message: 'Login successful!', userId: user._id });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;