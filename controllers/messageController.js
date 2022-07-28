const messageModel = require('../models/messageModel.js');

class MessageController {
    // [POST] message/
    async addMessage(req, res) {
        const {chatId, senderId, text} = req.body;
        const message = new messageModel({chatId, senderId, text});
        try {
            const result = await message.save();
            res.status(200).json({
                success: true,
                result: result,
            });
        } catch (error) {
            res.status(500).json({
                message: 'error in server side' + error.message,
                success: false,
            });
        }
    }

    // [GET] message/:chatId
    async getMessages(req, res) {
        const {chatId} = req.params;
        try {
            const messages = await messageModel.find({chatId: chatId});
            res.status(200).json({
                success: true,
                messages: messages,
            });
        } catch (error) {
            res.status(500).json({
                message: 'error in server side ' + error.message,
                success: false,
            });
        }
    }
}

module.exports = new MessageController();
