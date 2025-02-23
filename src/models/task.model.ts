import * as admin from 'firebase-admin';

export enum TaskStatus {
    PENDING = "PENDING",
    CANCEL = "CANCEL",
    COMPLETED = "COMPLETED",
    DELETE = "DELETE"
}
export interface Task {
    id: string;
    title: string;
    description: string;
    date: admin.firestore.Timestamp | string;
    time?: string;
    status: TaskStatus;
    userId: string;    
}
