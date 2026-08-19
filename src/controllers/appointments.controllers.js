import { appointmentModel } from '../models/appointments.model.js';

// petición POST -> crear una cita nueva
export async function createAppointment(request, response) {
    try {
        const newAppointment = await appointmentModel.create(request.body);

        return response.status(200).json({
            mensaje: 'Cita agendada correctamente',
            datos: newAppointment
        });

    } catch (error) {
        return response.status(500).json({
            mensaje: 'Error al agendar la cita',
            problema: error || error.message
        });
    }
}

// petición GET -> obtener todas las citas
export const getAppointments = async (request, response) => {
    try {
        // populate trae la información completa del usuario y del servicio, no solo el ID
        let appointments = await appointmentModel.find()
            .populate('user', 'name email')
            .populate('service', 'name price category');

        if (appointments.length === 0) {
            return response.status(200).json({
                mensaje: 'No se encontraron citas agendadas'
            });
        }

        return response.status(200).json({
            mensaje: 'Estas son todas las citas encontradas',
            datos: appointments
        });

    } catch (error) {
        return response.status(400).json({
            mensaje: 'Ocurrió un error al buscar las citas',
            problema: error || error.message
        });
    }
};

// petición PUT -> actualizar una cita en particular -> actualizar por ID
export const updateAppointmentById = async (request, response) => {
    try {
        let idForUpdate = request.params.id;
        let dataForUpdate = request.body;

        const appointmentUpdated = await appointmentModel.findByIdAndUpdate(idForUpdate, dataForUpdate, { new: true });

        if (!appointmentUpdated) {
            return response.status(404).json({
                mensaje: 'No se encontró la cita para actualizar'
            });
        }

        return response.status(200).json({
            mensaje: 'Se actualizó la cita correctamente',
            datos: appointmentUpdated
        });

    } catch (error) {
        return response.status(400).json({
            mensaje: 'Ocurrió un error al actualizar la cita',
            problema: error || error.message
        });
    }
};

// petición DELETE -> eliminar una cita en particular -> eliminar por ID
export const deleteAppointmentById = async (request, response) => {
    try {
        let idForDelete = request.params.id;

        const appointmentDeleted = await appointmentModel.findByIdAndDelete(idForDelete);

        if (!appointmentDeleted) {
            return response.status(404).json({
                mensaje: 'No se encontró la cita para eliminar'
            });
        }

        return response.status(200).json({
            mensaje: 'Cita eliminada satisfactoriamente'
        });

    } catch (error) {
        return response.status(500).json({
            mensaje: 'Ocurrió un error al eliminar la cita',
            problema: error || error.message
        });
    }
};