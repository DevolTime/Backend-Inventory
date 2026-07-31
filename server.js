import express from "express";
import cors from "cors";
import dotenv from "dotenv";

// Conexión con MongoDB
import connectDB from "./src/config/config.db.js";

import employeeRoutes from "./src/routes/employee.Routes.js";
import inventoryRoutes from "./src/routes/inventory.routes.js";

dotenv.config();
connectDB();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Rutas
app.use("/api/empleados", employeeRoutes);
app.use("/api/inventario", inventoryRoutes);

// Ruta health
app.get("/api/health", (req, res) => {
    res.json({
        msg: "Backend Online"
    });
});

// Errores
app.use((err, req, res, next) => {
    res.status(500).json({
        msg: err.message
    });
});

app.listen(PORT, () => {
    console.log(`🚀 Backend running at http://localhost:${PORT}`);
});