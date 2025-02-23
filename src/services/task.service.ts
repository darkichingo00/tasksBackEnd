import { db } from "../config/firebase";
import dotenv from "dotenv";
import { Task, TaskStatus } from "../models/task.model";
import { v4 as uuidv4 } from "uuid"; 
import { Timestamp } from "firebase-admin/firestore";
import * as admin from 'firebase-admin';

dotenv.config();

const TASKS_COLLECTION = "tasks";

export class TaskService {
  
  // Agregar una nueva tarea en Firestore
  static async addTask(
    userId: string,
    title: string,
    description: string,
    date: string,
    time: string,
    status: TaskStatus
  ): Promise<Task> {
    try {
      const id = uuidv4();
  
      // Convertir la fecha y la hora a un objeto Timestamp
      const dateTimeString = `${date}T${time}:00`;
      const dateObject = new Date(dateTimeString);
  
      if (isNaN(dateObject.getTime())) {
        throw new Error('Invalid date or time format');
      }
  
      const timestamp = Timestamp.fromDate(dateObject);
  
      const newTask: Task = {
        id,
        userId,
        title,
        description,
        date: timestamp, // Almacenar como Timestamp
        time,
        status,
      };
  
      await db.collection(TASKS_COLLECTION).doc(id).set(newTask);
  
      return newTask;
    } catch (error) {
      console.error('Error adding task:', error);
      throw error;
    }
  }

  // Actualizar una tarea en Firestore
  static async updateTask(taskId: string, updates: Partial<Task>): Promise<Task | null> {
    try {
      
      if (Object.keys(updates).length === 0) {
        throw new Error('No updates provided');
      }

      console.log(updates);

      await db.collection(TASKS_COLLECTION).doc(taskId).update(updates);

      const updatedTaskDoc = await db.collection(TASKS_COLLECTION).doc(taskId).get();
      if (!updatedTaskDoc.exists) {
        throw new Error('Task not found after update');
      }

 
      const updatedTask = updatedTaskDoc.data() as Task;
      return updatedTask;
    } catch (error) {
      console.error('Error updating task:', error);
      throw error;
    }
  }

  static async deleteTask(taskId: string): Promise<boolean> {
    const taskRef = db.collection(TASKS_COLLECTION).doc(taskId);
    const doc = await taskRef.get();

    if (!doc.exists) return false;

    await taskRef.delete();
    return true;
  }

  static async getTasksByUser(userId: string): Promise<Task[]> {
    try {
      const snapshot = await db.collection('tasks')
        .where('userId', '==', userId)
        .orderBy('date', 'desc')
        .get();
  
      return snapshot.docs.map(doc => {
        const data = doc.data();
  
        // Verificar que `data.date` sea un Timestamp
        if (!(data.date instanceof admin.firestore.Timestamp)) {
          throw new Error(`Invalid date format in document ${doc.id}`);
        }
  
        // Convertir Timestamp a string (ISO)
        const dateString = data.date.toDate().toISOString();
  
        return {
          id: doc.id,
          title: data.title,
          description: data.description,
          date: dateString, // Convertido a string
          status: data.status,
          userId: data.userId,
          time: data.time
        } as Task;
      });
    } catch (error) {
      console.error('Error fetching tasks:', error);
      throw error;
    }
  }
}
