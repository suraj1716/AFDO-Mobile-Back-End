const mongoose= require('mongoose');


const liveStreamSchema=mongoose.Schema({


    name:{
        type:String,
        required:true,
        
    },


    description: {
        type:String,
        required:true

    },

    streamUrl:{
        type: String,
        default:''
    }
    
    ,

    image: {
        type:String,
         default:''

    },

    passcode: {
        type:String,
         default:''

    },
    date: {
        type:String,
        default:''
    },
time: {
        type:String,
        default:''
    },

    dateCreated: {
        type:Date,
        default:Date.now
    },

})

liveStreamSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

liveStreamSchema.set('toJSON', {
    virtuals: true,
});

exports.LiveStream=mongoose.model('LiveStream', liveStreamSchema);