# Backend Consultorio Odontológico

Backend del proyecto de consultorio odontológico entregado para el final del módulo 1. 
Este proyecto está desarrollado con Node.js, Express y MongoDB, y constituye la continuación del sitio web estático  hacia una API REST con persistencia de datos, como parte del Módulo 2 del bootcamp BIT.

## Descripción del proyecto

Este backend sienta la base para administrar la información del consultorio, con funcionalidades como:

- Gestión de usuarios
- Gestión de servicios/productos odontológicos
- Conexión y persistencia de datos en MongoDB Atlas
- Manejo de variables de entorno para credenciales sensibles

## Tecnologías utilizadas

- Node.js
- Express.js
- MongoDB Atlas + Mongoose
- dotenv
- Nodemon

## Requisitos previos

Antes de ejecutar el proyecto asegúrate de tener instalado:

- Node.js
- pnpm (recomendado) o npm
- Una conexión válida a un cluster de MongoDB Atlas

## Instalación

1. Clona el repositorio:

```bash
git clone https://github.com/DanielHenker/Backend.git
cd Backend
```

2. Instala las dependencias:

```bash
pnpm install
```

3. Crea un archivo `.env` en la raíz del proyecto con las siguientes variables:

```env
PORT=3000
URI_MONGO=tu_connection_string_de_mongodb_atlas
USER_MONGO=tu_usuario
PASSWORD_MONGO=tu_password
```

Una vez ejecutado, el servicio estará disponible en:

```
http://localhost:3000
```

Estructura del proyecto
Backend/
├── app.js
├── package.json
└── src/
    ├── config/
    │   └── dataBase.js
    ├── controllers/
    │   ├── products.controllers.js
    │   └── users.controllers.js
    ├── models/
    │   ├── products.model.js
    │   └── users.model.js
    └── routes/
        ├── products.routes.js
        └── users.routes.js

## Scripts disponibles

- `pnpm start`: inicia el servidor con Node.js
- `pnpm dev`: inicia el servidor con Nodemon para desarrollo

Rutas actuales
Ruta de prueba
GET / → devuelve un mensaje indicando que el backend está funcionando
Usuarios (/usuarios)
Método	Endpoint	Descripción
POST	/usuarios/registrar	Registra un nuevo usuario (contraseña encriptada con bcrypt)
GET	/usuarios/mostrar	Obtiene todos los usuarios registrados
POST	/usuarios/iniciar-sesion	Inicia sesión y devuelve un token JWT
PUT	/usuarios/actualizar/:id	Actualiza un usuario existente por su ID
DELETE	/usuarios/eliminar/:id	Elimina un usuario existente por su ID
Servicios (/productos)
Método	Endpoint	Descripción
POST	/productos/crear	Crea un nuevo servicio odontológico
GET	/productos/mostrar	Obtiene todos los servicios registrados
PUT	/productos/actualizar/:id	Actualiza un servicio existente por su ID
DELETE	/productos/eliminar/:id	Elimina un servicio existente por su ID
Variables de entorno
Variable	Descripción
PORT	Puerto en el que correrá el servidor
URI_MONGO	URI de conexión a MongoDB Atlas
USER_MONGO	Usuario de la base de datos
PASSWORD_MONGO	Contraseña de la base de datos
JWT_SECRET	Clave secreta usada para firmar los tokens de autenticación (JWT)
Autores
Daniel Henker — Desarrollador único del proyecto (backend, modelado de datos y documentación)
Estado del proyecto

En desarrollo. Esta entrega implementa la funcionalidad CRUD completa (crear, leer, actualizar y eliminar) para los modelos de Usuario y Servicios, junto con autenticación básica mediante JWT. Las siguientes iteraciones incluirán pruebas de endpoints con Postman y mejoras adicionales de seguridad y validación.
