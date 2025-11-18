# Proyecto_Backend

Backend para el proyecto ThePower (servicio REST en Node.js).
Se basa en un servidor para manejar colecciones de usuarios y de medallas.

## Tecnologías principales
- Node.js
- Express
- MongoDB empleando Mongoose
- Autenticación basada en JWT
- Cloudinary (gestión de imágenes)

## Qué hace este proyecto
- Gestión de usuarios: Registro, login, eliminación y cambio de rol.
- Sistema de "badges": Colección de badges y relación 0:N desde `User` (cada usuario referencia badges por ObjectId).
- Middlewares: Autenticación (`isAuth`, `isAdmin`) y subida/gestión de imágenes.
- Utilidades: Script de seed para generar la base de datos con datos de ejemplo.

## Estructura relevante
- `src/api/models/` — Esquemas Mongoose (`user.model.js`, `badge.model.js`)
- `src/api/controllers/` — Lógica de negocio por recurso (usuarios, badges)
- `src/api/routes/` — Definición de rutas y protección con middlewares
- `src/data/` — Datos de ejemplo `users.js`, `badges.js`
- `src/utils/users.seed.js` — Script para generar la base de datos con datos provenientes de data
- `src/config/` y `src/utils/` — Configuración de Cloudinary y utilidades

## Instalación

### Prerrequisitos
- Node.js (v16 o superior)
- npm o yarn
- MongoDB (local o acceso a un servidor remoto)

### Pasos

1. Clona el repositorio:
```powershell
git clone <repo-url>
cd Proyecto_Backend
```

2. Instala las dependencias:
```powershell
npm install
```

3. Configura el archivo `.env`:
Crea un archivo `.env` en la raíz del proyecto con las variables de entorno necesarias:
```
DB_URL=mongodb://localhost:27017/thepower
JWT_SECRET=tu_clave_secreta_aqui
CLOUDINARY_CLOUD_NAME=tu_cloud_name
CLOUDINARY_API_KEY=tu_api_key
CLOUDINARY_API_SECRET=tu_api_secret
PORT=3000
```

4. Ejecuta el script de seed (opcional, para poblar la BD con datos de ejemplo):
```powershell
npm run seed
```

5. Inicia el servidor en modo desarrollo:
```powershell
npm run dev
```

El servidor estará disponible en `http://localhost:3000` (o el puerto que hayas configurado en `PORT`).

## Endpoints principales (ejemplos)
Las rutas se dividen en dos agrupaciones `/users` y `/badges`. Los endpoints disponibles son:

- Usuarios
    - `POST /users/register` — Registrar usuario
    - `POST /users/login` — Iniciar sesión (devuelve JWT)
    - `DELETE /users/:id` — (admin) Borrar usuario (usuarios solo pueden borrar su propia cuenta)
    - `PATCH /users/changeRole/:id` — (admin) Cambiar rol de usuario

- Badges
    - `GET /badges` — (auth) Obtener los badges del usuario autenticado. Devuelve los documentos `Badge` correspondientes a los ObjectId almacenados en `user.badges`.
    - `POST /badges/create` — (admin) Crear un nuevo `Badge` en la colección `badges`.
    - `POST /badges/:badgeId` — (auth) Asociar un `Badge` al usuario actual.
    - `DELETE /badges/:badgeId` — (auth) Eliminar la asociación del badge con el usuario actual.
    - `DELETE /badges/delete/:badgeId` — (admin) Borrar un `Badge` de la colección `badges`.

## Variables de entorno
Crear un archivo `.env` con al menos las siguientes variables:

- `DB_URL` — URI de conexión a MongoDB (ej. `mongodb://localhost:27017/thepower`)
- `JWT_SECRET` — clave para firmar tokens JWT
- `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` — si usas subida de imágenes

## Seed (poblar BD)
Hay un script de seed que inserta los badges y los usuarios de `src/data/` y hashea las contraseñas.

Ejecutar en PowerShell desde la raíz del proyecto:

```powershell
npm run seed
```

## Ejecutar la aplicación (desarrollo)
Dependiendo de tus `package.json` scripts puedes usar `npm run dev` o ejecutar directamente el fichero de arranque (ej. `node index.js`):

```powershell
npm run dev
# o
node index.js
```

## Notas técnicas
- `User.badges` guarda referencias (ObjectId) a documentos de la colección `badges`.
- El script de seed (`src/utils/users.seed.js`) ya hashea contraseñas antes de insertar.
- Protegemos las rutas sensibles con `isAuth` y, cuando proceda, con comprobaciones de rol (`isAdmin`).

## Contact

David Pintado Morales

[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/david-pintado-morales/)