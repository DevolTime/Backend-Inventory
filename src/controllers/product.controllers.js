import {
    dbCreateProduct,
    dbDeleteProduct,
    dbGetProduct,
    dbGetProductById,
    dbGetProductsByCategory,
    dbGetProductsByQR,
    dbUpdateProduct
} from "../services/product.services.js";

// Listar productos
export const getProducts = async (req, res) => {
    try {
        const products = await dbGetProduct();
        res.json({
            msg: 'Lista de productos',
            products
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            msg: 'Error al listar los productos',
            error: err.message
        });
    }
};

// Crear producto
export const createProduct = async (req, res) => {
    try {
        const product = await dbCreateProduct(req.body);
        res.status(201).json({
            msg: 'Producto creado exitosamente',
            product
        });
    } catch (err) {
        res.status(400).json({
            msg: 'Error al crear producto',
            error: err.message
        });
    }
};

// Actualizar producto
export const updateProduct = async (req, res) => {
    try {
        const product = await dbUpdateProduct(req.params.id, req.body);
        if (!product) {
            return res.status(404).json({
                msg: 'Producto no encontrado'
            });
        }
        res.status(200).json({
            msg: 'Producto actualizado',
            product
        });
    } catch (err) {
        res.status(400).json({
            msg: 'Error al actualizar el producto',
            error: err.message
        });
    }
};

// Eliminar producto
export const deleteProduct = async (req, res) => {
    try {
        const product = await dbDeleteProduct(req.params.id);
        if (!product) {
            return res.status(404).json({
                msg: 'Producto no encontrado'
            });
        }
        res.status(200).json({
            msg: 'Producto eliminado exitosamente'
        });
    } catch (err) {
        res.status(500).json({
            msg: 'Error al eliminar el producto',
            error: err.message
        });
    }
};

// Obtener producto por ID
export const getProductById = async (req, res) => {
    try {
        const product = await dbGetProductById(req.params.id);
        if (!product) {
            return res.status(404).json({
                msg: 'Producto no encontrado'
            });
        }
        res.json(product);
    } catch (err) {
        res.status(500).json({
            msg: err.message
        });
    }
};

// Obtener productos por categoría
export const getProductsByCategory = async (req, res) => {
    try {
        const products = await dbGetProductsByCategory(req.params.category);
        res.json(products);
    } catch (err) {
        res.status(500).json({
            msg: err.message
        });
    }
};

// Obtener producto por código QR
export const getProductsByQR = async (req, res) => {
    try {
        const product = await dbGetProductsByQR(req.params.qrcode);
        if (!product) {
            return res.status(404).json({
                msg: 'Producto no encontrado'
            });
        }
        res.json(product);
    } catch (err) {
        res.status(500).json({
            msg: err.message
        });
    }
};
