# DailySpace — Backend API REST (Node.js + Express + TypeScript + Prisma + PostgreSQL)

**Estudiante:** Mariaisabel Zuluaga Quintero  
**Curso:** Desarrollo Web · Semestre 2026-2 · Universidad de Medellín  
**Despliegue de la API (Render):** [[https://dailyspace-back.onrender.com](https://dailyspace-back.onrender.com)](https://dailyspace-back.onrender.com)
**Frontend Desplegado (Vercel):** [dailyspace-front.vercel.app](https://dailyspace-front.vercel.app) 

---

## 📖 1. Descripción del Proyecto
API REST construida siguiendo los principios de **Arquitectura Limpia en Cuatro Capas** (Domain, Application, Infrastructure, Interface). Expone los servicios de backend para el diario digital e interactivo **DailySpace**, soportando:
- Autenticación y autorización basada en **JWT** y hashing con **bcryptjs**.
- Catálogo de vivencias (`posts`) con paginación estandarizada `{ pagination, data }` y filtros combinados.
- Interacciones de usuario (`comments`) con asignación estricta de identidad extraída del token.
- Almacenamiento y subida de archivos de imagen para publicaciones con **Multer** (**Bono +4 pts**).
- Suite de pruebas automatizadas con **Vitest** (**Bono +3 pts**).

---

## 🏛️ 2. Arquitectura en Cuatro Capas
El proyecto cumple rigurosamente con la separación de responsabilidades y el principio de que **Prisma vive exclusivamente en Infrastructure**:

```text
src/
├── config/                     # Variables de entorno y configuración general
│   └── env.ts
├── domain/                     # 1. CAPA DE DOMINIO (Reglas de negocio puras)
│   ├── entities/               # UserEntity, PostEntity, CommentEntity
│   ├── repositories/           # Interfaces: IUserRepository, IPostRepository, ICommentRepository
│   └── errors/                 # Jerarquía de errores: AppError, ConflictError (409), Unauthorized (401), etc.
├── application/                # 2. CAPA DE APLICACIÓN (Casos de uso del sistema)
│   └── use-cases/
│       ├── auth/               # RegisterUserUseCase, LoginUserUseCase
│       ├── posts/              # GetPostsUseCase, GetPostByIdUseCase, CreatePostUseCase, UpdatePostUseCase, DeletePostUseCase
│       └── comments/           # CreateCommentUseCase, GetMyCommentsUseCase, GetAllCommentsUseCase
├── infrastructure/             # 3. CAPA DE INFRAESTRUCTURA (Herramientas técnicas y Prisma)
│   ├── database/               # prisma.ts (Instancia única centralizada)
│   ├── repositories/           # PrismaUserRepository, PrismaPostRepository, PrismaCommentRepository
│   ├── security/               # SecurityService (bcryptjs hashing y JWT sign/verify)
│   └── upload/                 # multerConfig.ts (Almacenamiento de archivos de imagen)
└── interface/                  # 4. CAPA DE INTERFAZ (Controladores, Rutas y Middlewares HTTP)
    ├── controllers/            # AuthController, PostController, CommentController
    ├── dtos/                   # Validaciones de esquemas con Zod (query, params, body)
    ├── middlewares/            # authMiddleware.ts (authenticateToken, requireRole), errorHandler.ts
    └── routes/                 # authRoutes, postRoutes, commentRoutes, uploadRoutes
```

---

## 🚀 3. Cómo correr el proyecto en Local

### Prerrequisitos
- Node.js 18+ instalado
- PostgreSQL local o una base de datos en la nube (ej. Supabase, Neon o Render PostgreSQL)

### Pasos de Instalación
1. Clona el repositorio e ingresa al directorio:
   ```bash
   git clone https://github.com/Mariaisabel2/dailyspace-back.git
   cd dailyspace-back
   ```
2. Instala las dependencias:
   ```bash
   npm install
   ```
3. Configura las variables de entorno en un archivo `.env`:
   ```env
    PORT=4000
    NODE_ENV=development
    # Conexión vía pooler transaccional (puerto 6543)
    DATABASE_URL="postgresql://postgres.ejlsssdxgiityzseonsr:Emiliano248224.@aws-0-us-       east-1.pooler.supabase.com:6543/postgres?pgbouncer=true"
    # Conexión directa para migraciones y seeds (puerto 5432)
    DIRECT_URL="postgresql://postgres.ejlsssdxgiityzseonsr:Emiliano248224.@aws-0-us-         east-    1.pooler.supabase.com:5432/postgres"
    JWT_SECRET="dailyspace_jwt_secret_dev_key_2026"
    JWT_EXPIRES_IN="7d"
    FRONTEND_URL="http://localhost:3000"
   ```
4. Aplica las migraciones o genera el cliente de Prisma:
   ```bash
   npx prisma generate
   npx prisma db push
   ```
5. Ejecuta el Seed con los datos reales de la Entrega 1:
   ```bash
   npm run prisma:seed
   ```
6. Inicia el servidor de desarrollo:
   ```bash
   npm run dev
   ```
   *La API quedará escuchando en `http://localhost:4000` con health check en `http://localhost:4000/health`.*

7. Para ejecutar las pruebas automatizadas de los middlewares:
   ```bash
   npm test
   ```
## 🧠 4. Decisiones Técnicas (En palabras propias)

### 1. Flujo completo de un login: desde el formulario hasta que una ruta protegida responde
1. **Envío de credenciales:** El cliente envía una petición `POST /api/auth/login` con `{ email, password }`.
2. **Validación:** `AuthController` valida la estructura con `loginSchema` de Zod; si los tipos son incorrectos, retorna `400 Bad Request`.
3. **Autenticación en caso de uso:** `LoginUserUseCase` busca al usuario por correo en `PrismaUserRepository`. Si no existe o `SecurityService.comparePassword` falla contra el hash de bcrypt, lanza `UnauthorizedError` respondiendo **`401` genérico** sin revelar si falló el correo o la contraseña.
4. **Firma de JWT:** Si las credenciales coinciden, se firma un JWT con `JWT_SECRET` y expiración (`7d`), conteniendo únicamente `{ id, role }`.
5. **Consumo de ruta protegida:** Al solicitar una ruta privada (ej. `POST /api/comments`), el cliente envía el header `Authorization: Bearer <token>`. El middleware `authenticateToken` verifica la firma y extrae el payload en `req.user`. Si la ruta exige permisos de administración, `requireRole("admin")` verifica el campo `role`; si no coincide, rechaza con **`403 Forbidden`**.

### 2. ¿Dónde guardas el token en el frontend y qué riesgo tiene esa decisión?
En el frontend se maneja una estrategia dual: `localStorage` para llamadas desde el cliente HTTP e inyección en `Authorization: Bearer`, y una cookie de navegador para que el proxy en el servidor Next.js (`proxy.ts`) proteja rutas antes del renderizado. El riesgo principal es la exposición a ataques **XSS (Cross-Site Scripting)** si un script externo malicioso lograra ejecutarse. En producción bancaria estricta, la mitigación idónea es emitir cookies `httpOnly` con flags `Secure` y `SameSite` directamente desde el backend.

### 3. ¿En qué caso tu API responde 401 y en cuál 403? (Ejemplos reales del proyecto)
- **Código 401 Unauthorized (Problema de autenticación / identidad):**
  - *Ejemplo:* Una petición a `POST /api/comments` sin enviar el header `Authorization`, con un token malformado o con un token cuya firma expiró.
- **Código 403 Forbidden (Problema de permisos / autorización):**
  - *Ejemplo:* El usuario autenticado `carlos_dev` (rol `user`) envía un token válido a `DELETE /api/posts/2`. Como el token es auténtico pero el rol no es `admin`, el middleware `soloAdmin` responde **403 Forbidden: Acceso restringido**.

### 4. Si usaste IA, ¿para qué la usaste y qué tuviste que corregir?
- **Para qué se usó:** Para estructurar el esqueleto de las 4 capas limpias desacoplando Prisma del dominio y acelerar la codificación de pruebas unitarias en Vitest.
- **Qué se tuvo que corregir:** Se ajustó la firma del token para garantizar que el payload no incluyera campos sensibles de la entidad de usuario y se encapsuló estrictamente el mapeo del enum de visibilidad (`Publico` en Prisma vs `Público` en el dominio de la Entrega 1).

---
## 5. ## 🔑 Credenciales de Prueba (Roles del Sistema)

Para la evaluación y prueba de permisos por rol, la base de datos cuenta con los siguientes usuarios iniciales generados en el seed:

| Rol | Correo Electrónico | Contraseña | Permisos en la Plataforma |
| :--- | :--- | :--- | :--- |
| **Administrador (`admin`)** | `admin@dailyspace.com` | `Admin123!` | Acceso completo al panel administrativo (`/admin`), CRUD total del catálogo de publicaciones (`POST`, `PUT`, `DELETE /api/posts`), eliminar entradas con modal de confirmación y listar todos los comentarios. |
| **Usuario Estándar (`user`)** | `user@dailyspace.com` | `User123!` | Explorar el catálogo público, dar likes a publicaciones, crear comentarios (`POST /api/comments`) y gestionar su historial en `/mis-comentarios` (`GET /api/comments/mias`). |

## 📡 6. Resumen de Endpoints de la API

| Método | Ruta | Acceso | Descripción |
| :--- | :--- | :--- | :--- |
| **POST** | `/api/auth/register` | Público | Registro de usuario (409 si el email ya existe) |
| **POST** | `/api/auth/login` | Público | Inicio de sesión (retorna token JWT con payload mínimo) |
| **GET** | `/api/posts` | Público | Catálogo con paginación `{ pagination, data }` y filtros combinados |
| **GET** | `/api/posts/:id` | Público | Detalle de publicación por ID (404 si no existe) |
| **POST** | `/api/posts` | Solo Admin | Crear nueva publicación en el catálogo |
| **PUT** | `/api/posts/:id` | Solo Admin | Actualizar publicación existente |
| **DELETE** | `/api/posts/:id` | Solo Admin | Eliminar publicación del catálogo |
| **POST** | `/api/upload` | Autenticado | Subida de archivos de imagen con Multer (**Bono +4 pts**) |
| **POST** | `/api/comments` | Autenticado | Crear comentario (userId extraído estrictamente del token) |
| **GET** | `/api/comments/mias` | Autenticado | Obtener únicamente las interacciones del usuario activo |
| **GET** | `/api/comments` | Solo Admin | Listar todas las interacciones de la plataforma |
| **GET** | `/health` | Público | Estado de salud del servicio |

---

## 🌐 7. Evidencia de Conexión y Peticiones Reales de Red (Network)

Demostración de la comunicación cliente-servidor en tiempo real entre el Frontend desplegado y la API REST en Render (`https://dailyspace-back.onrender.com`), respondiendo con código HTTP `200 OK` y consumiendo la base de datos real:

![Pestaña Network - Consumo real de la API REST](docs/network-proof.jpg)

