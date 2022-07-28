const chatModel = require('../models/chatModel.js');

class ChatController {
    // [POST] chat/
    async createChat(req, res) {
        const newChat = new chatModel({
            members: [req.body.senderId, req.body.receicerId],
        });
        try {
            const chat = await chatModel.find({
                $and:[
                    {members: {$in: [req.body.senderId]}},
                    {members: {$in: [req.body.receicerId]}}
                ]
            });
            if (chat.length > 0) {
                res.status(200).json({
                    success: true,
                    isChat: true,
                });
            } else {
                const result = await newChat.save();
                res.status(200).json({
                    result: result,
                    success: true,
                });
            }
        } catch (error) {
            res.status(500).json({
                message: 'error in server side' + error.message,
                success: false,
            });
        }
    }

    // [GET] chat/:userId
    async userChats(req, res) {
        try {
            const chat = await chatModel.find({
                members: {$in: [req.params.userId]},
            });
            res.status(200).json({
                success: true,
                chat: chat,
            });
        } catch (error) {
            res.status(500).json({
                message: 'error in server side' + error.message,
                success: false,
            });
        }
    }

    // [GET] chat/find
    async findChat(req, res) {
        try {
            const chat = await chatModel.findOne({
                members: {$all: [req.params.firstId, req.params.secondId]},
            });
            res.status(200).json({
                success: true,
                chat: chat,
            });
        } catch (error) {
            res.status(500).json({
                message: 'error in server side' + error.message,
                success: false,
            });
        }
    }
}

module.exports = new ChatController();
