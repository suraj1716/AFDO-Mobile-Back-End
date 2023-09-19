const mongoose = require('mongoose');

const courseSchema = mongoose.Schema({

    name:{
        type:String,
        require:true
    },
 

    price: {
        type:Number,
        

    },

    description: {
        type:String,
        
       
    },

    
    dateCreated: {
        type:Date,
        default:Date.now
    },



})


courseSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

courseSchema.set('toJSON', {
    virtuals: true,
});

exports.Course = mongoose.model('Course', courseSchema);
