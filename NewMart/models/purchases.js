const mongoose = require('mongoose');

const purchasesSchema = new mongoose.Schema({
    user: {
        type: String,
        required: true
    },
    items: [{
        product: {
            type: String,
            required: true
        },
        quantity: {
            type: Number,
            required: true,
            min: 1
        }
    }],
    total: {
        type: Number,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Purchases = mongoose.model('Purchases', purchasesSchema);

module.exports = Purchases;