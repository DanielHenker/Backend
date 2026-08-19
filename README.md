# Backend Consultorio Odontológico

API REST desarrollada con Node.js, Express y MongoDB para la gestión digital de un consultorio odontológico real. El proyecto surge como continuación del sitio web estático desarrollado en el Módulo 1 del bootcamp BIT (Build, Innovate, Transform), y en este Módulo 2 se construye el backend que le da soporte funcional.

El consultorio ofrece distintos **servicios odontológicos** (limpieza dental, ortodoncia, blanqueamiento, entre otros), los cuales los **pacientes** pueden consultar y **agendar** en un horario específico. Este backend modela justamente ese flujo de negocio: gestión de usuarios (pacientes y administradores), catálogo de servicios ofrecidos, y un sistema de **agenda de citas** que conecta a ambos, permitiendo registrar, consultar, actualizar y cancelar citas.

## Descripción del proyecto

Este backend administra tres áreas centrales del consultorio:

- **Usuarios**: registro, autenticación (login con JWT) y gestión de pacientes/administradores, con contraseñas encriptadas mediante bcrypt
- **Servicios**: catálogo de los tratamientos y servicios que ofrece el consultorio (nombre, descripción, categoría, precio)
- **Citas (agenda)**: sistema de reservas que vincula a un usuario con un servicio en una fecha y hora determinada, con estados (pendiente, confirmada, cancelada, completada)
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

- Node.js 18 o superior
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

> Nunca subas tu archivo `.env` real al repositorio. Asegúrate de que esté incluido en tu `.gitignore`.

## Ejecución

Para iniciar el servidor en modo desarrollo (con recarga automática):

```bash
pnpm dev
```

Para iniciar el servidor en modo producción:

```bash
pnpm start
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
    │   └── dataBase.js
    ├── controllers/
    │   ├── appointments.controllers.js
    │   ├── products.controllers.js
    │   └── users.controllers.js
    ├── models/
    │   ├── appointments.model.js
    │   ├── products.model.js
    │   └── users.model.js
    └── routes/
        ├── appointments.routes.js
        ├── products.routes.js
        └── users.routes.js
```

## Scripts disponibles

- `pnpm start`: inicia el servidor con Node.js
- `pnpm dev`: inicia el servidor con Nodemon para desarrollo

## Rutas actuales

### Ruta de prueba

- `GET /` → devuelve un mensaje indicando que el backend está funcionando

### Usuarios (`/usuarios`)

| Método | Endpoint | Descripción |
|---|---|---|
| `POST` | `/usuarios/registrar` | Registra un nuevo usuario (contraseña encriptada con bcrypt) |
| `GET` | `/usuarios/mostrar` | Obtiene todos los usuarios registrados |
| `POST` | `/usuarios/iniciar-sesion` | Inicia sesión y devuelve un token JWT |
| `PUT` | `/usuarios/actualizar/:id` | Actualiza un usuario existente por su ID |
| `DELETE` | `/usuarios/eliminar/:id` | Elimina un usuario existente por su ID |

### Servicios (`/productos`)

| Método | Endpoint | Descripción |
|---|---|---|
| `POST` | `/productos/crear` | Crea un nuevo servicio odontológico |
| `GET` | `/productos/mostrar` | Obtiene todos los servicios registrados |
| `PUT` | `/productos/actualizar/:id` | Actualiza un servicio existente por su ID |
| `DELETE` | `/productos/eliminar/:id` | Elimina un servicio existente por su ID |

### Citas / Agenda (`/citas`)

| Método | Endpoint | Descripción |
|---|---|---|
| `POST` | `/citas/agendar` | Agenda una nueva cita, vinculando un usuario con un servicio |
| `GET` | `/citas/mostrar` | Obtiene todas las citas agendadas, con la información del usuario y servicio relacionados |
| `PUT` | `/citas/actualizar/:id` | Actualiza una cita existente por su ID (por ejemplo, cambiar el estado o la fecha) |
| `DELETE` | `/citas/eliminar/:id` | Elimina una cita existente por su ID |

## Variables de entorno

| Variable | Descripción |
|---|---|
| `PORT` | Puerto en el que correrá el servidor |
| `URI_MONGO` | URI de conexión a MongoDB Atlas |
| `USER_MONGO` | Usuario de la base de datos |
| `PASSWORD_MONGO` | Contraseña de la base de datos |
| `JWT_SECRET` | Clave secreta usada para firmar los tokens de autenticación (JWT) |

## Autores

- **Daniel Henker** — Desarrollador único del proyecto (backend, modelado de datos y documentación)

## Estado del proyecto

🚧 En desarrollo. Esta entrega implementa la funcionalidad CRUD completa (crear, leer, actualizar y eliminar) para los modelos de Usuario, Servicios y Citas, junto con autenticación básica mediante JWT. El modelo de Citas relaciona usuarios y servicios para representar el flujo real de agendamiento del consultorio. Las siguientes iteraciones incluirán mejoras adicionales de seguridad, validación y lógica de negocio (por ejemplo, evitar solapamiento de horarios).