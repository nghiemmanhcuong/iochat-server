const userModel = require('../models/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

class UserController {
    // [GET] user/all
    async getAll(req, res) {
        try {
            let users = await userModel.find({});
            if (users) {
                users = users.map((user) => {
                    const {password, ...otherDetails} = user._doc;
                    return otherDetails;
                });
                res.status(200).json({
                    users,
                    success: true,
                });
            } else {
                res.status(404).json({
                    message: 'User not found',
                    success: false,
                });
            }
        } catch (error) {
            res.status(500).json({
                message: 'error in server side' + error.message,
                success: false,
            });
        }
    }

    // [GET] user/by-id/:id
    async getUserById(req, res) {
        if (req.params.id) {
            try {
                const user = await userModel.findById(req.params.id);
                if (user) {
                    const {password, ...otherDetails} = user._doc;

                    res.status(200).json({
                        user: otherDetails,
                        success: true,
                    });
                } else {
                    res.status(404).json({
                        message: 'User not found',
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
                message: 'User not found',
                success: false,
            });
        }
    }

    // [PUT] user/update-user/:id
    async updateUser(req, res) {
        if (req.params.id) {
            const {id, currentUserAdminStatus, password} = req.body;
            if (req.params.id == id || currentUserAdminStatus) {
                try {
                    if (password) {
                        const salt = await bcrypt.genSalt(10);
                        req.body.password = await bcrypt.hash(password, salt);
                    }

                    const user = await userModel.findByIdAndUpdate(req.params.id, req.body, {
                        new: true,
                    });
                    const token = jwt.sign(
                        {
                            username: user.username,
                            id: user._id,
                        },
                        process.env.JWT_KEY,
                        {expiresIn: '1h'},
                    );
                    if (user) {
                        res.status(200).json({
                            token,
                            user: {
                                id: user._id,
                                username: user.username,
                                email: user.email,
                                firstname: user.firstname,
                                lastname: user.lastname,
                                profilePicture: user.profilePicture,
                                coverPicture: user.coverPicture,
                                about: user.about,
                                livesIn: user.livesIn,
                                worksAt: user.worksAt,
                                address: user.address,
                                relationships: user.relationships,
                                followers: user.followers,
                                followings: user.followings,
                            },
                            success: true,
                        });
                    } else {
                        res.status(404).json({
                            message: 'User not found',
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
                res.status(403).json({
                    message: 'You do not have access to this page or function',
                    success: false,
                });
            }
        } else {
            res.status(404).json({
                message: 'User not found',
                success: false,
            });
        }
    }

    // [DELETE] user/delete-user/:id
    async deleteUser(req, res) {
        if (req.params.id) {
            const {currentUserId, currentUserAdminStatus} = req.body;
            if (req.params.id == currentUserId || currentUserAdminStatus) {
                try {
                    await userModel.findByIdAndDelete(req.params.id);
                    res.status(200).json({
                        message: 'User delete successfully',
                        success: true,
                    });
                } catch (error) {
                    res.status(500).json({
                        message: 'error in server side' + error.message,
                        success: false,
                    });
                }
            } else {
                res.status(403).json({
                    message: 'You do not have access to this page or function',
                    success: false,
                });
            }
        } else {
            res.status(404).json({
                message: 'User not found',
                success: false,
            });
        }
    }

    // [PUT] user/follow/:id
    async followUser(req, res) {
        if (req.params.id) {
            const followUserId = req.params.id;
            const {currentUserId} = req.body;

            if (currentUserId == followUserId) {
                res.status(403).json({
                    message: 'Action forbidden',
                    success: false,
                });
            } else {
                try {
                    const currentUser = await userModel.findById(currentUserId);
                    const followUser = await userModel.findById(followUserId);

                    if (!followUser.followers.includes(currentUserId)) {
                        await followUser.updateOne({$push: {followers: currentUserId}});
                        await currentUser.updateOne({$push: {followings: followUserId}});
                        res.status(200).json({
                            success: true,
                            message: 'User followed',
                        });
                    } else {
                        res.status(403).json({
                            message: 'User is already followed by you',
                            success: false,
                        });
                    }
                } catch (error) {
                    res.status(500).json({
                        message: 'error in server side' + error.message,
                        success: false,
                    });
                }
            }
        } else {
            res.status(404).json({
                message: 'Requested function page not found',
                success: false,
            });
        }
    }

    // [PUT] user/unfollow/:id
    async unfollowUser(req, res) {
        if (req.params.id) {
            const unfollowUserId = req.params.id;
            const {currentUserId} = req.body;

            if (currentUserId == unfollowUserId) {
                res.status(403).json({
                    message: 'Action forbidden',
                    success: false,
                });
            } else {
                try {
                    const currentUser = await userModel.findById(currentUserId);
                    const unfollowUser = await userModel.findById(unfollowUserId);

                    if (unfollowUser.followers.includes(currentUserId)) {
                        await unfollowUser.updateOne({$pull: {followers: currentUserId}});
                        await currentUser.updateOne({$pull: {followings: unfollowUserId}});
                        res.status(200).json({
                            success: true,
                            message: 'User unfollowed',
                        });
                    } else {
                        res.status(403).json({
                            message: 'User is already unfollowed by you',
                            success: false,
                        });
                    }
                } catch (error) {
                    res.status(500).json({
                        message: 'error in server side' + error.message,
                        success: false,
                    });
                }
            }
        } else {
            res.status(404).json({
                message: 'Requested function page not found',
                success: false,
            });
        }
    }
}

module.exports = new UserController();
