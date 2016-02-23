'use strict';

const bodyParser = require('body-parser');
const express = require('express');
const methodOverride = require('method-override');
const mongoose = require('mongoose');
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
})

//assigning email to user, otherwise it will be guest.
app.use((req, res, next) => {
  console.log(req.session);
  res.locals.user = req.session.user || { email: 'Guest' };
  next();
});

//root route
app.get('/', (req, res) => {
  res.render('index');
});

app.use(userRoutes);

mongoose.connect('mongodb://localhost:27017/nodeauth', (err) => {
  if (err) throw err;

  app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);
  });
});
