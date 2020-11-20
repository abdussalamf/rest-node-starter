const express = require('express');
const postController = require('../controllers/post');
const isAuth = require('../middleware/is-auth');
const { body } = require('express-validator');

const router = express.Router();

router.get('/post', isAuth, postController.getPosts);
router.post('/post', isAuth, [
    body('title').trim().isLength({ min: 3 }),
    body('content').trim().isLength({ min: 5 })
 ], postController.addPost);
router.get('/post/:postId', isAuth, postController.getPostById);
router.put('/post/:postId', isAuth, [
    body('title').trim().isLength({ min: 3 }),
    body('content').trim().isLength({ min: 5 })
 ], postController.updatePostById);
router.delete('/post/:postId', isAuth, postController.deletePostById);

module.exports = router;