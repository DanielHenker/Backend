// 1. Importar las dependencias necesarias
import mongoose from 'mongoose';

// 2. Crear el esquema de servicio/producto
const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    image: {
        type: String
    },
    active: {
        type: Boolean,
        default: true
    }
});

// 3. Exportar el modelo
export default mongoose.model('Product', productSchema);