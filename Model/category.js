const mongoose = require('mongoose');

const categorySchema = mongoose.Schema({

    name:{
        type:String,
        require:true
    },
    icon:{
        type:String,
        
    },

    color:{
        type:String,
        
    },

    price: {
        type:Number,
        default:0

    },



})

exports.Category = mongoose.model('Category', categorySchema);
