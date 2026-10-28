# Capa de Infraestructura (Infrastructure Layer)

Implementa las interfaces técnicas y el acceso a datos externos:
- **Prisma Client:** Instancia única y centralizada del cliente de base de datos PostgreSQL.
- **Implementaciones de Repositorios:** `PrismaUserRepository`, `PrismaPostRepository`, `PrismaCommentRepository`.
- **Servicios Externos:** Encriptación con `bcryptjs`, generación y verificación de JWT con `jsonwebtoken`, subida de archivos con `multer`.

> [!IMPORTANT]
> Siguiendo la rúbrica estricta de clase, **Prisma solo vive en esta capa**. Ningún controlador o caso de uso importa Prisma directamente.
