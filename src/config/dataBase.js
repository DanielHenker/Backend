// 1. Importar las dependencias necesarias
import mongoose from 'mongoose';
import dns from 'node:dns';

// Fix: forzar DNS público porque el DNS local no resolvía el SRV de Atlas
dns.setServers(['8.8.8.8', '1.1.1.1']);


// 2. Establecer la conexión con la base de datos

export async function connectionMongo() {

    // Manejo de errores
    try {
        await mongoose.connect(process.env.URI_MONGO)
        console.log('Conexión exitosa a la base de datos');

    } catch (error) {
        console.error('Error al conectar a la base de datos:', error);
    }
    
}