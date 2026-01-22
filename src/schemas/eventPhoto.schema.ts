import { z } from "zod";

export const UploadEventPhotoSchema = z.object({
    params: z.object({
        eventId: z.coerce.number().int().positive("El ID del evento debe ser un número positivo"),
    }),
});

export const UpdateEventPhotoSchema = z.object({
    body: z.object({
        cloudinaryUrl: z.string().url("La URL de Cloudinary debe ser válida").optional(),
        publicId: z.string().min(1, "El Public ID es requerido").optional(),
        originalName: z.string().min(1, "El nombre original es requerido").optional(),
        event: z.coerce.number().int().positive("El ID del evento debe ser un número positivo").optional(),
    }),
    params: z.object({
        id: z.coerce.number().int().positive("El ID debe ser un número positivo"),
    }),
});
