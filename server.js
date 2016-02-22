'use strict';

const bodyParser = require('body-parser');
const express = require('express');
const session = require('express-session')

const app = express();
const PORT = process.env.PORT || 3000;
const SESSION_SECRET = process.env.SESSION_SECRET || 'supersecret'

//middleware
app.set('view engine', 'jade');

app.use(bodyParser.urlencoded({ extended: false }));

app.use(session({
  secret: SESSION_SECRET
}));

//routes
app.get('/', (req, res) => {
  res.render('index');
});

app.get('/login', (req, res) => {
  res.render('login');
});

app.post('/login', (req, res) => {
  res.redirect('/');
});

app.get('/register', (req, res) => {
  res.render('register');
});

app.post('/register', (req, res) => {

  if (req.body.password === req.body.verify) {
    res.redirect('/login');
  } else {
    res.render('register', {
      message: 'Passwords do not match',
      email: req.body.email});
  }
});


app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
