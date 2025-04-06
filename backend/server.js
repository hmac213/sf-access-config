require('./src/db');
require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const session = require('express-session');
const passport = require('passport');

const app = express();

app.set('trust proxy', 1);

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cors({
    origin: process.env.FRONTEND_BASE_URL,
    credentials: true
}));

app.use(
    session({
        secret: 'secret_key', // change later
        resave: false,
        saveUninitialized: false,
        cookie: {
            secure: process.env.NODE_ENV === 'production' ? true : false, // only set secure cookies in production
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        }
    })
);

app.use(passport.initialize());
app.use(passport.session());

const register_route = require('./src/routes/register');
const login_route = require('./src/routes/login');
const logout_route = require('./src/routes/logout');
const attributes_route = require('./src/routes/attributes');
const auth_route = require('./src/routes/auth');

app.use(register_route);
app.use(login_route);
app.use(logout_route);
app.use(attributes_route);
app.use(auth_route);

app.get('/config', (req, res) => {
    if (req.isAuthenticated()) {
        res.send('Welcome to config!');
    } else {
        console.log('the user is not authenticated!!');
        res.redirect('/login');
    }
});
  
app.listen(5001, () => {
    console.log('Server started on port 5001');
});