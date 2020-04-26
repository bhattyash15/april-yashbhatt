/*
 * @author Gaurav Kumar
 */

const mongoose = require('mongoose');
const timestamp = require('mongoose-timestamp');

const tagSchema = mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    weight:{
        type:Number,
        required: true
    }
});

tagSchema.plugin(timestamp);
const Tag = mongoose.model('Tag', tagSchema);
module.exports = Tag;
