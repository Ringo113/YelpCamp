const express = require('express');
const router = express.Router();
const passport = require('passport');
const User = require('../models/user');

// register form
router.get('/register', (req, res) => {
  res.render('users/register');
});

// handle register
router.post('/register', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = new User({ username });
    const registeredUser = await User.register(user, password);
    req.login(registeredUser, err => {
      if (err) return next(err);
      res.redirect('/campgrounds');
    });
  } catch (e) {
    res.send(e.message);
  }
});

// login form
router.get('/login', (req, res) => {
  res.render('users/login');
});

// handle login
router.post('/login', passport.authenticate('local', {
  failureRedirect: '/login'
}), (req, res) => {
  res.redirect('/campgrounds');
});

// logout
router.get('/logout', (req, res) => {
  req.logout(() => {
    res.redirect('/campgrounds');
  });
});

module.exports = router;
