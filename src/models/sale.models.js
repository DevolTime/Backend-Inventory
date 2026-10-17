import { Schema, model } from "mongoose";

const SaleSchema = new Schema({
    productId: {
        type: String,
        required: true,
        index: true
    },
    quantity: {
        type: Number,
        required: true,
        min: 1
    },
    finalPrice: {
        type: Number,
        required: true
    },
    taxes: [{
        taxName: {
            type: String,
            enum: ['IVA_0', 'IVA_5', 'IVA_19', 'IMPUESTO_CONSUMO_8'],
            required: true
        },
        taxRate: {
            type: Number,
            min: 0,
            required: true
        }
    }],
    date: {
        type: Date,
        default: Date.now
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

const Sale = model('Sale', SaleSchema);

export default Sale;