import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
import path from "node:path";

// 1. Carga normal (busca .env en process.cwd())
dotenv.config();

// 2. Fallback: Ruta explícita si falló la carga por defecto
if (!process.env.CLOUDINARY_API_KEY) {
  const envPath = path.resolve(process.cwd(), '.env');
  dotenv.config({ path: envPath });
}

// 3. Verificación y logging de error
if (!process.env.CLOUDINARY_API_KEY) {
  console.error("❌ [Cloudinary] ERROR CRÍTICO: No se encontraron las credenciales.");
  console.error("    CWD:", process.cwd());
}

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default cloudinary;