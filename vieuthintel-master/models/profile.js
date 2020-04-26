/*
 * @author Gaurav Kumar
 */

const mongoose = require("mongoose");
const timestamp = require("mongoose-timestamp");

const profileSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    fullName: {
        type: String,
        required: true
    },
    fName: {
        type: String,
        required: true
    },
    lName: String,
    profilePicUrl: String,
    dob: Date,
    gender: {
        type: String,
        enum: ['male', 'female', 'other'],
        default: "male"
    },
    college: String,
    university: String,
    branch: String,
    degree: String,
    tags: [],
    globalRank: Number,
    tagsRank: [
        {
            tag: {
                type: mongoose.SchemaTypes.ObjectID,
                ref: 'Tag',
                required: true
            },
            rank: Number
        }
    ],
    contact: {
        email: String,
        mobile: {
            type: Number
        },
        address: {
            street: String,
            city: String,
            state: String,
            country: String
        }
    },
    website: String,
    bio: {
        type: String,
        maxLength: 255,
    },
    social: {
        twitter: String,
        linkedIn: String,
        facebook: String,
        github: String,
    },
    status: {
        type: String,
        default: "Not Verified"
    },
});

profileSchema.pre('save', function (next) {
    if (this.username === undefined) {
        let user_name = this.fName + "-" + this.lName + "-";
        user_name += Date.now().toString();
        this.username = user_name;
    }
    next();
});
profileSchema.plugin(timestamp);
const Profile = mongoose.model('Profile', profileSchema);

module.exports = Profile;
