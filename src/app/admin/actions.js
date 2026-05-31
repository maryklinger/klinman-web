'use server';

import sql from "mssql";
import { revalidatePath } from "next/cache";

const config = {
  user: process.env.DB_USER || "",
  password: process.env.DB_PASSWORD || "",
  server: process.env.DB_SERVER || "",
  database: process.env.DB_DATABASE || "",
  options: { encrypt: true, trustServerCertificate: true },
};

let globalPool = null;
async function getPool() {
  if (!globalPool) globalPool = await sql.connect(config);
  return globalPool;
}

// ==========================================
// 1. FUNCIONES DE USUARIOS Y SOLICITUDES
// ==========================================

export async function actualizarEstado(id, nuevoEstado) {
  const pool = await getPool();
  await pool.request().input("id", sql.Int, id).input("estado", sql.NVarChar, nuevoEstado)
      .query("UPDATE solicitudes SET estado = @estado WHERE id = @id");
  revalidatePath("/admin");
  return { success: true };
}

export async function actualizarPrioridad(id, nuevaPrioridad) {
  const pool = await getPool();
  await pool.request().input("id", sql.Int, id).input("prioridad", sql.NVarChar, nuevaPrioridad)
      .query("UPDATE solicitudes SET prioridad = @prioridad WHERE id = @id");
  revalidatePath("/admin");
  return { success: true };
}

export async function actualizarUsuarioAction(id, datos) {
  const pool = await getPool();
  await pool.request().input("id", sql.Int, id).input("nombre", sql.NVarChar, datos.nombre)
      .input("email", sql.NVarChar, datos.email).input("rol_id", sql.Int, datos.rol_id)
      .query("UPDATE usuarios SET nombre = @nombre, email = @email, rol_id = @rol_id WHERE id = @id");
  revalidatePath("/admin/usuarios");
  return { success: true };
}

export async function cambiarEstadoUsuarioAction(id, nuevoEstadoBit) {
  const pool = await getPool();
  await pool.request().input("id", sql.Int, id).input("estado", sql.Bit, nuevoEstadoBit)
      .query("UPDATE usuarios SET estado = @estado WHERE id = @id");
  revalidatePath("/admin/usuarios");
  return { success: true };
}

export async function crearUsuarioAction(datos) {
  const pool = await getPool();
  const checkEmail = await pool.request().input("email", sql.NVarChar, datos.email)
      .query("SELECT id FROM usuarios WHERE email = @email");
  if (checkEmail.recordset.length > 0) return { success: false, error: "EL EMAIL YA ESTÁ REGISTRADO" };

  await pool.request().input("nombre", sql.NVarChar, datos.nombre).input("email", sql.NVarChar, datos.email)
      .input("rol_id", sql.Int, datos.rol_id).input("estado", sql.Bit, 1).input("password_hash", sql.NVarChar, "KLINMAN_2026")
      .query("INSERT INTO usuarios (nombre, email, rol_id, estado, password_hash) VALUES (@nombre, @email, @rol_id, @estado, @password_hash)");
  revalidatePath("/admin/usuarios");
  return { success: true };
}

// ==========================================
// 2. GESTIÓN DE PERMISOS (ROL Y USUARIO)
// ==========================================





export async function actualizarPermisosRolAction(rolId, arrayPermisosCortos) {
  const pool = await getPool();
  const transaction = new sql.Transaction(pool);
  await transaction.begin();
  try {
    await new sql.Request(transaction).input("rol_id", sql.Int, rolId).query("DELETE FROM rol_permisos WHERE rol_id = @rol_id");
    for (const codigo of arrayPermisosCortos) {
      await new sql.Request(transaction).input("rol_id", sql.Int, rolId).input("codigo", sql.NVarChar, codigo)
        .query("INSERT INTO rol_permisos (rol_id, permiso_id) SELECT @rol_id, id FROM permisos WHERE codigo = @codigo");
    }
    await transaction.commit();
    return { success: true };
  } catch (e) { await transaction.rollback(); throw e; }
}

export async function actualizarPermisosUsuarioAction(usuarioId, arrayPermisosCortos) {
  const pool = await getPool();
  const transaction = new sql.Transaction(pool);
  await transaction.begin();
  try {
    await new sql.Request(transaction).input("u_id", sql.Int, usuarioId).query("DELETE FROM usuario_permisos WHERE usuario_id = @u_id");
    for (const codigo of arrayPermisosCortos) {
      await new sql.Request(transaction).input("u_id", sql.Int, usuarioId).input("codigo", sql.NVarChar, codigo)
        .query("INSERT INTO usuario_permisos (usuario_id, permiso_id) SELECT @u_id, id FROM permisos WHERE codigo = @codigo");
    }
    await transaction.commit();
    revalidatePath("/admin/usuarios");
    return { success: true };
  } catch (e) { await transaction.rollback(); throw e; }
}

// ==========================================
// 3. LOGIN CON PERMISOS UNIFICADOS
// ==========================================

export async function loginUsuarioAction(email, password, perfil) {
  const pool = await getPool();
  const res = await pool.request().input("email", sql.NVarChar, email.trim().toUpperCase())
      .query("SELECT id, nombre, rol_id, password_hash, estado FROM usuarios WHERE email = @email");
  
  const usuario = res.recordset[0];
  if (!usuario || !usuario.estado) return { success: false, error: "CREDENTIALES INVÁLIDAS" };
  
  // (Lógica de password omitida por brevedad, mantén la tuya aquí)
  
  // CONSULTA UNIFICADA: ROL + PERMISOS ESPECÍFICOS DEL USUARIO
  const resPermisos = await pool.request()
    .input("rol_id", sql.Int, usuario.rol_id)
    .input("u_id", sql.Int, usuario.id)
    .query(`
      SELECT codigo FROM permisos WHERE id IN (
        SELECT permiso_id FROM rol_permisos WHERE rol_id = @rol_id
        UNION
        SELECT permiso_id FROM usuario_permisos WHERE usuario_id = @u_id
      )
    `);

  return {
    success: true,
    user: { ...usuario, permisos: resPermisos.recordset.map(r => r.codigo) }
  };
}

// ==========================================
// 4. NUEVAS FUNCIONES PARA DASHBOARD Y BITÁCORA
// ==========================================

export async function asignarOperadorAction(ticketId, operadorId) {
  const pool = await getPool();
  try {
    // 1. Asignamos el operador al ticket
    // Nota: Asegúrate de tener la columna 'operador_id' en tu tabla 'solicitudes'
    await pool.request()
      .input("ticketId", sql.Int, ticketId)
      .input("operadorId", sql.Int, operadorId)
      .query("UPDATE solicitudes SET operador_id = @operadorId, estado = 'En Revisión' WHERE id = @ticketId");

    // 2. Registramos el movimiento en la bitácora automáticamente
    await pool.request()
      .input("ticketId", sql.Int, ticketId)
      .input("msg", sql.NVarChar, `Ticket asignado a operador ID: ${operadorId}`)
      .query("INSERT INTO bitacora_ticket (ticket_id, mensaje_actualizacion) VALUES (@ticketId, @msg)");

    revalidatePath("/admin");
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export async function registrarBitacoraAction(ticketId, mensaje) {
  const pool = await getPool();
  try {
    await pool.request()
      .input("ticketId", sql.Int, ticketId)
      .input("msg", sql.NVarChar, mensaje)
      .query("INSERT INTO bitacora_ticket (ticket_id, mensaje_actualizacion) VALUES (@ticketId, @msg)");
    
    revalidatePath("/admin");
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
}
