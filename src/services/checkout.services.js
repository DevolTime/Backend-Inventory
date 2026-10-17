import Product from "../models/product.models.js";
import Sale from "../models/sale.models.js";

// Validar que el producto exista y tenga stock >= 1
const validateProductExistsAndHasStock = async (productData) => {
    const product = await Product.findById(productData.id);

    if (!product) {
        throw new Error('Producto no encontrado')
    };

    if (product.stock < 1) {
        throw new Error('Producto sin stock disponible')
    };
    return product;
};

// Calcular el precio final (incluyendo impuestos)
const calculateFinalPrice = (product, quantity, taxes = []) => {
    let total = product.sellingPrice * quantity;

    taxes.forEach(tax => {
        const productTax = product.taxes.find(t => t.taxName === tax.taxName);
        if (!productTax) {
            throw new Error(`El impuesto ${tax.taxName} no está configurado para este producto`);
        }
        if (tax.taxRate !== productTax.taxRate) {
            throw new Error(`La tasa del impuesto ${tax.taxName} no coincide con la del producto`);
        }
        total += total * tax.taxRate;
    });
    return total;
};

// Vender un producto (reducir stock y registrar venta)
const sellProduct = async (productId, quantity, taxes) => {
    const product = await Product.findById(productId)
    if (!product) {
        throw new Error('Producto no encontrado')
    }
    if (product.stock < quantity) {
        throw new Error('Stock insuficiente')
    }

    // Reducir stock
    await Product.findByIdAndUpdate(productId, { stock: product.stock - quantity });

    // Calcular precio final
    const finalPrice = calculateFinalPrice(product, quantity, taxes)

    return {
        productId,
        quantity,
        finalPrice,
        taxes,
        product
    }
}

// Guardar la venta en la base de datos
const createSale = async (saleData) => {
    const sale = new Sale({ ...saleData })
    await sale.save();
    return sale;
}

export {
    validateProductExistsAndHasStock,
    calculateFinalPrice,
    sellProduct,
    createSale
};