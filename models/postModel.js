const mongoose = require('mongoose');

const PostSchema = mongoose.Schema(
    {
        userId: {
            type: String,
            required: true,
        },
        liked: {
            type: Array,
            default: [],
        },
        description: {
            type: String,
            required: true,
        },
        image: {
            type: String,
        },
    },
    {timestamps: true},
);

module.exports = mongoose.model('posts', PostSchema);
