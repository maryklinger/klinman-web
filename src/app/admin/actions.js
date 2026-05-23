'use server';

import sql from "mssql";
import { revalidatePath } from "next/cache";

// Configuración de la base de datos
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

// Instancia única de conexión para evitar fugas de pools en Next.js
let globalPool = null;
async function getPool() {
  if (!globalPool) {
    globalPool = await sql.connect(config);
  }
  return globalPool;
}

// ==========================================
// 1. FUNCIONES DE SOLICITUDES Y USUARIOS
// ==========================================

export async function actualizarEstado(id, nuevoEstado) {
  try {
    const pool = await getPool();
    await pool.request()
      .input("id", sql.Int, id)
      .input("estado", sql.NVarChar, nuevoEstado)
      .query("UPDATE solicitudes SET estado = @estado WHERE id = @id");

    revalidatePath("/admin");
    return { success: true };
  } catch (error) {
    console.error("Error en actualizarEstado:", error);
    return { success: false, error: error.message };
  }
}

export async function actualizarPrioridad(id, nuevaPrioridad) {
  try {
    const pool = await getPool();
    await pool.request()
      .input("id", sql.Int, id)
      .input("prioridad", sql.NVarChar, nuevaPrioridad)
      .query("UPDATE solicitudes SET prioridad = @prioridad WHERE id = @id");

    revalidatePath("/admin");
    return { success: true };
  } catch (error) {
    console.error("Error en actualizarPrioridad:", error);
    return { success: false, error: error.message };
  }
}

export async function actualizarUsuarioAction(id, datos) {
  try {
    const pool = await getPool();
    await pool.request()
      .input("id", sql.Int, id)
      .input("nombre", sql.NVarChar, datos.nombre)
      .input("email", sql.NVarChar, datos.email)
      .input("rol_id", sql.Int, datos.rol_id)
      .query("UPDATE usuarios SET nombre = @nombre, email = @email, rol_id = @rol_id WHERE id = @id");

    revalidatePath("/admin/usuarios");
    return { success: true };
  } catch (error) {
    console.error("Error en actualizarUsuarioAction:", error);
    return { success: false, error: error.message };
  }
}

export async function cambiarEstadoUsuarioAction(id, nuevoEstadoBit) {
  try {
    const pool = await getPool();
    await pool.request()
      .input("id", sql.Int, id)
      .input("estado", sql.Bit, nuevoEstadoBit)
      .query("UPDATE usuarios SET estado = @estado WHERE id = @id");

    revalidatePath("/admin/usuarios");
    return { success: true };
  } catch (error) {
    console.error("Error en cambiarEstadoUsuarioAction:", error);
    return { success: false, error: error.message };
  }
}

export async function crearUsuarioAction(datos) {
  try {
    const pool = await getPool();
    const checkEmail = await pool.request()
      .input("email", sql.NVarChar, datos.email)
      .query("SELECT id FROM usuarios WHERE email = @email");
      
    if (checkEmail.recordset.length > 0) {
      return { success: false, error: "EL EMAIL YA SE ENCUENTRA REGISTRADO" };
    }

    await pool.request()
      .input("nombre", sql.NVarChar, datos.nombre)
      .input("email", sql.NVarChar, datos.email)
      .input("rol_id", sql.Int, datos.rol_id)
      .input("estado", sql.Bit, 1)
      .input("password_hash", sql.NVarChar, "KLINMAN_2026")
      .query("INSERT INTO usuarios (nombre, email, rol_id, estado, password_hash) VALUES (@nombre, @email, @rol_id, @estado, @password_hash)");

    revalidatePath("/admin/usuarios");
    return { success: true };
  } catch (error) {
    console.error("Error en crearUsuarioAction:", error);
    return { success: false, error: error.message };
  }
}

export async function actualizarPermisosRolAction(rolId, arrayPermisosCortos) {
  try {
    const pool = await getPool();
    const transaction = new sql.Transaction(pool);
    await transaction.begin();

    try {
      await new sql.Request(transaction)
        .input("rol_id", sql.Int, rolId)
        .query("DELETE FROM rol_permisos WHERE rol_id = @rol_id");

      if (arrayPermisosCortos && arrayPermisosCortos.length > 0) {
        for (const codigoPermiso of arrayPermisosCortos) {
          await new sql.Request(transaction)
            .input("rol_id", sql.Int, rolId)
            .input("codigo", sql.NVarChar, codigoPermiso)
            .query("INSERT INTO rol_permisos (rol_id, permiso_id) SELECT @rol_id, id FROM permisos WHERE codigo = @codigo");
        }
      }

      await transaction.commit();
      revalidatePath("/admin/usuarios");
      return { success: true };
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  } catch (error) {
    console.error("Error en actualizarPermisosRolAction:", error);
    return { success: false, error: error.message };
  }
}

// ==========================================
// 3. AUTENTICACIÓN / LOGIN BLINDADO
// ==========================================

export async function loginUsuarioAction(email, password, perfil) {
  try {
    // 1. Validaciones iniciales de presencia
    if (!email || !password || !perfil) {
      return { success: false, error: "TODOS LOS CAMPOS SON OBLIGATORIOS." };
    }

    const emailNormalizado = email.trim().toUpperCase();

    // 2. Conexión segura usando la instancia reutilizable
    const pool = await getPool();

    // 3. Búsqueda directa del usuario
    const resultUsuario = await pool.request()
      .input("email", sql.NVarChar, emailNormalizado)
      .query("SELECT id, nombre, email, rol_id, password_hash, estado FROM usuarios WHERE email = @email");

    const usuario = resultUsuario.recordset[0];

    if (!usuario) {
      return { success: false, error: "CREDENCIALES INVÁLIDAS." };
    }

    if (!usuario.estado) {
      return { success: false, error: "EL USUARIO SE ENCUENTRA DESACTIVADO." };
    }

    // 4. VALIDACIÓN DE CONTRASEÑA ULTRA-SEGURA (Evita caídas por librerías externas)
    let contrasenaValida = false;
    try {
      if (usuario.password_hash.startsWith('$2a$') || usuario.password_hash.startsWith('$2b$')) {
        // Aislamos dinámicamente la importación para que no rompa el hilo principal si falla
        const { compararContrasena } = await import("../../lib/crypto");
        contrasenaValida = await compararContrasena(password, usuario.password_hash);
      } else {
        // Comparación directa en texto plano (como está guardado "KLINMAN_2026")
        contrasenaValida = (password === usuario.password_hash);
      }
    } catch (cryptoError) {
      console.warn("Advertencia en el módulo crypto, usando fallback de texto plano:", cryptoError);
      contrasenaValida = (password === usuario.password_hash);
    }

    if (!contrasenaValida) {
      return { success: false, error: "CREDENCIALES INVÁLIDAS." };
    }

    // 5. MAPEO DE ROLES COHERENTE CON TU BASE DE DATOS (Fernanda es rol_id = 2)
    const mapaRoles = {
      'ADMIN': 1,
      'SUPERVISOR': 2,
      'OPERADOR': 3
    };

    const idRolEsperado = mapaRoles[perfil.toUpperCase()];

    if (usuario.rol_id !== idRolEsperado) {
      return { 
        success: false, 
        error: `EL USUARIO NO TIENE EL PERFIL DE ${perfil.toUpperCase()}.` 
      };
    }

    // 6. OBTENCIÓN DE PERMISOS ASOCIADOS
    let arrayPermisos = [];
    try {
      const resultPermisos = await pool.request()
        .input("rol_id", sql.Int, usuario.rol_id)
        .query(`
          SELECT p.codigo 
          FROM rol_permisos rp
          JOIN permisos p ON rp.permiso_id = p.id
          WHERE rp.rol_id = @rol_id
        `);
      arrayPermisos = resultPermisos.recordset.map(row => row.codigo);
    } catch (permisosError) {
      console.error("Error al leer permisos del rol, continuando con array vacío:", permisosError);
    }

    // 7. RESPUESTA EXITOSA DE AUTENTICACIÓN
    return {
      success: true,
      user: {
        id: usuario.id,
        nombre: usuario.nombre,
        email: usuario.email,
        rol_id: usuario.rol_id,
        permisos: arrayPermisos 
      }
    };

  } catch (error) {
    // ESTO VA A IMPRIMIR EL ERROR REAL EN TU TERMINAL DE VSCODE
    console.error("❌ ERROR CRÍTICO DETECTADO EN EL LOGIN:", error);
    
    // Devolvemos el mensaje exacto del error para que sepas qué está fallando sin adivinar
    return { 
      success: false, 
      error: `ERROR DEL SERVIDOR: ${error.message || "Consulte la consola de comandos"}` 
    };
  }
}