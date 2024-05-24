const express = require('express');
const router = express.Router();

const authController = require('../controllers/auth');

// GET request for sign up
router.get('/signup', authController.signup_get);

// POST request for sign up
router.post('/signup', authController.signup_post);

// GET request for log in
router.get('/login', authController.login_get);

// POST request for log in
router.post('/login', authController.login_post);

// GET request for log out
router.get('/logout', authController.logout);

module.exports = router;
