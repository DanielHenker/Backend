// 1. Importar las dependencias necesarias
import mongoose from 'mongoose';
import dns from 'node:dns';

// Fix: forzar DNS público porque el DNS local no resolvía el SRV de Atlas
dns.setServers(['8.8.8.8', '1.1.1.1']);

const MAX_INTENTOS = 5;
const ESPERA_ENTRE_INTENTOS_MS = 5000;

// 2. Establecer la conexión con la base de datos, con reintentos automáticos
// si el primer intento falla (por ejemplo, por un problema momentáneo de red
// o de resolución DNS). Antes, si esto fallaba una sola vez, el servidor se
// quedaba sin conexión hasta reiniciarlo manualmente.
export async function connectionMongo(intento = 1) {
    try {
        await mongoose.connect(process.env.URI_MONGO, {
            serverSelectionTimeoutMS: 10000 // no esperar indefinidamente si Atlas no responde
        });
        console.log('Conexión exitosa a la base de datos');
    } catch (error) {
        console.error(`Error al conectar a la base de datos (intento ${intento} de ${MAX_INTENTOS}):`, error.message);

        if (intento < MAX_INTENTOS) {
            console.log(`Reintentando conexión en ${ESPERA_ENTRE_INTENTOS_MS / 1000} segundos...`);
            setTimeout(() => connectionMongo(intento + 1), ESPERA_ENTRE_INTENTOS_MS);
        } else {
            console.error('No se pudo conectar a la base de datos después de varios intentos. Revisa la URI, las credenciales o la lista de IPs permitidas en MongoDB Atlas.');
        }
    }
}

// Si la conexión llega a caerse después de haberse establecido con éxito
// (por ejemplo, por una interrupción momentánea de red), dejamos registro
// de ello para poder diagnosticarlo con facilidad.
mongoose.connection.on('disconnected', () => {
    console.warn('Se perdió la conexión con la base de datos.');
});

mongoose.connection.on('reconnected', () => {
    console.log('Conexión a la base de datos restablecida.');
});
