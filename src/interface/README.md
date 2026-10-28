# Capa de Interfaz (Interface Layer)

Expone la API REST hacia el exterior a través de HTTP:
- **Controladores:** Manejo de peticiones y respuestas HTTP (`AuthController`, `PostController`, `CommentController`).
- **Enrutadores (Routers):** Declaración de rutas y aplicación centralizada de middlewares.
- **Middlewares:** `authenticateToken`, `requireRole("admin")`, middleware global de manejo de errores y validación de DTOs.
- **DTOs / Schemas:** Validación con `zod` de body, query params y route params retornando código 400.
