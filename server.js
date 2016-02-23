'use strict';

const bodyParser = require('body-parser');
const express = require('express');
const flash = require('connect-flash');
const methodOverride = require('method-override');
const mongoose = require('mongoose');
const passport = require('passport');
const session = require('express-session');
const RedisStore = require('connect-redis')(session);

const userRoutes = require('./lib/user/routes');

const app = express();
const PORT = process.env.PORT || 3000;
const SESSION_SECRET = process.env.SESSION_SECRET || 'supersecret';

//middleware
app.set('view engine', 'jade');

app.use(bodyParser.urlencoded({ extended: false }));

app.use(methodOverride('_method'));

//storing sessions info in Redis
//make sure redis is runnign with `redis-server`
app.use(session({
  secret: SESSION_SECRET,
  store: new RedisStore()
}));
//checking for redis error.
app.use((req, res, next) => {
  if (!req.session) throw new Error('Session Error');
  next();
});

//for social logings
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

//assigning email to user, otherwise it will be guest.
app.use((req, res, next) => {
  //locals makes a variable available to jade templates
  res.locals.user = req.user;
  next();
});
//adding a message through flash
app.use((req, res, next) => {
  //making messages variable available to jade
  res.locals.messages = req.flash();
  next();
});

//root route
app.get('/', (req, res) => {
  res.render('index');
});

//load routes
app.use(userRoutes);

//connecting to mongoose database
mongoose.connect('mongodb://localhost:27017/nodeauth', (err) => {
  if (err) throw err;

  app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);
  });
});
