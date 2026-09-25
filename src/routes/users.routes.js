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
// Registro e inicio de sesión son públicos (nadie tiene token todavía)
userRouter.post('/registrar', createUser);
userRouter.post('/iniciar-sesion', loginUser);

// Ver el listado de usuarios y eliminar cuentas: solo administradores
userRouter.get('/mostrar', verificarToken, verificarAdmin, showUsers);
userRouter.delete('/eliminar/:id', verificarToken, verificarAdmin, deleteUserById);

// Actualizar: solo hace falta estar logueado; el propio controlador
// (updateUserById) valida si eres el dueño de la cuenta o un administrador
userRouter.put('/actualizar/:id', verificarToken, updateUserById);
