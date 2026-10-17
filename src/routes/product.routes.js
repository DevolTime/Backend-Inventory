import express from "express";
import {
    getProducts,
    createProduct,
    updateProduct,
    deleteProduct,
    getProductById,
    getProductsByCategory,
    getProductsByQR
} from "../controllers/product.controllers.js";

const router = express.Router();

// Get listar productos
router.get("/", getProducts);
// Post crear producto
router.post("/", createProduct);
// Get por categoría
router.get("/category/:category", getProductsByCategory);
// Get por código de barras (QR)
router.get("/qr/:qrcode", getProductsByQR);
// Get por ID
router.get("/:id", getProductById);
// Patch actualizar producto
router.patch("/:id", updateProduct);
// Delete eliminar producto
router.delete("/:id", deleteProduct);

export default router;
