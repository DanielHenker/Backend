// 1. importar las dependencias necesarias
import express from 'express'
import dotenv from 'dotenv'
import { connectionMongo } from './src/config/dataBase.js'
import { userRouter } from './src/routes/users.routes.js'
import { productsRouter } from './src/routes/products.routes.js'
import { appointmentsRouter } from './src/routes/appointments.routes.js'

// 2. crear las configuraciones necesarias para el servidor
const app = express() //llamar a express para crear la aplicación
dotenv.config() // permite llamar las variables de entorno de .env
let port = process.env.PORT;
connectionMongo() //llamar a la función para conectar a la base de datos
app.use(express.json()) // permite que el servidor entienda los datos en formato JSON


// 3. crear las rutas necesarias para el servidor
app.get('/', (req, res) => {
  res.send('Holaa nuestro back funciona')
})

app.use('/usuarios', userRouter)
app.use('/productos', productsRouter)
app.use('/citas', appointmentsRouter)

// 4. levantar el servidor
app.listen(port, () => {
  console.log(`El servidor se está ejecutando en http://localhost:${port}`)
})
