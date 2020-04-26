/*
 * @author Gaurav Kumar
 */
const mongoose = require("mongoose");
const timestamp = require("mongoose-timestamp");

const guestSchema = mongoose.Schema({
    username: String,
    email: {
        type: String,
        unique: true,
        validate:{
            validator:function (v) {
                return /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/.test(v);
            },
            message: '{VALUE} is not a valid email address!'
        }
    },
    mobile: {
        type: String,
        unique: true,
        validate: {
            validator: function(v) {
                return /\d{3}-\d{3}-\d{4}/.test(v);
            },
            message: '{VALUE} is not a valid phone number!'
        },
    },
    token: String,
    verifiedToken:String
});
guestSchema.plugin(timestamp);
const Guest = mongoose.model("Guest", guestSchema);

module.exports = Guest;
