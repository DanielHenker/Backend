import { createAppointment } from '../controllers/appointments.controllers.js';
import { getAppointments } from '../controllers/appointments.controllers.js';
import { updateAppointmentById } from '../controllers/appointments.controllers.js';
import { deleteAppointmentById } from '../controllers/appointments.controllers.js';
import express from 'express';

// 1. configurar el router - express.Router()

export const appointmentsRouter = express.Router();

// 2. crear las rutas por cada controlador

appointmentsRouter.post('/agendar', createAppointment);
appointmentsRouter.get('/mostrar', getAppointments);
appointmentsRouter.put('/actualizar/:id', updateAppointmentById);
appointmentsRouter.delete('/eliminar/:id', deleteAppointmentById);