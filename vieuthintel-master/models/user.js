/*
 * @author Gaurav Kumar
 */
const mongoose = require("mongoose");
const timestamp = require("mongoose-timestamp");
const mongoosePaginate = require('mongoose-paginate-v2');

const userSchema = mongoose.Schema({
    // username: {
    //     type: String,
    //     unique: true
    // },
    email: {
        type: String,
        unique: true,
        validate: {
            validator: function (v) {
                return /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/.test(v);
            },
            message: '{VALUE} is not a valid email address!'
        }
    },
    mobile: {
        type: String,
        validate: {
            validator: function (v) {
                return /\d{3}-\d{3}-\d{4}/.test(v);
            },
            message: '{VALUE} is not a valid phone number!'
        },
    },
    password: {
        type: String,
        required: true
    },
    enabled: {
        type: Boolean,
        default: false,
        required: true
    },
    verified: {
        type: Boolean,
        default: false
    },
    verificationToken: String,
    is_active: {
        type: mongoose.Schema.Types.Boolean,
        default: true,
    },
    lastLoginAt: {
        type: mongoose.Schema.Types.Date,
        default: new Date()
    },
    profile: {
        type: mongoose.Schema.Types.ObjectID,
        ref: 'Profile'
    },
    role: {
        type: String,
        enum: ['student', 'company', 'admin', 'super_admin'],
        default: 'student'
    },
});

userSchema.plugin(timestamp);
userSchema.plugin(mongoosePaginate);
const User = mongoose.model("User", userSchema);

module.exports = User;
