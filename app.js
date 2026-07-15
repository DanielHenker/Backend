// 1. importar las dependencias necesarias
import express from 'express'
import dotenv from 'dotenv'
import { connectionMongo } from './src/config/dataBase.js'


// 2. crear las configuraciones necesarias para el servidor
const app = express() //llamar a express para crear la aplicación
dotenv.config() // permite llamar las variables de entorno de .env
let port = process.env.PORT;
connectionMongo() //llamar a la función para conectar a la base de datos



// 3. crear las rutas necesarias para el servidor
app.get('/', (req, res) => {
  res.send('Holaa nuestro back funciona')
})


// 4. levantar el servidor
app.listen(port, () => {
  console.log(`El servidor se está ejecutando en http://localhost:${port}`)
})
