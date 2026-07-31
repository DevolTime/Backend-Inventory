import express from "express";
import { createEmployee, deleteEmployee, getEmployee, getEmployeeById, registerAttendance, updateEmployee } from "../controllers/employee.controllers.js";

// Importacion de controlladores

const router = express.Router();

// Post Registrar hora del empleado
router.post("/attendance", registerAttendance);

// Get Obtener lista de empleados
router.get("/", getEmployee);
// Post Crear empleados
router.post("/", createEmployee);

// Get Buscar por id
router.get("/:id", getEmployeeById)
// Patch Actualizar empleado
router.patch("/:id", updateEmployee);
// Delete Borrar empleado
router.delete("/:id", deleteEmployee);

export default router;