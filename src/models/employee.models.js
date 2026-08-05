import mongoose from 'mongoose';

const AttendanceDaySchema = new mongoose.Schema({
    date: {
        type: Date,
        required: true
        // Se guardará normalizado a medianoche (YYYY-MM-DD 00:00:00)
    },
    entry_time: { type: Date },
    lunch_out_time: { type: Date },
    lunch_in_time: { type: Date },
    exit_time: { type: Date },
    daily_late_minutes: { type: Number, default: 0 }, // Minutos tarde en este día específico
    daily_work_hours: { type: Number, default: 0 }    // Horas trabajadas en este día específico
});

const EmployeeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    employeeId: {
        type: String,
        required: true,
        unique: true
    },
    attendanceHistory: [AttendanceDaySchema], // Subdocumento embebido
    late_total_hours: { type: Number, default: 0 }, // Acumulado histórico (en horas)
    total_work_hours: { type: Number, default: 0 }  // Acumulado histórico (en horas)
}, {
    timestamps: true
});

const EmployeeModel = mongoose.model('Employee', EmployeeSchema);

export default EmployeeModel;
