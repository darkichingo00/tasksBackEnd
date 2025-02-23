import { Request, Response } from "express";
import { TaskService } from "../services/task.service";
import { TaskStatus } from "../models/task.model";
import { AuthenticatedRequest } from "../types/express";

export class TaskController {

  // Agregar una tarea
  static async addTask(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { title, description, date, time, status } = req.body;

      if (!req.user) {
        res.status(401).json({ message: "Usuario no autenticado" });
        return;
      }

      const userId = req.user.userId;

      if (!title || !description || !date || !status) {
        res.status(400).json({ message: "Título, descripción, fecha y estado son obligatorios" });
        return;
      }

      if (!Object.values(TaskStatus).includes(status as TaskStatus)) {
        res.status(400).json({ message: "Estado de tarea no válido." });
        return;
      }

      const newTask = await TaskService.addTask(userId, title, description, date, time, status as TaskStatus);

      res.status(201).json({ message: "Tarea creada exitosamente", task: newTask });
    } catch (error) {
      res.status(500).json({ message: "Error al agregar la tarea", error });
    }
  }

  // Actualizar el estado de una tarea por ID
  static async updateTask(req: Request, res: Response): Promise<void> {
    try {
      const taskId = req.params.taskId;
      const { status } = req.body;

      if (!status || !Object.values(TaskStatus).includes(status)) {
        res.status(400).json({ message: "Estado de tarea no válido o no proporcionado." });
        return;
      }

      const updatedTask = await TaskService.updateTask(taskId, { status });
      if (!updatedTask) {
        res.status(404).json({ message: "Tarea no encontrada" });
        return;
      }
      res.json({ message: "Estado de la tarea actualizado correctamente", task: updatedTask });
    } catch (error) {
      res.status(500).json({ message: "Error al actualizar el estado de la tarea", error });
    }
  }

  // Eliminar una tarea por ID
  static async deleteTask(req: Request, res: Response): Promise<void> {
    try {
      const taskId = req.params.taskId;
      const deleted = await TaskService.deleteTask(taskId);
      if (!deleted) {
        res.status(404).json({ message: "Tarea no encontrada" });
        return;
      }
      res.json({ message: "Tarea eliminada correctamente" });
    } catch (error) {
      res.status(500).json({ message: "Error al eliminar la tarea", error });
    }
  }

  // Obtener tareas de un usuario autenticado
  static async getUserTasks(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ message: "Usuario no autenticado" });
        return;
      }
      const userId = req.user.userId;

      const tasks = await TaskService.getTasksByUser(userId);

      res.json({ message: "Tareas obtenidas correctamente", tasks });
    } catch (error) {
      res.status(500).json({ message: "Error al obtener tareas del usuario", error });
    }
  }
}
