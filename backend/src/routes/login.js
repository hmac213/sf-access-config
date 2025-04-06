require('dotenv').config();

const express = require('express');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const router = express.Router();

const User = require('../models/user');

passport.use(
    new LocalStrategy({ usernameField: 'email' }, async (email, password, done) => {
        try {
            const user = await User.findOne({ email });
            if (!user) {
                return done(null, false, { message: 'Incorrect email or password.' });
            }
            const isMatch = await user.comparePassword(password);
            if (isMatch) {
                return done(null, user);
            } else {
                return done(null, false, { message: 'Incorrect email or password.' });
          }
        } catch (err) {
            return done(err);
        }
    })
);

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    User.findById(id)
        .then(user => done(null, user))
        .catch(err => done(err));
});

// Custom callback for login to handle redirect_uri
router.post('/api/login', (req, res, next) => {
  // Extract redirect_uri from request body (assuming it's sent there by the form)
  // Decode it once, as it was encoded by the middleware
  const redirectUri = req.body.redirect_uri ? decodeURIComponent(req.body.redirect_uri) : null;

  // Basic validation: ensure it's a relative path starting with '/' or handle allowed absolute URLs if necessary
  const isValidRedirect = redirectUri && redirectUri.startsWith('/'); 
  // TODO: Add more robust validation if needed (e.g., check against allowed paths/domains)
  
  const successRedirectUrl = isValidRedirect 
    ? `${process.env.FRONTEND_BASE_URL}${redirectUri}` 
    : `${process.env.FRONTEND_BASE_URL}/config`; // Default fallback

  const failureRedirectUrl = `${process.env.FRONTEND_BASE_URL}/login?error=invalid_credentials`; // Or redirect back to landing? Add error query param.

  // Call passport.authenticate with a custom callback
  passport.authenticate('local', (err, user, info) => {
    if (err) { return next(err); }
    if (!user) { 
      console.log('Login failed:', info ? info.message : 'No user');
      // Include redirect_uri in failure redirect too, so login form can repopulate it
      const failureParams = new URLSearchParams();
      failureParams.set('error', info?.message || 'Invalid credentials');
      if (req.body.redirect_uri) { // Use original encoded value here
        failureParams.set('redirect_uri', req.body.redirect_uri);
      }
      return res.redirect(`${process.env.FRONTEND_BASE_URL}/login?${failureParams.toString()}`);
    }
    req.logIn(user, (err) => {
      if (err) { return next(err); }
      console.log('Login successful, redirecting to:', successRedirectUrl);
      return res.redirect(successRedirectUrl);
    });
  })(req, res, next); 
});

module.exports = router;