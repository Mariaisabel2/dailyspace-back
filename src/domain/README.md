# Capa de Dominio (Domain Layer)

Contiene la lógica de negocio pura e independiente de frameworks:
- **Entidades:** Modelos de datos del negocio (`User`, `Post`, `Comment`).
- **Interfaces de Repositorios:** Contratos que definen cómo acceder a los datos sin importar la base de datos subyacente (`IUserRepository`, `IPostRepository`, `ICommentRepository`).
- **Errores de Dominio:** Excepciones específicas de las reglas de negocio.
