import { createAppointment } from '../controllers/appointments.controllers.js';
import { getAppointments } from '../controllers/appointments.controllers.js';
import { updateAppointmentById } from '../controllers/appointments.controllers.js';
import { deleteAppointmentById } from '../controllers/appointments.controllers.js';
import { verificarToken } from '../middlewares/auth.middleware.js';
import express from 'express';

// 1. configurar el router - express.Router()

export const appointmentsRouter = express.Router();

// 2. crear las rutas por cada controlador
// Todas requieren estar logueado: una cita siempre pertenece a un usuario autenticado

appointmentsRouter.post('/agendar', verificarToken, createAppointment);
appointmentsRouter.get('/mostrar', verificarToken, getAppointments);
appointmentsRouter.put('/actualizar/:id', verificarToken, updateAppointmentById);
appointmentsRouter.delete('/eliminar/:id', verificarToken, deleteAppointmentById);
