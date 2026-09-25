# Backend Consultorio Odontológico

API REST desarrollada con Node.js, Express y MongoDB para la gestión digital de un consultorio odontológico real. El proyecto surge como continuación del sitio web estático desarrollado en el Módulo 1 del bootcamp BIT (Build, Innovate, Transform), y en este Módulo 2 se construye el backend que le da soporte funcional.

El consultorio ofrece distintos **servicios odontológicos** (limpieza dental, ortodoncia, blanqueamiento, entre otros), los cuales los **pacientes** pueden consultar y **agendar** en un horario específico. Este backend modela justamente ese flujo de negocio: gestión de usuarios (pacientes y administradores), catálogo de servicios ofrecidos, y un sistema de **agenda de citas** que conecta a ambos, permitiendo registrar, consultar, actualizar y cancelar citas — todo protegido por un sistema de autenticación y roles.

## Descripción del proyecto

Este backend administra tres áreas centrales del consultorio:

- **Usuarios**: registro (con nombre, correo, contraseña y teléfono de contacto), autenticación (login con JWT) y gestión de pacientes/administradores, con contraseñas encriptadas mediante bcrypt.
- **Servicios**: catálogo de los tratamientos y servicios que ofrece el consultorio (nombre, descripción, categoría, precio).
- **Citas (agenda)**: sistema de reservas que vincula a un usuario con un servicio en una fecha y hora determinada, con estados (pendiente, confirmada, cancelada, completada), validación de horarios duplicados y control de propiedad (cada quien solo ve y gestiona sus propias citas).
- **Autenticación y roles**: control de acceso mediante JWT y middlewares, distinguiendo entre pacientes (`usuario`) y administradores (`admin`).
- Conexión y persistencia de datos en MongoDB Atlas, con reintentos automáticos ante fallos de conexión.
- Manejo de variables de entorno para credenciales sensibles.

## Autenticación y control de acceso por roles

El sistema maneja dos roles: `usuario` (paciente, valor por defecto al registrarse) y `admin` (asignado manualmente en la base de datos). El flujo funciona así:

1. Al iniciar sesión (`POST /usuarios/iniciar-sesion`), el backend valida las credenciales y genera un **token JWT** que incluye el `id`, `email` y `role` del usuario, válido por 1 hora.
2. Las rutas protegidas exigen ese token en la cabecera `Authorization: Bearer <token>`. Esto lo valida el middleware `verificarToken` (`src/middlewares/auth.middleware.js`), que además adjunta los datos del usuario autenticado a `request.usuario` para que los controladores puedan usarlos.
3. Las rutas exclusivas de administrador añaden además el middleware `verificarAdmin`, que rechaza la petición si `request.usuario.role !== 'admin'`.
4. En `/citas` y en la actualización de un usuario, además del rol se valida la **propiedad**: un usuario normal solo puede ver, editar o eliminar sus propios datos/citas; un administrador puede gestionar los de cualquiera. El `id` del dueño de una cita siempre se toma del token, nunca de lo que envíe el cliente en el body, para evitar que alguien agende o consulte a nombre de otra persona.

## Tecnologías utilizadas

- Node.js
- Express.js
- MongoDB Atlas + Mongoose
- jsonwebtoken (JWT) + bcryptjs (encriptación de contraseñas)
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
JWT_SECRET=una_clave_secreta_larga_y_dificil_de_adivinar
```

> Nunca subas tu archivo `.env` real al repositorio. Asegúrate de que esté incluido en tu `.gitignore`.

> Si vas a desplegar este backend en un servicio en la nube (Render, Railway, etc.), recuerda agregar `0.0.0.0/0` en "Network Access" de MongoDB Atlas, ya que el servidor se conectará desde una IP distinta a la de tu computador. La seguridad la sigue dando el usuario y la contraseña de la base de datos, no la IP.

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
    │   └── dataBase.js          # conexión a MongoDB con reintentos automáticos
    ├── controllers/
    │   ├── appointments.controllers.js
    │   ├── products.controllers.js
    │   └── users.controllers.js
    ├── middlewares/
    │   └── auth.middleware.js   # verificarToken y verificarAdmin
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

| Método | Endpoint | Acceso | Descripción |
|---|---|---|---|
| `POST` | `/usuarios/registrar` | Público | Registra un nuevo usuario (nombre, correo, contraseña, teléfono); la contraseña se guarda encriptada con bcrypt |
| `POST` | `/usuarios/iniciar-sesion` | Público | Inicia sesión y devuelve un token JWT (incluye el rol del usuario) |
| `GET` | `/usuarios/mostrar` | 🔒 Solo admin | Obtiene todos los usuarios registrados (sin exponer las contraseñas) |
| `PUT` | `/usuarios/actualizar/:id` | 🔒 Logueado | Actualiza un usuario; solo el propio dueño o un admin pueden hacerlo, y solo un admin puede cambiar el rol |
| `DELETE` | `/usuarios/eliminar/:id` | 🔒 Solo admin | Elimina un usuario existente por su ID |

### Servicios (`/productos`)

| Método | Endpoint | Acceso | Descripción |
|---|---|---|---|
| `GET` | `/productos/mostrar` | Público | Obtiene todos los servicios registrados |
| `POST` | `/productos/crear` | 🔒 Solo admin | Crea un nuevo servicio odontológico |
| `PUT` | `/productos/actualizar/:id` | 🔒 Solo admin | Actualiza un servicio existente por su ID |
| `DELETE` | `/productos/eliminar/:id` | 🔒 Solo admin | Elimina un servicio existente por su ID |

### Citas / Agenda (`/citas`)

| Método | Endpoint | Acceso | Descripción |
|---|---|---|---|
| `POST` | `/citas/agendar` | 🔒 Logueado | Agenda una nueva cita para el usuario autenticado; rechaza la cita si ya existe otra activa en la misma fecha y hora |
| `GET` | `/citas/mostrar` | 🔒 Logueado | Un usuario ve solo sus propias citas; un administrador ve todas |
| `PUT` | `/citas/actualizar/:id` | 🔒 Logueado | Actualiza una cita; solo el dueño de la cita o un admin pueden hacerlo |
| `DELETE` | `/citas/eliminar/:id` | 🔒 Logueado | Elimina una cita; solo el dueño de la cita o un admin pueden hacerlo |

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

🚧 En desarrollo. Esta entrega implementa la funcionalidad CRUD completa para los modelos de Usuario, Servicios y Citas, con autenticación mediante JWT y control de acceso por roles (paciente/administrador) aplicado tanto en el frontend como directamente en las rutas del backend. Incluye además: validación de citas duplicadas en el mismo horario, control de propiedad sobre citas y perfiles, teléfono obligatorio en el registro, y reconexión automática a la base de datos ante fallos momentáneos de red.

**Limitación conocida:** la validación de horario duplicado solo se aplica al **crear** una cita nueva; si una cita existente se reagenda a un horario ya ocupado (`PUT /citas/actualizar/:id`), esa validación todavía no se ejecuta. Queda pendiente para una próxima iteración.
