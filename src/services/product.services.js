import Product from "../models/product.models.js";

// Crear Producto
const dbCreateProduct = async (productData) => {
    // validacion: no se pude tener stock < 0 o preioc < 0
    if (productData.stock < 0) {
        throw new Error('stock no puede ser negativo');
    }
    if (productData.sellingPrice < 0) {
        throw new Error('Precio no puede ser negativo');
    }

    // validacion qrCode debe ser unico
    const existingProduct = await Product.findOne({
        qrCode:
            productData.qrCode
    });
    if (existingProduct) {
        throw new Error('Producto con este codigo de barras ya existe');
    }

    // Validación: categoría debe estar en lista
    const validCategories = ['Electrónico', 'Alimentos', 'Ropa', 'Libros', 'Otros'];
    if (!validCategories.includes(productData.category)) {
        throw new Error('Categoria inválida');
    }


    // Validacion: impuestos debe estar en lista
    const validTaxes = ['IVA_0', 'IVA_5', 'IVA_19', 'IMPUESTO_CONSUMO_8'];
    if (!validTaxes.some(tax => productData.taxes?.some(t => t.taxName === tax))) {
        throw new Error('Tipo de impuesto no válido');
    }

    // Validación: producto debe poder venderse en POS (canBeSoldAtPos = true)
    if (productData.canBeSoldAtPos === false) {
        throw new Error('Este producto no se puede vender en POS')
    }

    const product = new Product({
        qrCode: productData.qrCode,
        name: productData.name,
        sellingPrice: productData.sellingPrice,
        costPrice: productData.costPrice || 0,
        category: productData.category,
        minStock: productData.minStock || 0,
        stock: productData.stock,
        isActive: productData.isActive ?? true,
        canBeSoldAtPos: productData.canBeSoldAtPos ?? true,
        taxes: productData.taxes || [],
        createdBy: productData.createdBy || 'System',
        createdAt: new Date()
    });
    return await product.save();
};

// obtener todos los productos
const dbGetProduct = async () => {
    return await Product.find({ isActive: true });
};

// Obtener productos por ID
const dbGetProductById = async (id) => {
    return await Product.findById(id);
};

// Elimiar producto
const dbDeleteProduct = async (id) => {
    return await Product.findByIdAndDelete(id);
};

// Actualizar producto
const dbUpdateProduct = async (id, updates) => {
    return await Product.findByIdAndUpdate(id, updates, { returnDocument: 'after', runValidators: true });
};

// Obtener productos por categoría
const dbGetProductsByCategory = async (category) => {
    return await Product.find({ category, isActive: true });
};

// Obtener producto por código de barras
const dbGetProductsByQR = async (qrCode) => {
    return await Product.findOne({ qrCode, isActive: true });
};

export {
    dbCreateProduct,
    dbGetProduct,
    dbDeleteProduct,
    dbUpdateProduct,
    dbGetProductById,
    dbGetProductsByCategory,
    dbGetProductsByQR
};