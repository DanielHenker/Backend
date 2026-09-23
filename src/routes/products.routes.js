import { postProduct } from '../controllers/products.controllers.js';
import { getProduct } from '../controllers/products.controllers.js';
import { putProductById } from '../controllers/products.controllers.js';
import { deleteProductById } from '../controllers/products.controllers.js';
import { verificarToken, verificarAdmin } from '../middlewares/auth.middleware.js';
import express from 'express';

// 1. configurar el router - express.Router()

export const productsRouter = express.Router();

// 2. crear las rutas por cada controlador

// Ver los servicios es público (lo necesita la página "Servicios" para cualquier visitante)
productsRouter.get('/mostrar', getProduct);

// Crear, editar y eliminar servicios solo lo puede hacer un administrador
productsRouter.post('/crear', verificarToken, verificarAdmin, postProduct);
productsRouter.put('/actualizar/:id', verificarToken, verificarAdmin, putProductById);
productsRouter.delete('/eliminar/:id', verificarToken, verificarAdmin, deleteProductById);

