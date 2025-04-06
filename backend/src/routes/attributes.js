require('dotenv').config();

const express = require('express');
const router = express.Router();
const User = require('../models/user'); // Make sure User model is required if not already

// Middleware to ensure user is authenticated before accessing this route
const ensureAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ error: 'User not authenticated' });
};

router.post('/api/attributes', ensureAuthenticated, async (req, res) => {
    // Check if user is properly attached by Passport
    if (!req.user) {
        return res.status(401).json({ error: 'User not found in session' });
    }

    try {
        // Extract all keys from the request body
        const attributesFromBody = Object.keys(req.body);
        
        // Filter out 'api_key' or any other reserved keys if needed
        const allowedAttributes = attributesFromBody.filter(key => key !== 'api_key');
        
        // Update the user's attributes field
        // Find the user again to ensure we have the latest instance
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        
        user.attributes = allowedAttributes;
        await user.save();
        
        console.log(`Updated attributes for user ${user.id}:`, allowedAttributes);
        // Send back a success response instead of redirecting (API endpoint best practice)
        res.status(200).json({ message: 'Attributes updated successfully', attributes: allowedAttributes });

    } catch (err) {
        console.error('Error updating attributes:', err);
        res.status(500).json({ error: 'Failed to update attributes' });
    }
});

module.exports = router;