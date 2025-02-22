import dotenv from "dotenv";
dotenv.config();

import app from "./app";

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log("Servidor corriendo en: http://localhost:${PORT}");
    console.log("Servidor corriendo en:", process.env.PORT);
    console.log("Clave privada Firebase (cortada):", process.env.FIREBASE_PRIVATE_KEY?.slice(0, 20));
});

