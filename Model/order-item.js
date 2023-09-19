const mongoose = require('mongoose');

const orderItemSchema = mongoose.Schema({
    quantity: {
        type: Number,
        required: true
    },

    course: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Course'
        },
    
    // product: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'Product'
    // },

    // chapter: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'Chapter'
    // }
})

exports.OrderItem = mongoose.model('OrderItem', orderItemSchema);