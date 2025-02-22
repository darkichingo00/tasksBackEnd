import { Timestamp } from "firebase-admin/firestore";

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
    date: Timestamp | string;
    status: TaskStatus;
    userId: string;
}
