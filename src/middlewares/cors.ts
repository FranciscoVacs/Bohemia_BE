import cors from "cors";

const ACCEPTED_ORIGINS = [
  "http://localhost:4200",
  "http://localhost:8080",
  "http://localhost:1234",
  "https://localhost:3000",
  "https://BohemiaPage.com",
  "https://bohemia-fe.vercel.app",
  "https://bohemia-socialclub.netlify.app",
];

export const corsMiddleware = ({ acceptedOrigins = ACCEPTED_ORIGINS } = {}) =>
  cors({
    origin: (origin, callback) => {
      if (!origin) {
        return callback(null, true);
      }
      if (
        acceptedOrigins.includes(origin) ||
        origin.startsWith("http://localhost") ||
        origin.includes("ngrok-free.dev")
      ) {
        return callback(null, true);
      }
      return callback(new Error("Not allowed by CORS"));
    },
    exposedHeaders: ['token'],
  });
