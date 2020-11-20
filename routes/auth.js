const express = require('express');
const authController = require('../controllers/auth');
const User = require('../models/user');
const { body } = require('express-validator');

const router = express.Router();

router.post('/login', authController.login);
router.post('/signup', [
    body('email').isEmail().withMessage('Please insert a valid email.')
    .custom((value, {req}) => {
        return User.findOne({ where: { email: value } }).then(userDoc => {
            if (userDoc) {
                return Promise.reject('Email already exists.');
            }
        })
    }).normalizeEmail(),
    body('password').trim().isLength({min: 5}),
    body('name').trim().not().isEmpty()
], authController.signup);

module.exports = router;