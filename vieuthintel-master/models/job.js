/*
 * @author Gaurav Kumar
 */

const mongoose = require('mongoose');
const timestamp = require('mongoose-timestamp');

const jobSchema = mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    body:String,
    start:{
        type:Date,
        default:Date.now()
    },
    end:{
        type:Date,
        default:Date.now()
    },
    apply:String,
    url:String,
    extra:String,
    publish:{
        type:Boolean,
        default:true
    },
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    }
});

jobSchema.plugin(timestamp);
const Job = mongoose.model('Job', jobSchema);
module.exports = Job;
