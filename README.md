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

## Estructura del proyecto

```
Backend/
├── app.js
├── package.json
└── src/
    ├── config/
    ├── controllers/
    ├── models/
    └── routes/
```

## Scripts disponibles

- `pnpm start`: inicia el servidor con Node.js
- `pnpm dev`: inicia el servidor con Nodemon para desarrollo

## Rutas actuales

Actualmente el backend expone una ruta de prueba para verificar que el servicio funciona:

- `GET /` → devuelve un mensaje indicando que el backend está funcionando

## Autor

Daniel Henker
