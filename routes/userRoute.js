const express = require('express');
const router = express.Router();

const userController = require('../controllers/userController.js');

router.get('/all',userController.getAll);
router.get('/by-id/:id',userController.getUserById);
router.put('/update/:id',userController.updateUser);
router.delete('/delete/:id',userController.deleteUser);
router.put('/follow/:id',userController.followUser);
router.put('/unfollow/:id',userController.unfollowUser);

module.exports = router;
