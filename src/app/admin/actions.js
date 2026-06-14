'use server';

import sql from "@/lib/db";
import { revalidatePath } from "next/cache";

// ==========================================
// 1. FUNCIONES DE USUARIOS Y SOLICITUDES
// ==========================================

export async function actualizarEstado(id, nuevoEstado) {
  await sql`UPDATE solicitudes SET estado = ${nuevoEstado} WHERE id = ${id}`;
  revalidatePath("/admin");
  return { success: true };
}

export async function actualizarPrioridad(id, nuevaPrioridad) {
  await sql`UPDATE solicitudes SET prioridad = ${nuevaPrioridad} WHERE id = ${id}`;
  revalidatePath("/admin");
  return { success: true };
}

export async function actualizarUsuarioAction(id, datos) {
  await sql`UPDATE usuarios SET nombre = ${datos.nombre}, email = ${datos.email}, rol_id = ${datos.rol_id} WHERE id = ${id}`;
  revalidatePath("/admin/usuarios");
  return { success: true };
}

export async function cambiarEstadoUsuarioAction(id, nuevoEstadoBool) {
  await sql`UPDATE usuarios SET estado = ${nuevoEstadoBool} WHERE id = ${id}`;
  revalidatePath("/admin/usuarios");
  return { success: true };
}

export async function crearUsuarioAction(datos) {
  const checkEmail = await sql`SELECT id FROM usuarios WHERE email = ${datos.email}`;
  if (checkEmail.length > 0) return { success: false, error: "EL EMAIL YA ESTÁ REGISTRADO" };

  await sql`
    INSERT INTO usuarios (nombre, email, rol_id, estado, password_hash) 
    VALUES (${datos.nombre}, ${datos.email}, ${datos.rol_id}, TRUE, 'KLINMAN_2026')
  `;
  revalidatePath("/admin/usuarios");
  return { success: true };
}

// ==========================================
// 2. GESTIÓN DE PERMISOS
// ==========================================

export async function actualizarPermisosRolAction(rolId, arrayPermisosCortos) {
  try {
    await sql.begin(async (sql) => {
      await sql`DELETE FROM rol_permisos WHERE rol_id = ${rolId}`;
      for (const codigo of arrayPermisosCortos) {
        await sql`INSERT INTO rol_permisos (rol_id, permiso_id) SELECT ${rolId}, id FROM permisos WHERE clave_permiso = ${codigo}`;
      }
    });
    return { success: true };
  } catch (e) { throw e; }
}

export async function actualizarPermisosUsuarioAction(usuarioId, arrayPermisosCortos) {
  try {
    await sql.begin(async (sql) => {
      await sql`DELETE FROM usuario_permisos WHERE usuario_id = ${usuarioId}`;
      for (const codigo of arrayPermisosCortos) {
        await sql`INSERT INTO usuario_permisos (usuario_id, permiso_id) SELECT ${usuarioId}, id FROM permisos WHERE clave_permiso = ${codigo}`;
      }
    });
    revalidatePath("/admin/usuarios");
    return { success: true };
  } catch (e) { throw e; }
}

// ==========================================
// 3. LOGIN CON PERMISOS UNIFICADOS
// ==========================================

export async function loginUsuarioAction(email, password, perfil) {
  const res = await sql`SELECT id, nombre, rol_id, password_hash, estado FROM usuarios WHERE email = ${email.trim().toUpperCase()}`;
  
  const usuario = res[0];
  if (!usuario || !usuario.estado) return { success: false, error: "CREDENCIALES INVÁLIDAS" };
  
  // CONSULTA UNIFICADA: ROL + PERMISOS
  const resPermisos = await sql`
    SELECT clave_permiso FROM permisos WHERE id IN (
      SELECT permiso_id FROM rol_permisos WHERE rol_id = ${usuario.rol_id}
      UNION
      SELECT permiso_id FROM usuario_permisos WHERE usuario_id = ${usuario.id}
    )
  `;

  return {
    success: true,
    user: { ...usuario, permisos: resPermisos.map(r => r.clave_permiso) }
  };
}

// ==========================================
// 4. DASHBOARD Y BITÁCORA
// ==========================================

export async function asignarOperadorAction(ticketId, operadorId) {
  try {
    await sql`UPDATE solicitudes SET operador_id = ${operadorId}, estado = 'En Revisión' WHERE id = ${ticketId}`;
    await sql`INSERT INTO bitacora_ticket (ticket_id, mensaje_actualizacion) VALUES (${ticketId}, ${'Ticket asignado a operador ID: ' + operadorId})`;
    
    revalidatePath("/admin");
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export async function registrarBitacoraAction(ticketId, mensaje) {
  try {
    await sql`INSERT INTO bitacora_ticket (ticket_id, mensaje_actualizacion) VALUES (${ticketId}, ${mensaje})`;
    revalidatePath("/admin");
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
}