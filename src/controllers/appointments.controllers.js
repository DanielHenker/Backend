import { appointmentModel } from '../models/appointments.model.js';

// petición POST -> crear una cita nueva
export async function createAppointment(request, response) {
    try {
        const { date, service, notes } = request.body;
        // El dueño de la cita es SIEMPRE el usuario autenticado (viene del token),
        // nunca un id que mande el cliente en el body -> evita que alguien agende
        // una cita a nombre de otra persona.
        const userId = request.usuario.id;

        // Validación -> verificar si ya existe una cita agendada en esa misma fecha y hora
        const existingAppointment = await appointmentModel.findOne({
            date: date,
            status: { $ne: 'cancelada' } // ignoramos las citas ya canceladas
        });

        if (existingAppointment) {
            return response.status(409).json({
                mensaje: 'Ya existe una cita agendada en la fecha y hora seleccionadas'
            });
        }

        const newAppointment = await appointmentModel.create({
            user: userId,
            service,
            date,
            notes
        });

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

// petición GET -> obtener las citas
// Un usuario normal solo ve SUS PROPIAS citas; un administrador ve todas
export const getAppointments = async (request, response) => {
    try {
        const esAdmin = request.usuario.role === 'admin';
        const filtro = esAdmin ? {} : { user: request.usuario.id };

        // populate trae la información completa del usuario y del servicio, no solo el ID
        let appointments = await appointmentModel.find(filtro)
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
// Solo el dueño de la cita o un administrador pueden modificarla
export const updateAppointmentById = async (request, response) => {
    try {
        let idForUpdate = request.params.id;
        let dataForUpdate = request.body;

        const cita = await appointmentModel.findById(idForUpdate);

        if (!cita) {
            return response.status(404).json({
                mensaje: 'No se encontró la cita para actualizar'
            });
        }

        const esAdmin = request.usuario.role === 'admin';
        const esDuenio = cita.user.toString() === request.usuario.id;

        if (!esAdmin && !esDuenio) {
            return response.status(403).json({
                mensaje: 'No tienes permiso para modificar esta cita'
            });
        }

        const appointmentUpdated = await appointmentModel.findByIdAndUpdate(idForUpdate, dataForUpdate, { returnDocument: 'after' });

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
// Solo el dueño de la cita o un administrador pueden eliminarla
export const deleteAppointmentById = async (request, response) => {
    try {
        let idForDelete = request.params.id;

        const cita = await appointmentModel.findById(idForDelete);

        if (!cita) {
            return response.status(404).json({
                mensaje: 'No se encontró la cita para eliminar'
            });
        }

        const esAdmin = request.usuario.role === 'admin';
        const esDuenio = cita.user.toString() === request.usuario.id;

        if (!esAdmin && !esDuenio) {
            return response.status(403).json({
                mensaje: 'No tienes permiso para eliminar esta cita'
            });
        }

        await appointmentModel.findByIdAndDelete(idForDelete);

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
