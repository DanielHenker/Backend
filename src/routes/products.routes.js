import { postProduct } from '../controllers/products.controller.js';
import { getProduct } from '../controllers/products.controller.js';
import { putProductById } from '../controllers/products.controller.js';
import { deleteProductById } from '../controllers/products.controller.js';
import express from 'express';

// 1. configurar el router - express.Router()

export const productsRouter = express.Router();

// 2. crear las rutas por cada controlador

productsRouter.post('/crear', postProduct);
productsRouter.get('/mostrar', getProduct);
productsRouter.put('/actualizar/:id', putProductById);
productsRouter.delete('/eliminar/:id', deleteProductById);

