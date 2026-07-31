import mongoose from 'mongoose';


// Servicio employee
import {
    dbCreateEmployee,
    dbGetEmployee,
    dbDeleteEmployee,
    dbUpdateEmployee,
    dbGetEmployeeById,
    dbRegisterAttendance
} from '../services/employee.sevices.js'

// Listar empleados
const getEmployee = async (req, res) => {
    try {
        const empleados = await dbGetEmployee();
        res.json({
            msg: 'Lista empleados',
            empleados
        });
    } catch (err) {
        res.status(500).json({
            msg: 'No se pudo encontrar al empleado'
        });
    }
}

// Crear empleado
const createEmployee = async (req, res) => {
    try {
        const employee = await dbCreateEmployee(req.body)
        res.status(201).json({
            msg: 'Crear empleados', employee
        });
    } catch (err) {
        res.status(400).json({
            msg: 'No se pudo crear el empleado',
            error: err.message
        });
    }
}

const getEmployeeById = async (req, res) => {
    try {
        const id = req.params.id;
        //validacion defenciva del parametro
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                msg: 'Id inválido'
            });
        }
        const data = await dbGetEmployeeById(id);
        if (!data) {
            return res.status(400).json({
                msg: 'No se puede buscar el Empleado ya que no se encuentra registrado'
            })
        }
        res.json({
            msg: 'Obtiene el empleado por id',
            data: data
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            msg: 'No se pudo encontrar al empleado'
        })
    }
}

const updateEmployee = async (req, res) => {
    try {
        const id = req.params.id;

        const employee = await dbUpdateEmployee(id, req.body);
        if (!employee) {
            return res.status(400).json({
                msg: 'Empleado no encontrado'
            });
        }
        res.json(employee);
    } catch (err) {
        res.status(400).json({
            msg: err.message
        });
    }
}

const deleteEmployee = async (req, res) => {
    try {
        const employee = await dbDeleteEmployee(req.params.id);
        if (!employee) {
            return res.status(404).json({
                msg: "Empleado no encontrado"
            });
        }
        res.json({
            msg: "Empleado eliminado exitosamente"
        });
    }
    catch (err) {
        res.status(500).json({
            msg: err.message
        });
    }
}

const registerAttendance = async (req, res) => {
    try {
        const employee = await dbRegisterAttendance(req.body)
        res.json({
            msg: 'Horas registradas exitosamente',
            employee
        })
    } catch (err) {
        res.status(500).json({
            msg: 'Hubo un problema al registrar la hora',
            error: err.message
        })
    }
}

export {
    getEmployee,
    createEmployee,
    updateEmployee,
    deleteEmployee,
    getEmployeeById,
    registerAttendance
}