const express = require('express');
const router = express.Router();

const postController = require('../controllers/postController.js');

router.post('/create',postController.createPost);
router.get('/:id',postController.getPostById);
router.put('/update/:id',postController.updatePost);
router.delete('/delete/:id',postController.deletePost);
router.put('/like/:id',postController.postLike);
router.get('/timeline/:id',postController.getTimelinePosts);

module.exports = router;