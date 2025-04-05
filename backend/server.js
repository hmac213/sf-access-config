require('./db');
require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

const register_route = require('./routes/register');
const login_route = require('./routes/login');
const logout_route = require('./routes/logout');
const attributes_route = require('./routes/attributes');

app.set('trust proxy', 1);

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(register_route);
app.use(login_route);
app.use(logout_route);
app.use(attributes_route);

const isProd = process.env.NODE_ENV === 'production';

if (!isProd) {
    app.use(cors({
        origin: 'http://localhost:3000', // your frontend's origin
        credentials: true
    }));
}

app.get('/config', (req, res) => {
    if (req.isAuthenticated()) {
        res.send('Welcome to config!');
    } else {
        console.log('the user is not authenticated!!')
        res.redirect('/login');
    }
});
  
if (!isProd) {
    app.listen(5001, () => {
        console.log('Server started on port 5001');
    });
}