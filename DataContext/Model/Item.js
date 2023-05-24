const mongoose = require('mongoose');
const Models_Shema = mongoose.Schema({
    Model_name:{
        type:String,
        required:true
    },
    Creator_Name:{
        type:String,
        required:true
    },
    ModelFile_Name:{
        type:String,
        required:true
    },
    ThumbNail_Name:{
        type:String,
        required:true
    },
    dateCreated: {
        type: Date,
        required: true
      }
})
const Model = mongoose.model('Model',Models_Shema)
module.exports = Model;