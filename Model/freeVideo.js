const mongoose= require('mongoose');


const freeVideoSchema=mongoose.Schema({

    name:{
        type:String,
        required:true,
        
    },

    description: {
        type:String,
        required:true

    },

    video: {
        type:String,
        default:''

    },
    image: {
        type:String,

    },

    dateCreated: {
        type:Date,
        default:Date.now
    },

})

freeVideoSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

freeVideoSchema.set('toJSON', {
    virtuals: true,
});

exports.FreeVideo=mongoose.model('FreeVideo', freeVideoSchema);