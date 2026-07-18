// 1. Importar las dependencias necesarias
import mongoose from 'mongoose';

// 2. Crear el esquema de usuario
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['admin', 'usuario'],
        default: 'usuario'
    }
});

// 3. Exportar el modelo
export default mongoose.model('User', userSchema);

