/*
 * @author Gaurav Kumar
 */

const mongoose = require('mongoose');
const timestamp = require('mongoose-timestamp');
const mongoosePaginate = require('mongoose-paginate-v2');

const projectSchema = mongoose.Schema({
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
    isPaid:{
        type:Boolean,
        default:false
    },
    type:String,
    titleType:String,
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    }
});

projectSchema.plugin(timestamp);
projectSchema.plugin(mongoosePaginate);
const Project = mongoose.model('Project', projectSchema);
module.exports = Project;
