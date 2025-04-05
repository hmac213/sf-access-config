const express = require('express');
const { v4: uuidv4 } = require('uuid');
const router = express.Router();

const User = require('../models/user');

// Registration route
router.post('/api/register', async (req, res) => {
  try {
    const { name, email, password, confirm_password } = req.body;
    if (password !== confirm_password) {
      return res.status(400).json({ error: 'Passwords must match' });
    }
    const newUser = new User({ name, email, password, attributes: null });
    await newUser.save();
    res.status(201).json({ message: 'User created successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create user' });
  }
});

module.exports = router;