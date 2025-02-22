import { Router } from "express";
import { AuthController } from "../controller/auth.controller";
import { authenticateJWT } from "../middlewares/auth.middleware";
import { TaskController } from "../controller/task.controller";

const router = Router();

// Optine un usario por su email
router.get("/user/:email", async (req, res) => {
  try {
    await AuthController.getUserByEmail(req, res);
  } catch (error) {
    res.status(500).json({ message: "Error interno del servidor", error });
  }
});

// Registra un usuario
router.post("/register", async (req, res) => {
  try {
    await AuthController.register(req, res);
  } catch (error) {
    res.status(500).json({ message: "Error interno del servidor", error });
  }
});

//Realiza el login
router.post("/login", async (req, res) => {
  try {
    await AuthController.login(req, res);
  } catch (error) {
    res.status(500).json({ message: "Error interno del servidor", error });
  }
});

export default router;
