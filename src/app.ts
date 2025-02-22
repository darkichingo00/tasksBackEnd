import express, { Application, Request, Response, NextFunction } from "express";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import authRoutes from "./routes/auth.routes";
import taskRoutes from "./routes/task.routes";
import logger from "./utils/logger";

// Cargar variables de entorno antes de usar cualquier configuración
dotenv.config();

// Verificar si `JWT_SECRET` se cargó correctamente
console.log("📢 SECRET_KEY cargado desde .env:", process.env.JWT_SECRET || "NO DEFINIDO");

// Crear la aplicación Express
const app: Application = express();

// Configurar CORS para permitir conexiones desde el frontend
const corsOptions = {
    origin: process.env.FRONTEND_URL || "*",
    methods: "GET,POST,PUT,DELETE",
    allowedHeaders: "Content-Type,Authorization",
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Seguridad con Helmet
app.use(helmet());

// Limitar peticiones para evitar ataques de fuerza bruta
app.use(
    rateLimit({
        windowMs: 15 * 60 * 1000, // 15 minutos
        max: 100, // Limita a 100 peticiones por IP
        message: "Demasiadas solicitudes, intenta más tarde.",
    })
);

// Middleware para logging de cada petición
app.use((req, res, next) => {
    logger.info(`${req.method} ${req.url}`);
    next();
});

// Ruta de prueba para verificar que el servidor está funcionando
app.get("/", (req, res) => {
    res.status(200).json({ message: "Servidor Express con TypeScript funcionando correctamente!" });
});

// Configurar rutas
app.use("/auth", authRoutes);
app.use("/tasks", taskRoutes);

// Middleware para manejar errores 404 (Ruta no encontrada)
app.use((req: Request, res: Response) => {
    res.status(404).json({ error: "uta no encontrada" });
});

// Middleware para manejar errores globales
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error("Error interno:", err.message);
    res.status(500).json({ error: "Error interno del servidor", message: err.message });
});

export default app;
