const express = require('express');
const { v4: uuidv4 } = require('uuid');
const router = express.Router();

const User = require('../models/user');

// Registration route
router.post('/api/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const id = uuidv4();
    const newUser = new User({ id, name, email, password, attributes: null });
    await newUser.save();
    res.status(201).json({ message: 'User created successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create user' });
  }
});

module.exports = router;