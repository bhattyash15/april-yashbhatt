/*
 * @author Gaurav Kumar
 */

const mongoose = require('mongoose');
const timestamp = require('mongoose-timestamp');

const schema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    token:{
        type:String,
        required: true
    },
    expiresAt:{
        type:Date,
        default:Date.now()
    }
});

schema.plugin(timestamp);
const VerificationToken = mongoose.model('VerificationToken', schema);
module.exports = VerificationToken;
