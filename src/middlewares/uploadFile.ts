import multer from "multer";
import type { FileFilterCallback } from "multer";
import type { NextFunction, Request, Response } from "express";
import { throwError } from "../shared/errors/ErrorUtils.js";

// Usar memoryStorage para poder validar dimensiones antes de subir a Cloudinary
const storage = multer.memoryStorage();

const fileFilter = (req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
  const fileTypes = ["image/jpeg", "image/jpg", "image/png"];
  if (fileTypes.some((fileType) => fileType === file.mimetype)) {
    return cb(null, true);
  }
  return cb(new Error("Tipo de archivo no permitido. Solo se aceptan: jpg, jpeg, png") as any);
}

const maxSize = 1024 * 1024 * 5;

export const uploader = (req: Request, res: Response, next: NextFunction) => {
  return multer({
    storage,
    limits: { fileSize: maxSize },
    fileFilter,
  }).single("coverPhoto")(req, res, (err) => {

    if (err instanceof multer.MulterError) {
      throwError.badRequest("Max file size 5MB");
    };
    if (err) {
      throwError.badRequest(err.message);
    }
    if (req.method === "POST" && !req.file) {
      throwError.badRequest("Please upload a file, jpg, jpeg or png");
    }
    next();
  });

};





