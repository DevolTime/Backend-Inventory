import {
    validateProductExistsAndHasStock,
    calculateFinalPrice,
    sellProduct,
    createSale
} from "../services/checkout.services.js";

export const sell = async (req, res) => {
    try {
        const { productId, quantity, taxes } = req.body;

        const product = await validateProductExistsAndHasStock({ id: productId });

        const finalPrice = calculateFinalPrice(product, quantity, taxes);

        await sellProduct(productId, quantity, taxes);

        const sale = await createSale({
            productId,
            quantity,
            finalPrice,
            taxes,
            date: new Date()
        });

        res.status(201).json({
            msg: "Venta realizada exitosamente",
            sale
        });

    } catch (err) {
        res.status(400).json({
            msg: err.message
        });
    }
};