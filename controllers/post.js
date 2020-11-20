const Post = require('../models/post');
const { validationResult } = require('express-validator');

exports.getPosts = async (req, res, next) => {
    try {
        const posts = await Post.findAll({
            limit: req.query.size || 2,
            offset: req.query.page || 0,
            where: {
                userId: req.userId
              }
        });

        res.status(200).json({
            message: 'Posts fetched successfully',
            posts: posts
        })
    } catch (error) {
        if (!error.statusCode) {
            error.statusCode = 500;
        }
        next(error);
    }
};

exports.addPost = async (req, res, next) => {
    try {

        const errors = validationResult(req);
        
        if (!errors.isEmpty()) {
            const error = new Error('Validation failed.');
            error.statusCode = 422;
            error.data = errors.array();
            throw error;
        }

        const {title, content} = req.body;

        const post = await Post.create({
            title: title,
            content: content,
            userId: req.userId
        })

        if (post) {
            res.status(201).json({
                message: 'Post created successfully',
                post: post
            })
        }

    } catch (error) {
        if (!error.statusCode) {
            error.statusCode = 500;
        }
        next(error);
    }
};

exports.getPostById = async (req, res, next) => {
    try {
        const postId = req.params.postId;
        const post = await Post.findByPk(postId);
        
        if (!post) {
            const error = new Error ('Post not found.');
            error.statusCode = 404;
            throw error;
        }

        if (post.userId !== req.userId) {
            const error = new Error ('Unauthorized access.');
            error.statusCode = 401;
            throw error;
        }

        res.status(200).json({
            message: 'Post fetched successfully',
            post: post
        })
    } catch (error) {
        if (!error.statusCode) {
            error.statusCode = 500;
        }
        next(error);
    }
};

exports.updatePostById = async (req, res, next) => {
    try {

        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            const error = new Error('Validation failed.');
            error.statusCode = 422;
            error.data = errors.array();
            throw error;
        }
        const postId = req.params.postId;
        const { title, content } = req.body;

        const post = await Post.findByPk(postId);
        
        if (!post) {
            const error = new Error ('Post not found.');
            error.statusCode = 404;
            throw error;
        }

        if (post.userId !== req.userId) {
            const error = new Error ('Unauthorized access.');
            error.statusCode = 401;
            throw error;
        }

        const row = await Post.update({
            title: title,
            content: content
        }, {
            returning: true,
            where: {
                id: postId,
                userId: req.userId
            }
        });

        if (!row) {
            const error = new Error ('Update post failed.');
            error.statusCode = 400;
            throw error;
        }

        res.status(200).json({
            message: 'Post updated successfully',
            post: row
        })

    } catch (error) {
        if (!error.statusCode) {
            error.statusCode = 500;
        }
        next(error);
    }
};

exports.deletePostById = async (req, res, next) => {
    try {
        const postId = req.params.postId;

        const row = await Post.destroy({ where: { id: postId }});

        if (row) {
            res.status(200).json({
                message: 'Post deleted successfully',
                success: true
            })   
        }
    } catch (error) {
        if (!error.statusCode) {
            error.statusCode = 500;
        }
        next(error);
    }
};