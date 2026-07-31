import EmployeeModel from "../models/employee.models.js";
import { calculateAttendance } from "../utils/attendance.utils.js";

// Metodos de servicio(Consulta a MongoDB)
const dbCreateEmployee = async (newEmployee) => {
    return await EmployeeModel.create(newEmployee);
};

// Obtener listado de empleados
const dbGetEmployee = async () => {
    return await EmployeeModel.find();
};

// Eliminar empleado
const dbDeleteEmployee = async (id) => {
    return await EmployeeModel.findByIdAndDelete(id);
};

// Actualizar empleados con id
const dbUpdateEmployee = async (id, inputData) => {
    return await EmployeeModel.findByIdAndUpdate(id, inputData, { returnDocument: 'after', runValidators: true });
};

// Obtener un empleado por su id
const dbGetEmployeeById = async (id) => {
    return await EmployeeModel.findById(id);
};

// Registrar hora del empleado
const dbRegisterAttendance = async (attendanceData) => {

    const {
        employeeId,
        entry_time,
        lunch_out_time,
        lunch_in_time,
        exit_time,
        late_time
    } = attendanceData;

    const employee = await EmployeeModel.findOne({ employeeId });

    if (!employee) {
        throw new Error("Empleado no encontrado");
    }

    employee.attendanceHistory.push({
        date: new Date(),
        entry_time,
        lunch_out_time,
        lunch_in_time,
        exit_time,
        late_time
    });

    const { totalHours, lateHours } =
        calculateAttendance(employee.attendanceHistory);

    employee.total_work_hours = totalHours;
    employee.late_total_hours = lateHours;

    await employee.save();

    return employee;
};


export {
    dbCreateEmployee,
    dbGetEmployee,
    dbDeleteEmployee,
    dbUpdateEmployee,
    dbGetEmployeeById,
    dbRegisterAttendance
};