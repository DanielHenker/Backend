import { createUser } from "../controllers/users.controllers.js";
import { showUsers } from "../controllers/users.controllers.js";
import { loginUser } from "../controllers/users.controllers.js";
import { updateUserById } from "../controllers/users.controllers.js";
import { deleteUserById } from "../controllers/users.controllers.js";
import { verificarToken, verificarAdmin } from "../middlewares/auth.middleware.js";
import express from 'express';

// 1. configurar el router - express.Router()

export const userRouter = express.Router();


// 2. crear las rutas por cada controlador

// Rutas públicas
userRouter.post('/registrar', createUser);
userRouter.post('/iniciar-sesion', loginUser);

// Rutas protegidas: solo administradores pueden listar o eliminar usuarios
userRouter.get('/mostrar', verificarToken, verificarAdmin, showUsers);
userRouter.delete('/eliminar/:id', verificarToken, verificarAdmin, deleteUserById);

// Actualizar: cualquier usuario logueado puede editar su propia cuenta,
// pero solo un administrador puede editar la de otra persona o cambiar roles
// (la validación exacta se hace dentro del controlador)
userRouter.put('/actualizar/:id', verificarToken, updateUserById);
