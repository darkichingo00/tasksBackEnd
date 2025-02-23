import { Router } from "express";
import { authenticateJWT } from "../middlewares/auth.middleware";
import { TaskController } from "../controller/task.controller";

const router = Router();

// Crea las tareas
router.post("/", authenticateJWT, async (req, res) => {
  try {
    await TaskController.addTask(req, res);
  } catch (error) {
    res.status(500).json({ message: "Error interno del servidor", error });
  }
});

// Actuliza el estado de una tarea por el ID
router.put("/:taskId", authenticateJWT, async (req, res) => {
  try {
    await TaskController.updateTask(req, res);
  } catch (error) {
    res.status(500).json({ message: "Error interno del servidor", error });
  }
});

// Elimina una tarea por ID
router.delete("/:taskId", authenticateJWT, async (req, res) => {
  try {
    await TaskController.deleteTask(req, res);
  } catch (error) {
    res.status(500).json({ message: "Error interno del servidor", error });
  }
});


// Obtener tareas de un usuario autenticado
router.get("/user", authenticateJWT, async (req, res) => {
  try {
    await TaskController.getUserTasks(req, res);
  } catch (error) {
    res.status(500).json({ message: "Error interno del servidor", error });
  }
});

export default router;
