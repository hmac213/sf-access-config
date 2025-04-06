const express = require('express');
const router = express.Router();

// Logout route to terminate the session
router.get('/api/logout', (req, res) => {
    req.logout(function(err) {
        if (err) {
            return next(err);
        }
        res.redirect('/landing');
    });
});

module.exports = router;