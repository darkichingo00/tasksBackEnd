import jwt from "jsonwebtoken";
import { db } from "../config/firebase";
import dotenv from "dotenv";
import { User } from "../models/user.model";
import { v4 as uuidv4 } from "uuid"; 

dotenv.config();

const SECRET_KEY = process.env.JWT_SECRET || "5up3rP455W0R/*-";
const USER_COLLECTION = "users";

export class AuthService {
  // Login de usuario
  static async login(email: string): Promise<{ token: string; user: User } | null> {
    const user = await this.getUserByEmail(email);
    if (!user) return null;

    const token = this.generateToken(user.userId, user.email, user.fullName);
    return { token, user };
  }

  // Método para generar un token JWT
  static generateToken(userId: string, email: string, fullName: string): string {
    console.log("Generando token para:", email, fullName);
  
    const token = jwt.sign({ userId, email, fullName }, SECRET_KEY, { expiresIn: "365d" });
  
    console.log(" Token generado:", token);
    return token;
  }
  

  // Método para verificar un token
  static verifyToken(token: string): any {
    try {
      return jwt.verify(token, SECRET_KEY);
    } catch (error) {
      return null;
    }
  }

  // Obtener usuario por email desde Firestore
  static async getUserByEmail(email: string): Promise<User | null> {
    const usersRef = db.collection(USER_COLLECTION);
    const snapshot = await usersRef.where("email", "==", email).get();

    if (snapshot.empty) return null;

    return snapshot.docs[0].data() as User;
  }

  // Agregar un nuevo usuario a Firestore
  static async addUser(fullName: string, email: string): Promise<{ token: string; user: User }> {
    const userId = uuidv4(); // ✅ Generamos el ID único para el usuario
    const newUser: User = { userId, fullName, email };

    await db.collection(USER_COLLECTION).doc(userId).set(newUser); // ✅ Guardamos en Firestore con `userId`

    // ✅ Generamos un token que incluye `userId`
    const token = this.generateToken(userId, email, fullName);
    
    return { token, user: newUser };
  }
}
