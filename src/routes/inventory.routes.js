// backend/routes/inventory.routes.js
import express from 'express';
import ProductsM from '../models/product.models.js';

const router = express.Router();

// GET lista de productos
router.get('/', async (req, res) => {
    try {
        const products = await ProductsM.find();
        res.json(products);
    } catch (err) {
        res.status(500).json({ msg: err.message });
    }
});

// POST Crear producto
router.post('/', async (req, res) => {
    try {
        const product = new ProductsM(req.body);
        await product.save();
        res.status(201).json(product);
    } catch (err) {
        res.status(400).json({ msg: err.message });
    }
});

// PATCH Actualizar producto
router.patch('/:id', async (req, res) => {
    try {
        const product = await ProductsM.findByIdAndUpdate(
            req.params.id,
            req.body,
            { returnDocument: "after", runValidators: true }
        );

        if (!product) {
            return res.status(404).json({ msg: 'Producto no encontrado' });
        }

        res.status(200).json({ msg: 'Producto actualizado', product });
    } catch (err) {
        res.status(400).json({ msg: err.message });
    }
});

// DELETE Borrar producto
router.delete('/:id', async (req, res) => {
    try {
        const product = await ProductsM.findByIdAndDelete(req.params.id);
        res.status(200).json({ msg: 'Producto eliminado exitosamente' });
    } catch (err) {
        res.status(500).json({ msg: err.message });
    }
});

export default router;
