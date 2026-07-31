import mongoose from 'mongoose';

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
    attendanceHistory: [{
        date: {
            type: Date,
            required: true
        },
        entry_time: {
            type: String
        },
        lunch_out_time: {
            type: String
        },
        lunch_in_time: {
            type: String
        },
        exit_time: {
            type: String
        },
        late_time: {
            type: String
        }
    }],
    late_total_hours: { type: Number, default: 0 },
    total_work_hours: { type: Number, default: 0 }
}, {
    timestamps: true
});

const EmployeeModel = mongoose.model('Employee', EmployeeSchema);

export default EmployeeModel;
