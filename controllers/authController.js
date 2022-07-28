const userModel = require('../models/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

class AuthController {
    // [POST] auth/register
    async register(req, res) {
        const {username, password, email, firstname, lastname} = req.body;
        if (!username || !password || !email || !firstname || !lastname) {
            res.status(404).json({
                message: 'Incomplete information entered',
                success: false,
            });
        } else {
            try {
                const salt = await bcrypt.genSalt(10);
                const hashPassword = await bcrypt.hash(password, salt);

                const newUser = new userModel({
                    username,
                    password: hashPassword,
                    email,
                    firstname,
                    lastname,
                });

                const oldUser = await userModel.findOne({username: username});
                if (oldUser) {
                    res.status(400).json({
                        message: 'User is already resgisted',
                        success: false,
                    });
                } else {
                    const user = await newUser.save();
                    const token = jwt.sign(
                        {
                            username: user.username,
                            id: user._id,
                        },
                        process.env.JWT_KEY,
                        {expiresIn: '1h'},
                    );

                    res.status(200).json({
                        message: 'Resgister account successfully',
                        user: {
                            id: user._id,
                            username: newUser.username,
                            email: newUser.email,
                            firstname: newUser.firstname,
                            lastname: newUser.lastname,
                            profilePicture: user.profilePicture,
                            coverPicture: user.coverPicture,
                            about: user.about,
                            livesIn: user.livesIn,
                            worksAt: user.worksAt,
                            relationships: user.relationships,
                            followers: user.followers,
                            followings: user.followings,
                            address: user.address,
                        },
                        token: token,
                    });
                }
            } catch (error) {
                res.status(500).json({
                    message: 'error in server side' + error.message,
                    success: false,
                });
            }
        }
    }

    // [POST] auth/login
    async login(req, res) {
        const {username, password} = req.body;
        if (!username || !password) {
            res.status(404).json({
                message: 'Missing username or password',
                success: false,
            });
        } else {
            try {
                const user = await userModel.findOne({username: username});
                if (user) {
                    const validity = await bcrypt.compare(password, user.password);
                    if (validity) {
                        const token = jwt.sign(
                            {
                                username: user.username,
                                id: user._id,
                            },
                            process.env.JWT_KEY,
                            {expiresIn: '1h'},
                        );

                        res.status(200).json({
                            message: 'Login successfully',
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
                                relationships: user.relationships,
                                followers: user.followers,
                                followings: user.followings,
                                address: user.address,
                            },
                            token: token,
                        });
                    } else {
                        res.status(404).json({
                            message: 'Wrong username or password',
                            success: false,
                        });
                    }
                } else {
                    res.status(404).json({
                        message: 'Wrong username or password',
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
    }
}

module.exports = new AuthController();
