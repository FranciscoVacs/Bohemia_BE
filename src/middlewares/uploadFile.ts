import multer from "multer";
import type { FileFilterCallback } from "multer";
import path from "node:path";
import { fileURLToPath } from 'node:url';
import type { NextFunction, Request, Response } from "express";
import { error } from "node:console";

const __filename = fileURLToPath(import.meta.url); // get the resolved path to the file
const __dirname = path.dirname(__filename); // get the name of the directory
const storage = multer.diskStorage({
  destination: path.join(__dirname, "../../public/uploads"),
  filename: (req: Request , file: Express.Multer.File, cb: (error:Error | null, destination:string) => void
)=> {
    cb(null, `${Date.now()}_${file.originalname}`);
  }
});

const fileFilter = (req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
  const  fileTypes = ["image/jpeg", "image/jpg", "image/png"];
  if (fileTypes.some((fileType)=> fileType === file.mimetype)) {
    return  cb(null, true);
  }
  return cb(null, false);
}

const maxSize = 1024 * 1024 * 5;

export const uploader = (req: Request, res: Response, next: NextFunction) => {
  return multer({
    storage,
    limits: { fileSize: maxSize },
    fileFilter,
  }).single("cover_photo")(req, res, (err) =>{

    if(err instanceof multer.MulterError){
      return res.status(400).send({
        message: "Max file size 5MB",
      });
    };
    if (err) {
      return res.status(400).send({
        message: err.message,
      });
    }
    if (req.method === "POST" && !req.file) {    // Si es PATCH y no se envió archivo, permitimos que continúe
      return res.status(400).send({
        message: "Please upload a file, jpg, jpeg or png",
      });
    }
    next();
  });

};





