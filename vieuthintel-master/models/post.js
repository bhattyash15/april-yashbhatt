/*
 * @author Gaurav Kumar
 */

const mongoose = require('mongoose');
const timestamp = require('mongoose-timestamp');
const Tag = require('./tag');

const postSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    body: String,
    tags: [Tag],
    images: [String],
    score: Number
});

postSchema.plugin(timestamp);
const Post = mongoose.model('Post', postSchema);
module.exports = Post;
