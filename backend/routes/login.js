require('dotenv').config();

const express = require('express');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const router = express.Router();

const User = require('../models/user');

const isProd = process.env.NODE_ENV === 'production';

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
    const user = users.find(u => u.id === id);
    if (user) {
        done(null, user);
    } else {
        done(new Error('User not found.'))
    }
});

router.use(
    session({
        secret: 'secret_key', // change later
        resave: false,
        saveUninitialized: false
    })
);

router.use(passport.initialize());
router.use(passport.session());

router.post('/api/login', passport.authenticate('local', {
    failureRedirect: isProd ? '/landing' : `${process.env.FRONTEND_BASE_URL}/landing`,
    successRedirect: isProd ? '/config' : `${process.env.FRONTEND_BASE_URL}/config`
}));

module.exports = router;