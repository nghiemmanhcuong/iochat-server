const mongoose = require('mongoose');

const ChatSchema = mongoose.Schema(
    {
        members: {
            type: Array,
        },
    },
    {
        timestamps: true,
    },
);

module.exports = mongoose.model('chats', ChatSchema);
