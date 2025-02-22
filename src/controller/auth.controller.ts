import { Request, Response } from "express";
import { AuthService } from "../services/auth.service";

export class AuthController {
  // Hacer Login
  static async login(req: Request, res: Response): Promise<void> {
    try {
      const { email } = req.body;
      if (!email) {
        res.status(400).json({ message: "El email es obligatorio" });
        return;
      }

      const loginResponse = await AuthService.login(email);
      if (!loginResponse) {
        res.status(401).json({ message: "Usuario no encontrado" });
        return;
      }

      console.log("Respuesta del backend antes de enviar:", loginResponse);

      res.json({
        message: "Inicio de sesión exitoso",
        token: loginResponse.token,
        user: {
          email: loginResponse.user.email,
          fullName: loginResponse.user.fullName || "Sin nombre"
        }
      });
    } catch (error) {
      console.error("Error en el backend:", error);
      res.status(500).json({ message: "Error en el servidor", error });
    }
  }
  // Obtener usuario por email desde Firestore
  static async getUserByEmail(req: Request, res: Response): Promise<void> {
    try {
      const { email } = req.params;
      const user = await AuthService.getUserByEmail(email);

      if (!user) {
        res.status(404).json({ message: "Usuario no encontrado" });
        return;
      }

      res.json(user);
    } catch (error) {
      res.status(500).json({ message: "Error al obtener el usuario", error });
    }
  }

  // Registrar un nuevo usuario en Firestore
  static async register(req: Request, res: Response): Promise<void> {
    try {
      const { fullName, email } = req.body;
      
      if (!fullName || !email) {
        res.status(400).json({ message: "Nombre completo y email son obligatorios." });
        return;
      }

      const existingUser = await AuthService.getUserByEmail(email);
      if (existingUser) {
        res.status(400).json({ message: "El usuario ya existe." });
        return;
      }

      // Registrar usuario y generar token
      const { token, user } = await AuthService.addUser(fullName, email);

      res.status(201).json({
        message: "Usuario registrado con éxito",
        token,
        user
      });
    } catch (error) {
      res.status(500).json({ message: "Error interno del servidor", error });
    }
  }
}
