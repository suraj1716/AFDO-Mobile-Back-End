const mongoose= require('mongoose');


const chapterSchema=mongoose.Schema({

    name:{
        type:String,
        required:true,
        
    },

    course:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
        reuired:true
    },


    description: {
        type:String,
        required:true

    },

    YoutubeUrl:{
        type: String,
        default:""
    }
    
    ,

    thumbnail:{
        type: String,
        default:""
    }
    
    ,

    video: {
        type:String,
        default:''

    },
    image: {
        type:String,
         default:''

    },

    dateCreated: {
        type:Date,
        default:Date.now
    },

})

chapterSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

chapterSchema.set('toJSON', {
    virtuals: true,
});

exports.Chapter=mongoose.model('Chapter', chapterSchema);