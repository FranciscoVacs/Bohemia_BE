import multer from "multer";
import {CloudinaryStorage} from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinaryConfig.js";
import path from "node:path";
import {Request} from "express";

export const uploadGallery = (folderName: string) => {
    const storage = new CloudinaryStorage({
        cloudinary: cloudinary,
        params: (req: Request, file: Express.Multer.File) => {
            const folderPath = `${folderName.trim()}`; // Update the folder path here
            const fileExtension = path.extname(file.originalname).substring(1);
            const publicId = `${file.fieldname}-${Date.now()}`;
            return {
                folder: folderPath,
                format: fileExtension,
                public_id: publicId,
            };
        },
    });
    return multer({ 
        storage: storage,
        limits: { fileSize: 1024 * 1024 * 15 }, // 15MB limit
    });
};

export default uploadGallery;
