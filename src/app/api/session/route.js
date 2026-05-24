export const dynamic = 'force-dynamic';

import sql from "mssql";
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers'; 

// 🔑 Configuración blindada con credenciales de respaldo para Vercel
const config = {
  user: process.env.DB_USER || "adminklinman",
  password: process.env.DB_PASSWORD || "K25250438-9",
  server: process.env.DB_SERVER || "klinman-server.database.windows.net",
  database: process.env.DB_DATABASE || "klinman-db",
  options: {
    encrypt: true,
    trustServerCertificate: true,
  },
};

export async function GET(request) {
  try {
    const cookieStore = await cookies();
    const cookieUsuario = cookieStore.get('user_id')?.value; 

    if (!cookieUsuario) {
      return NextResponse.json({ user: null, message: "No hay sesión activa" });
    }

    const pool = await sql.connect(config);
    
    // ⚡ CONSULTA MEJORADA: Busca permisos directos Y permisos heredados por el ROL
    const result = await pool.request()
      .input("usuarioId", sql.Int, parseInt(cookieUsuario))
      .query(`
        SELECT DISTINCT
          u.id, 
          u.nombre, 
          u.email, 
          u.rol_id, 
          p.clave_permiso
        FROM usuarios u
        -- 1. Permisos heredados por el ROL del usuario
        LEFT JOIN rol_permisos rp ON u.rol_id = rp.rol_id
        LEFT JOIN permisos p1 ON rp.permiso_id = p1.id
        -- 2. Permisos asignados directamente al USUARIO
        LEFT JOIN usuario_permisos up ON u.id = up.usuario_id
        LEFT JOIN permisos p2 ON up.permiso_id = p2.id
        -- Consolidamos ambos permisos en una sola columna
        CROSS APPLY (SELECT COALESCE(p1.clave_permiso, p2.clave_permiso) AS clave_permiso) p
        WHERE u.id = @usuarioId AND u.estado = 1
      `);

    if (result.recordset.length === 0) {
      return NextResponse.json({ user: null, error: "Usuario no encontrado" });
    }

    const filas = result.recordset;
    
    // Filtramos y limpiamos el arreglo asegurando que no vayan duplicados
    const listaPermisos = Array.from(
      new Set(
        filas
          .filter(row => row.clave_permiso)
          .map(row => row.clave_permiso.toLowerCase().trim())
      )
    );

    const usuarioLogueadoActivo = {
      id: filas[0].id,
      nombre: filas[0].nombre,
      email: filas[0].email,
      rol_id: filas[0].rol_id,
      permisos: listaPermisos
    };

    return NextResponse.json({ user: usuarioLogueadoActivo });

  } catch (error) {
    console.error("Error en la API de sesión:", error);
    return NextResponse.json({ user: null, error: error.message }, { status: 500 });
  }
}