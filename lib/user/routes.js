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

//Forgot password form
router.get('/forgotPassword', (req, res) => {
  res.render('forgotPassword');
});
//Finding email in database and getting object to redirect
router.post('/forgotPassword', (req, res) => {

  User.findOne({email: req.body.email}, (err, userObj) => {
    if (err) throw err;

    if (userObj) {
      //set middleware function to add user object

      res.render('newPassword', {userEmail: userObj.email});
    } else {
      res.redirect('/forgotPassword');
    }
  });
});

router.get('/newPassword', (req, res) => {
  res.render('newPassword');
});

router.put('/newPassword', (req, res) => {
  //mongoose update through the id.

  res.send('this is patching new info');
});


module.exports = router;
