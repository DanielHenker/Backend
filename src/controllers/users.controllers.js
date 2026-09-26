
// 1. Importar dependencias y módulos que necesitemos
// Importar las dependencias de encriptación

import { userModel } from '../models/users.model.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';


// petición POST -> registrar usuarios con contraseña encriptada
export async function createUser(request, response) {

    try {

        // desestructuramos los datos del body de la petición
        // (a propósito NO tomamos "role" del body: todo registro público
        // queda como "usuario" por defecto; el rol admin se asigna aparte)
        const { name, email, password, phone } = request.body;
        const codedPassword = await bcrypt.hash(password, 10); // encriptamos la contraseña con bcrypt

        const newUser = await userModel.create({
            name,
            email,
            password: codedPassword,
            phone
        });

        return response.status(200).json({
            message: "Usuario registrado correctamente",
            user: newUser
        })

    } catch (error) {

        return response.status(500).json({
            message: "Error al registrar el usuario",
            error: error || error.message

        })



    }

}


// petición GET -> obtener usuarios (solo administradores)
export const showUsers = async (req, res) => {
  // manejo de errores -> atrapar lo que pueda salir mal
  try {
    // Encontrar TODOS los usuarios (excluyendo el hash de la contraseña,
    // que nunca debe salir de la base de datos, ni siquiera hacia el admin)
    let users = await userModel.find().select('-password');
    // validación si no se encuentran usuarios almacenados
    if(users.length === 0){
        return res.status(200).json({
            mensaje: 'No hay usuarios almacenados'
        })
    }

    return res.status(200).json({
        mensaje: 'Se encontraron usuarios almacenados',
        numeroUsuarios: users.length,
        datos: users
    })

  } catch (error) {
    return res.status(400).json({
        mensaje: 'Ocurrió un error al mostrar los usuarios',
        problema: error || error.message
    });
  }
};



// petición POST -> hacer un inicio de sesión (login) con validación de contraseña
export const loginUser = async (req, res) => {
  // manejo de errores -> atrapar lo que pueda salir mal
  try {
    // Destructuración -> obtenemos las credenciales que envía el usuario
    const { email, password } = req.body;

    // Validación -> verificamos que lleguen las credenciales
    if (!email || !password) {
      return res.status(400).json({
        mensaje: "Debes proporcionar el correo y la contraseña",
      });
    }

    // 1. Buscamos al usuario por su correo
    const user = await userModel.findOne({ email });

    // Si no existe el usuario -> credenciales inválidas
    // (usamos un mensaje genérico para no revelar si el correo existe o no)
    if (!user) {
      return res.status(401).json({
        mensaje: "Credenciales inválidas",
      });
    }

    // 2. Comparamos la contraseña enviada con la contraseña encriptada almacenada
    // .compare -> devuelve true si coinciden, false si no
    const passwordValido = await bcrypt.compare(password, user.password);

    if (!passwordValido) {
      return res.status(401).json({
        mensaje: "Credenciales inválidas",
      });
    }

    // 3. Generamos el token (JWT) con la información que queremos guardar en él (payload)
    // Incluimos el rol para que el frontend y el backend puedan saber
    // si este usuario es administrador sin tener que consultar la base de datos otra vez
    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET, // clave secreta guardada en las variables de entorno (.env)
      { expiresIn: "1h" } // el token expira en 1 hora
    );

    // 4. Respondemos con el token y los datos básicos del usuario
    return res.status(200).json({
      mensaje: "Inicio de sesión exitoso",
      token,
    });
  } catch (error) {
    return res.status(400).json({
      mensaje: "Ocurrió un error al iniciar sesión",
      problema: error.message || error,
    });
  }
};

// petición PUT -> actualizar un usuario en particular -> actualizar por ID
export const updateUserById = async (req, res) => {
  try {
    const idForUpdate = req.params.id;
    const dataForUpdate = req.body;

    const esAdmin = req.usuario?.role === 'admin';
    const esPropiaCuenta = req.usuario?.id === idForUpdate;

    // Solo un administrador puede modificar la cuenta de otra persona
    if (!esAdmin && !esPropiaCuenta) {
      return res.status(403).json({
        mensaje: 'No tienes permiso para modificar este usuario'
      });
    }

    // Solo un administrador puede cambiar el rol de un usuario
    // (evita que un usuario normal se autoasigne el rol "admin")
    if (dataForUpdate.role && !esAdmin) {
      delete dataForUpdate.role;
    }

    // si la actualización incluye una nueva contraseña, la encriptamos antes de guardarla
    if (dataForUpdate.password) {
      dataForUpdate.password = await bcrypt.hash(dataForUpdate.password, 10);
    }

    const userUpdated = await userModel.findByIdAndUpdate(idForUpdate, dataForUpdate, { returnDocument: 'after' });

    if (!userUpdated) {
      return res.status(404).json({
        mensaje: 'No se encontró usuario para actualizar'
      });
    }

    return res.status(200).json({
      mensaje: 'Se actualizó el usuario correctamente',
      datos: userUpdated
    });

  } catch (error) {
    return res.status(400).json({
      mensaje: 'Ocurrió un error al actualizar usuario',
      problema: error || error.message
    });
  }
};

// petición DELETE -> eliminar un usuario en particular -> eliminar por ID (solo administradores)
export const deleteUserById = async (req, res) => {
  try {
    let idForDelete = req.params.id;

    const userDeleted = await userModel.findByIdAndDelete(idForDelete);

    if (!userDeleted) {
      return res.status(404).json({
        mensaje: 'No se encontró usuario para eliminar'
      });
    }

    return res.status(200).json({
      mensaje: 'Usuario eliminado satisfactoriamente'
    });

  } catch (error) {
    return res.status(500).json({
      mensaje: 'Ocurrió un error al eliminar usuario',
      problema: error || error.message
    });
  }
};
