const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');

exports.signup = async (req, res, next) => {
    try {

        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            const error = new Error('Validation failed.');
            error.statusCode = 422;
            error.data = errors.array();
            throw error;
        }
        const { name, email, password } = req.body;

        const hashedPassword = await bcrypt.hash(password, 12);
        const user = await User.create({
            name: name,
            email: email,
            password: hashedPassword
        })
        
        if (user) {
            res.status(201).json({
                message: 'User created successfully',
                user: user
            })
        }

    } catch (error) {
        if (!error.statusCode) {
            error.statusCode = 500;
        }
        next(error);
    }
};

exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({
            where: {
              email: email
            }
        });

        if (!user) {
            const error = new Error('Email not found');
            error.statusCode = 404;
            throw error;
        }
        const isEqual = await bcrypt.compare(password, user.dataValues.password);
        
        if (!isEqual) {
            const error = new Error('Invalid password');
            error.statusCode = 401;
            throw error;
        }

        const token = jwt.sign({
            email: user.dataValues.email,
            userId: user.dataValues.id.toString()
        }, 'supersecret', { expiresIn: '1h' });

        res.status(200).json({
            token: token,
            userId: user.id
        });

    } catch (error) {
        if (!error.statusCode) {
            error.statusCode = 500;
        }
        next(error);
    }
};