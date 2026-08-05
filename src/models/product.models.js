// src/models/product.models.js
import { Schema, model } from 'mongoose';

const productSchema = new Schema({
    qrCode: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    name: {
        type: String,
        required: true
    },
    sellingPrice: {
        type: Number,
        required: true,
        min: 0
    },
    costPrice: {
        type: Number,
        min: 0,
        default: 0
    },
    category: {
        type: String,
        enum: ['Electrónico', 'Alimentos', 'Ropa', 'Libros', 'Otros'],
        required: true
    },
    minStock: {
        type: Number,
        min: 0,
        default: 0
    },
    stock: {
        type: Number,
        required: true,
        min: 0
    },
    isActive: {
        type: Boolean,
        default: true
    },
    canBeSoldAtPos: {
        type: Boolean,
        default: true
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
    createdBy: {
        type: String,
        default: 'System'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

const Product = model('Product', productSchema);

export default Product;
