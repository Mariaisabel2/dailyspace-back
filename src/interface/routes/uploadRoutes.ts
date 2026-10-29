import { Router, Request, Response } from "express";
import { uploadImage } from "../../infrastructure/upload/multerConfig.js";
import { authenticateToken } from "../middlewares/authMiddleware.js";
import { BadRequestError } from "../../domain/errors/AppError.js";

const uploadRouter = Router();

/**
 * POST /api/upload
 * Endpoint para subir imágenes de archivo para el catálogo (Bono +4 pts).
 * Retorna la URL pública de la imagen almacenada.
 */
uploadRouter.post(
  "/",
  authenticateToken,
  uploadImage.single("file"),
  (req: Request, res: Response) => {
    if (!req.file) {
      throw new BadRequestError("No se proporcionó ningún archivo de imagen");
    }

    const host = req.get("host") || "localhost:4000";
    const protocol = req.protocol;
    const fileUrl = `${protocol}://${host}/uploads/${req.file.filename}`;

    res.status(201).json({
      url: fileUrl,
      filename: req.file.filename,
      size: req.file.size,
      mimetype: req.file.mimetype,
    });
  }
);

export default uploadRouter;
