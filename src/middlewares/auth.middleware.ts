import { RequestHandler } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { AuthenticatedRequest } from "../types/express";

dotenv.config();

const SECRET_KEY = process.env.JWT_SECRET || "";

if (!SECRET_KEY) {
    throw new Error("Falta la variable de entorno JWT_SECRET");
}

export const authenticateJWT: RequestHandler = (req, res, next): void => {
    const token = req.header("Authorization")?.split(" ")[1];

    if (!token) {
        res.status(401).json({ message: "Acceso no autorizado, token requerido" });
        return;
    }

    try {
        const decoded = jwt.verify(token, SECRET_KEY );
        (req as AuthenticatedRequest).user = decoded;
        next();
    } catch (error) {
        res.status(403).json({ message: "Token inválido o expirado" });
        return;
    }
};
