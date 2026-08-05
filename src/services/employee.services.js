import EmployeeModel from "../models/employee.models.js";
import { calculateAttendance } from "../utils/attendance.utils.js";

// Metodos de servicio (Consulta a MongoDB)
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

// Registrar hora del empleado (Versión Optimizada para Date)
const dbRegisterAttendance = async (attendanceData) => {
    const { employeeId } = attendanceData;
    if (!employeeId) throw new Error("El employeeId es requerido.");

    // 1. Buscar al empleado por su ID único de negocio
    const employee = await EmployeeModel.findOne({ employeeId });
    if (!employee) {
        throw new Error("Empleado no encontrado");
    }

    const now = new Date();
    // Normalizar la fecha a las 00:00:00 del día actual para comparar fechas de forma limpia
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    // 2. Buscar si ya existe un registro de asistencia para el día de hoy
    let todayRecord = employee.attendanceHistory.find(
        (record) => new Date(record.date).getTime() === today.getTime()
    );

    let actionLabel = "";

    // 3. Máquina de estados secuencial basada en la presencia de campos vacíos
    if (!todayRecord) {
        // CASO 1: Entrada Principal
        todayRecord = {
            date: today,
            entry_time: now,
            lunch_out_time: null,
            lunch_in_time: null,
            exit_time: null,
            daily_late_minutes: 0,
            daily_work_hours: 0
        };

        // Lógica para calcular minutos tarde (Ejemplo: Entrada después de las 09:00 AM)
        const entryLimit = new Date(today);
        entryLimit.setHours(9, 0, 0, 0); 
        if (now > entryLimit) {
            const diffMs = now - entryLimit;
            todayRecord.daily_late_minutes = Math.round(diffMs / (1000 * 60));
        }

        employee.attendanceHistory.push(todayRecord);
        // Rescatamos la referencia directa dentro del arreglo de Mongoose para aplicar los cálculos posteriores
        todayRecord = employee.attendanceHistory[employee.attendanceHistory.length - 1];
        actionLabel = "Entrada principal registrada";
    } 
    else if (!todayRecord.lunch_out_time) {
        // CASO 2: Salida al Almuerzo
        todayRecord.lunch_out_time = now;
        actionLabel = "Salida a almuerzo registrada";
    } 
    else if (!todayRecord.lunch_in_time) {
        // CASO 3: Regreso del Almuerzo
        if (now < todayRecord.lunch_out_time) throw new Error("La hora de regreso no puede ser menor a la de salida.");
        todayRecord.lunch_in_time = now;
        actionLabel = "Regreso de almuerzo registrado";
    } 
    else if (!todayRecord.exit_time) {
        // CASO 4: Salida del Trabajo (Fin de jornada)
        if (now < todayRecord.lunch_in_time) throw new Error("La hora de salida no puede ser menor a la de regreso de almuerzo.");
        todayRecord.exit_time = now;
        actionLabel = "Salida de jornada registrada. Día finalizado.";
    } 
    else {
        // CASO 5: Bloqueo de jornada llena
        throw new Error("Ya has completado todos los registros de asistencia por el día de hoy.");
    }

    // 4. Calcular acumulados y procesar el registro actual
    const { totalHours, lateHours, dailyHours } = calculateAttendance(employee.attendanceHistory, todayRecord);

    // Asignar el cálculo neto de horas del día al subdocumento actual
    todayRecord.daily_work_hours = dailyHours;

    // Actualizar acumulados históricos globales del empleado
    employee.total_work_hours = totalHours;
    employee.late_total_hours = lateHours;

    // 5. Persistir los cambios en la base de datos
    await employee.save();

    // Retornamos el objeto compuesto que requiere la desestructuración de tu controlador
    return {
        employee,
        attendanceDetails: {
            action: actionLabel,
            record: todayRecord
        }
    };
};

export {
    dbCreateEmployee,
    dbGetEmployee,
    dbDeleteEmployee,
    dbUpdateEmployee,
    dbGetEmployeeById,
    dbRegisterAttendance
};
