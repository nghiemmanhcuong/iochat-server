const {default: mongoose} = require('mongoose');
const postModel = require('../models/postModel.js');
const userModel = require('../models/userModel.js');

class PostController {
    // [POST] post/create
    async createPost(req, res) {
        const {userId, description} = req.body;
        if (userId && description) {
            try {
                const newPost = new postModel(req.body);
                await newPost.save();
                res.status(200).json({
                    success: true,
                    message: 'Create post successfully',
                    post: newPost,
                });
            } catch (error) {
                res.status(500).json({
                    message: 'error in server side' + error.message,
                    success: false,
                });
            }
        } else {
            res.status(403).json({
                success: false,
                message: 'Lack of necessary information ',
            });
        }
    }

    // [GET] post/:id
    async getPostById(req, res) {
        if (req.params.id) {
            const post = await postModel.findById(req.params.id);
            if (post) {
                res.status(200).json({
                    success: true,
                    post: post,
                });
            } else {
                res.status(404).json({
                    success: false,
                    message: 'Post not found',
                });
            }
        } else {
            res.status(404).json({
                success: false,
                message: 'Requested page or content not found',
            });
        }
    }

    // [PUT] post/update/:id
    async updatePost(req, res) {
        if (req.params.id) {
            const postId = req.params.id;
            const userId = req.body.userId;
            try {
                const post = await postModel.findById(postId);
                if (userId && userId == post.userId) {
                    await postModel.updateOne({$set: req.body});
                    res.status(200).json({
                        success: true,
                        message: 'Update post successfully',
                    });
                } else {
                    res.status(403).json({
                        message: 'You do not have permission to access or perform this function',
                        success: false,
                    });
                }
            } catch (error) {
                res.status(500).json({
                    message: 'error in server side' + error.message,
                    success: false,
                });
            }
        } else {
            res.status(404).json({
                success: false,
                message: 'Requested page or content not found',
            });
        }
    }

    // [PUT] post/delete/:id
    async deletePost(req, res) {
        if (req.params.id) {
            const postId = req.params.id;
            const userId = req.body.userId;
            try {
                const post = await postModel.findById(postId);
                if (userId && userId == post.userId) {
                    await postModel.deleteOne();
                    res.status(200).json({
                        success: true,
                        message: 'Delete post successfully',
                    });
                } else {
                    res.status(403).json({
                        message: 'You do not have permission to access or perform this function',
                        success: false,
                    });
                }
            } catch (error) {
                res.status(500).json({
                    message: 'error in server side' + error.message,
                    success: false,
                });
            }
        } else {
            res.status(404).json({
                success: false,
                message: 'Requested page or content not found',
            });
        }
    }

    // [PUT] post/like/:id
    async postLike(req, res) {
        if (req.params.id) {
            const {userId} = req.body;
            try {
                const post = await postModel.findById(req.params.id);
                if (post) {
                    if (post.liked.includes(userId)) {
                        await post.updateOne({$pull: {liked: userId}});
                        res.status(200).json({
                            success: true,
                            message: 'post liked',
                        });
                    } else {
                        await post.updateOne({$push: {liked: userId}});
                        res.status(200).json({
                            success: true,
                            message: 'post unliked',
                        });
                    }
                } else {
                    res.status(404).json({
                        success: false,
                        message: 'Requested page or content not found',
                    });
                }
            } catch (error) {
                res.status(500).json({
                    message: 'error in server side' + error.message,
                    success: false,
                });
            }
        } else {
            res.status(404).json({
                success: false,
                message: 'Requested page or content not found',
            });
        }
    }

    async getTimelinePosts(req, res) {
        if (req.params.id) {
            const userId = req.params.id;
            try {
                const currentUserPosts = await postModel
                    .find({userId: userId})
                    .sort({createdAt: -1});

                const followingPosts = await userModel
                    .aggregate([
                        {
                            $match: {
                                _id: new mongoose.Types.ObjectId(userId),
                            },
                        },
                        {
                            $lookup: {
                                from: 'posts',
                                localField: 'followings',
                                foreignField: 'userId',
                                as: 'followingPosts',
                            },
                        },
                        {
                            $project: {
                                followingPosts: 1,
                                _id: 0,
                            },
                        },
                    ])
                    .sort({createdAt: -1});

                res.status(200).json({
                    success: true,
                    posts: currentUserPosts.concat(...followingPosts[0].followingPosts),
                });
            } catch (error) {
                res.status(500).json({
                    message: 'error in server side' + error.message,
                    success: false,
                });
            }
        } else {
            res.status(404).json({
                success: false,
                message: 'Requested page or content not found',
            });
        }
    }
}

module.exports = new PostController();
