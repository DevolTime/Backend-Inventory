import { Router } from "express";
import { dbCreateProduct, dbDeleteProduct, dbGetProduct, dbGetProductById, dbGetProductsByCategory, dbGetProductsByQR, dbUpdateProduct } from "../services/product.services.js";

const router = Router();

// Get listar productos
router.get('/', async (req, res) => {
    try {
        const products = await dbGetProduct();
        res.json({
            msg: 'Lista de productos',
            products
        })
    } catch (err) {
        console.error(500).json({
            msg: 'Error al listar los productos',
            error: err.message
        });

    }
})

// Post crear producto
router.post('/', async (req, res) => {
    try {
        const product = await dbCreateProduct(req.body);
        res.status(201).json({
            msg: 'Crear producto',
            product
        })
    } catch (err) {
        res.status(400).json({
            msg: ' error al crear producto',
            error: err.message
        })
    }
})

// Patch actualizar producto
router.patch('/:id', async (req, res) => {
    try {
        const product = await dbUpdateProduct(req.params.id, req.body);
        if (!product) {
            return res.status(404).json({
                msg: 'Producto no encontrado'
            })
        }
        res.status(200).json({
            msg: 'Producto actualizado'
        })
    } catch (err) {
        res.status(400).json({
            msg: 'Error al actualizar el producto',
            error: err.message
        })
    }
});

// Delete Eliminar categoria
router.delete('/:id', async(req, res)=>{
    try {
        const product = await dbDeleteProduct(req.params.id);
        if(!product){
            return res.status(404).json({
                msg: 'Producto no encontrado'
            })
        }
        res.status(200).json({
            msg: 'Producto eliminado exitosamente'
        })
    } catch (err) {
        res.status(500).json({
            msg: 'Error al eliminar el producto',
            error: err.message
        })
    }
})

// Get por ID, buscar por id
router.get('/id', async(req, res)=>{
    try {
        const product = await dbGetProductById(req.params.id);
        if (!product){
            return res.status(404).json({
                msg:'Producto no encontrado'
            })
        }
        res.json(product)
    } catch (err) {
        res.status(500).json({
            msg: err.message
        })
    }
})

// Get por categoria
router.get('/category/:category', async (req, res)=>{
    try {
        const product = await dbGetProductsByCategory(req.params.id);
        res.json(product)
    } catch (err) {
        res.status(500).json({
            msg: err.message
        })
    }
});

// Get por codigo de barra (QR)
router.get('/qr/:qrcode', async (req, res)=>{
    try {
        const product = await dbGetProductsByQR(req.params.qrcode);
        if (!product){
            res.status(404).json({
                msg: 'Producto no encontrado'
            })
        }
        res.json(product)
    } catch (err) {
        res.status(500).json({
            msg: err.message
        })
    }
})

export default router;