'use strict';
const express = require('express');
const router = express.Router();
const passport = require('passport');

const User = require('./model');

require('./local');

router.get('/login', (req, res) => {
  res.render('login');
});

router.post('/login',
  passport.authenticate('local',
    {
      failureFlash: 'Incorrect Username or password',
      failureRedirect: '/login',
      successFlash: 'Success!',
      successRedirect: '/'
    }
  )
);

router.delete('/login', (req, res) => {
  req.session.regenerate(function(err) {
    if (err) throw err;

    res.redirect('/');
  });
});


router.get('/register', (req, res) => {
  res.render('register');
});

router.post('/register', (req, res) => {

  if (req.body.password === req.body.verify) {
     User.findOne({email: req.body.email}, (err, user) => {
      if (err) throw err;

      if (user) {
        res.redirect('/login');
      } else {
        User.create(req.body, (err) => {
          if (err) throw err;
          res.redirect('/login');
        });
      }
    });
  } else {
       res.render('register', {
      message: 'Passwords do not match',
      email: req.body.email});
  }
});

router.get('/forgotPassword', (req, res) => {
  res.render('forgotPassword');
});

router.post('/forgotPassword', (req, res) => {
  console.log('user post??', req.body.email);
  User.findOne({email: req.body.email}, (err, userObj) => {
    if (err) throw err;

    if (userObj) {
      res.send(userObj.email);
    } else {
      res.redirect('/forgotPassword');
    }
  });
});

module.exports = router;
