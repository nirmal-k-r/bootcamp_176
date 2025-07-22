const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    // id: {
    //     type: Number,
    //     required: true,
    //     unique: true
    // },
    name: {
        type: String,
        required: true,
        unique: true
    },
    description: String,
    price: Number,
    category: String,
    stock: Number,
    sale:{
        type: Boolean,
        default: true
    },
    image: String
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;