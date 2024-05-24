const asyncHandler = require('express-async-handler');
const { body, validationResult } = require('express-validator');
const passport = require('passport');
const bcrypt = require('bcryptjs');
const User = require('../models/user');

exports.signup_get = (req, res, next) => {
  res.render('signup_form', { title: 'Sign up' });
};

exports.signup_post = [
  body('username', 'Username must not be empty')
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body('password', 'Password must not be empty')
    .trim()
    .isLength({ min: 1 })
    .escape(),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    const user = new User({
      username: req.body.username,
      password: req.body.password,
    });

    if (!errors.isEmpty()) {
      res.render('signup_form', {
        title: 'Sign up',
        user: user,
        errors: errors.array(),
      });
    } else {
      bcrypt.hash(req.body.password, 10, async (err, hashedPassword) => {
        if (err) {
          return next(err);
        } else {
          user.password = hashedPassword;
          await user.save();
          res.redirect('/login');
        }
      });
    }
  }),
];

exports.login_get = (req, res, next) => {
  res.render('login_form', { title: 'Log in' });
};

exports.login_post = [
  body('username', 'Username must not be empty')
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body('password', 'Password must not be empty')
    .trim()
    .isLength({ min: 1 })
    .escape(),

  (req, res, next) => {
    const errors = validationResult(req);

    const user = new User({
      username: req.body.username,
      password: req.body.password,
    });

    if (!errors.isEmpty()) {
      res.render('login_form', {
        title: 'Log in',
        user: user,
        errors: errors.array(),
      });
    }

    next();
  },

  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
  }),
];

exports.logout = (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }

    res.redirect('/');
  });
};
