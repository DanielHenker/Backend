// 1. Importar las dependencias necesarias
import mongoose from 'mongoose';

// 2. Crear el esquema de citas (agenda del consultorio)
const appointmentSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // hace referencia al modelo de usuarios
        required: true
    },
    service: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product', // hace referencia al modelo de servicios
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    status: {
        type: String,
        enum: ['pendiente', 'confirmada', 'cancelada', 'completada'],
        default: 'pendiente'
    },
    notes: {
        type: String
    }
});

// 3. Exportar el modelo
export const appointmentModel = mongoose.model('Appointment', appointmentSchema);