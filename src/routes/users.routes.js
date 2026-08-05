import { createUser } from "../controllers/users.controllers.js";
import { showUsers } from "../controllers/users.controllers.js";
import { loginUser } from "../controllers/users.controllers.js";
import { updateUserById } from "../controllers/users.controllers.js";
import { deleteUserById } from "../controllers/users.controllers.js";
import express from 'express';

// 1. configurar el router - express.Router()

export const userRouter = express.Router();


// 2. crear las rutas por cada controlador
userRouter.post('/registrar', createUser);
userRouter.get('/mostrar', showUsers);
userRouter.post('/iniciar-sesion', loginUser);
userRouter.put('/actualizar/:id', updateUserById);
userRouter.delete('/eliminar/:id', deleteUserById);

