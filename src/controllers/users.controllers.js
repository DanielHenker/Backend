
// 1. Importar dependencias y módulos que necesitemos
// Importar las dependencias de encriptación

import { userModel } from '../models/user.model.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';


// petición POST -> registrar usuarios con contraseña encriptada
export async function createUser(request, response) {

    try {

        // desestructuramos los datos del body de la petición
        const { name, email, password } = request.body;
        const codedPassword = await bcrypt.hash(password, 10); // encriptamos la contraseña con bcrypt

        const newUser = await userModel.create({
            name,
            email,
            password: codedPassword
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


// petición GET -> obtener usuarios
export const showUsers = async (req, res) => {
  // manejo de errores -> atrapar lo que pueda salir mal
  try {
    // Encontrar TODOS los usuarios
    let users = await userModel.find();
    // validación si no se encuentran usuarios almacenados
    if(users.length === 0){
        return res.status(200).json({
            mensaje: 'No hay usuarios almacenados'
        })
    }

    return res.status(200).json({
        menasaje: 'Se encontraron usuarios almacenados',
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
    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
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