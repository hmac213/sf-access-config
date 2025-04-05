const express = require('express');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');
const bodyParser = require('body-parser');
const cors = require('cors');

const isProd = process.env.NODE_ENV === 'production';

// sample users database for now
const users = [
    {
        id: '1',
        email: 'hmac213@gmail.com',
        password: 'password'
    }
]

// This should be done once, not on every login request
bcrypt.hash('password', 10, (err, hash) => {
    if (err) {
        console.error(err);
    } else {
        // Update your user object with the hashed password
        users[0].password = hash;
        console.log('Updated user:', users[0]);
    }
});

passport.use(
    new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
        const user = users.find(u => u.email === email);
        if (!user) {
            return done(null, false, { message: 'Incorrect email or password.' });
        }
        bcrypt.compare(password, user.password, (err, isMatch) => {
            if (err) return done(err);
            if (isMatch) {
                return done(null, user);
            } else {
                return done(null, false, { message: 'Incorrect email or password.' });
            }
        })
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

const app = express();

app.use(cors({
    origin: 'http://localhost:3000', // your frontend's origin
    credentials: true
}));

app.use(bodyParser.urlencoded({ extended: false }));

app.use(
    session({
        secret: 'secret_key', // change later
        resave: false,
        saveUninitialized: false
    })
);

app.use(passport.initialize());
app.use(passport.session());

app.post('/api/login', passport.authenticate('local', {
    failureRedirect: isProd ? '/landing' : `${process.env.FRONTEND_BASE_URL}/landing`,
    successRedirect: isProd ? '/config' : `${process.env.FRONTEND_BASE_URL}/config`
}));

app.get('/config', (req, res) => {
    if (req.isAuthenticated()) {
        res.send('Welcome to config!');
    } else {
        res.redirect('/login');
    }
});

// Logout route to terminate the session
app.get('/api/logout', (req, res) => {
    req.logout(function(err) {
        if (err) {
            return next(err);
        }
        res.redirect('/landing');
    });
});
  
// Start the Express server
app.listen(5001, () => {
    console.log('Server started on port 5001');
});