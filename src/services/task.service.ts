import { db } from "../config/firebase";
import dotenv from "dotenv";
import { Task, TaskStatus } from "../models/task.model";
import { v4 as uuidv4 } from "uuid"; 
import { Timestamp } from "firebase-admin/firestore";

dotenv.config();

const TASKS_COLLECTION = "tasks";

export class TaskService {
  // Obtener todas las tareas
  static async getAllTasks(): Promise<Task[]> {
    const snapshot = await db.collection(TASKS_COLLECTION).get();
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Task));
  }

  // Agregar una nueva tarea en Firestore
  static async addTask(userId: string, title: string, description: string, date: string, status: TaskStatus): Promise<Task> {
    const id = uuidv4();
    const newTask: Task = { id, userId, title, description, date: Timestamp.fromDate(new Date(date)), status };

    await db.collection(TASKS_COLLECTION).doc(id).set(newTask);

    return newTask;
  }

  // Actualizar una tarea en Firestore
  static async updateTask(taskId: string, updatedTask: Partial<Task>): Promise<Task | null> {
    const taskRef = db.collection(TASKS_COLLECTION).doc(taskId);
    const doc = await taskRef.get();

    if (!doc.exists) return null;

    await taskRef.update(updatedTask);
    const updatedData = await taskRef.get();
    return { id: taskId, ...updatedData.data() } as Task;
  }

  // Actualizar detalles de una tarea sin cambiar su estado
  static async updateTaskDetails(taskId: string, title: string, description: string, date: string): Promise<Task | null> {
    return this.updateTask(taskId, { title, description, date });
  }

  // Eliminar una tarea en Firestore
  static async deleteTask(taskId: string): Promise<boolean> {
    const taskRef = db.collection(TASKS_COLLECTION).doc(taskId);
    const doc = await taskRef.get();

    if (!doc.exists) return false;

    await taskRef.delete();
    return true;
  }

  static async getTasksByUser(userId: string): Promise<Task[]> {
    const snapshot = await db.collection(TASKS_COLLECTION)
      .where("userId", "==", userId)
      .orderBy("date", "desc") // ✅ Ahora `date` es `Timestamp`
      .get();

    return snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          date: (data.date as Timestamp).toDate().toISOString() // ✅ Convertir `Timestamp` a `string`
        } as Task;
    });
  }

}
