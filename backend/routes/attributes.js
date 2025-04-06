require('dotenv').config();

const express = require('express');
const router = express.Router();

router.post('/api/attributes', async (req, res) => {
    try {
        req.user.attributes = req.body.attributes;
        await req.user.save();
        res.redirect('/config');
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to update attributes' });
    }
});

module.exports = router;