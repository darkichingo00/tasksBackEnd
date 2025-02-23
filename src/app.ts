import express, { Application, Request, Response, NextFunction } from "express";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import authRoutes from "./routes/auth.routes";
import taskRoutes from "./routes/task.routes";

// Cargar variables de entorno antes de configurar Express
dotenv.config();

// Verificar si `JWT_SECRET` se cargó correctamente
console.log(" SECRET_KEY cargado desde .env:", process.env.JWT_SECRET || "NO DEFINIDO");

// Crear la aplicación Express
const app: Application = express();

// 🔹 Importante para que Express confíe en Railway como proxy
app.set("trust proxy", 1);

// Configurar CORS para permitir conexiones desde el frontend
app.use(cors({
    origin: '*',
    methods: 'GET,POST,PUT,DELETE',
    allowedHeaders: 'Content-Type,Authorization'
  }));

// Middleware para parsear JSON y formularios
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Seguridad con Helmet
app.use(helmet());

// Limitar peticiones para evitar abusos en Railway
app.use(
    rateLimit({
        windowMs: 10 * 60 * 1000, // 10 minutos
        max: 200, // Permitir hasta 200 peticiones por IP
        message: " Has realizado demasiadas solicitudes, intenta más tarde.",
    })
);

// Middleware para logging de cada petición (opcional, si no usas logger, puedes eliminarlo)
app.use((req, res, next) => {
    console.log(` ${req.method} ${req.url}`);
    next();
});

// Ruta de prueba para verificar que el servidor está funcionando
app.get("/", (req, res) => {
    res.status(200).json({ message: " Servidor Express con TypeScript funcionando en Railway!" });
});

// Configurar rutas
app.use("/auth", authRoutes);
app.use("/tasks", taskRoutes);

// Middleware para manejar errores 404 (Ruta no encontrada)
app.use((req: Request, res: Response) => {
    res.status(404).json({ error: " Ruta no encontrada" });
});

// Middleware para manejar errores globales
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error(" Error interno:", err.message);
    res.status(500).json({ error: " Error interno del servidor", message: err.message });
});

export default app;
