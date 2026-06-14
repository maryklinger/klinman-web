// src/lib/db.js
import postgres from 'postgres';

// Asegúrate de tener DATABASE_URL en tu .env.local
const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("La variable de entorno DATABASE_URL no está definida.");
}

// Creamos el cliente de postgres
const sql = postgres(connectionString, {
  ssl: 'require' // Requerido para Neon
});

export default sql;