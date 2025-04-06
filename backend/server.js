require('./src/db');
require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

const register_route = require('./src/routes/register');
const login_route = require('./src/routes/login');
const logout_route = require('./src/routes/logout');
const attributes_route = require('./src/routes/attributes');

app.set('trust proxy', 1);

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(register_route);
app.use(login_route);
app.use(logout_route);
app.use(attributes_route);

app.use(cors({
    origin: `${process.env.FRONTEND_BASE_URL}`, // your frontend's origin
    credentials: true
}));

app.get('/config', (req, res) => {
    if (req.isAuthenticated()) {
        res.send('Welcome to config!');
    } else {
        console.log('the user is not authenticated!!')
        res.redirect('/login');
    }
});
  
app.listen(5001, () => {
    console.log('Server started on port 5001');
});
