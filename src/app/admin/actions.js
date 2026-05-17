'use server';

import sql from "mssql";
import { revalidatePath } from "next/cache";

const config = {
  user: process.env.DB_USER || "",
  password: process.env.DB_PASSWORD || "",
  server: process.env.DB_SERVER || "",
  database: process.env.DB_DATABASE || "",
  options: {
    encrypt: true,
    trustServerCertificate: true,
  },
};

// --- FUNCIÓN EXISTENTE ---
export async function actualizarEstado(id, nuevoEstado) {
  let pool;
  try {
    pool = await sql.connect(config);
    await pool
      .request()
      .input("id", sql.Int, id)
      .input("estado", sql.NVarChar, nuevoEstado)
      .query(`
        UPDATE solicitudes
        SET estado = @estado
        WHERE id = @id
      `);

    revalidatePath("/admin");
    revalidatePath(`/admin/solicitudes/${id}`);
    return { success: true };
  } catch (error) {
    console.error(error);
    return { success: false, error: error.message };
  } finally {
    if (pool) await pool.close();
  }
}

// --- NUEVA FUNCIÓN PARA PRIORIDAD ---
export async function actualizarPrioridad(id, nuevaPrioridad) {
  let pool;
  try {
    pool = await sql.connect(config);
    await pool
      .request()
      .input("id", sql.Int, id)
      .input("prioridad", sql.NVarChar, nuevaPrioridad)
      .query(`
        UPDATE solicitudes
        SET prioridad = @prioridad
        WHERE id = @id
      `);

    // Revalidamos las rutas para que los cambios se vean reflejados de inmediato
    revalidatePath("/admin");
    revalidatePath(`/admin/solicitudes/${id}`);


    return { success: true };
  } catch (error) {
    console.error(error);
    return { success: false, error: error.message };
  } finally {
    if (pool) await pool.close();
  }
}