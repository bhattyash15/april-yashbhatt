/*
 * @author Gaurav Kumar
 */

const mongoose = require('mongoose');
const timestamp = require('mongoose-timestamp');

const companySchema = mongoose.Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    fullName:{
        type:String,
        required:true
    },
    profilePicUrl: String,
    website: String,
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
    social: {
        twitter: String,
        linkedIn: String,
        facebook: String,
        github: String,
    },
    status: {
        type: String,
        default: "Not Verified"
    }
});

companySchema.plugin(timestamp);

const Company = mongoose.model('Company', companySchema);
module.exports = Company;
