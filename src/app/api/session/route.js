import sql from "mssql";
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers'; 

const config = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER,
  database: process.env.DB_DATABASE,
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
    
    const result = await pool.request()
      .input("usuarioId", sql.Int, parseInt(cookieUsuario))
      .query(`
        SELECT 
          u.id, 
          u.nombre, 
          u.email, 
          u.rol_id, 
          p.clave_permiso
        FROM usuarios u
        LEFT JOIN usuario_permisos up ON u.id = up.usuario_id
        LEFT JOIN permisos p ON up.permiso_id = p.id
        WHERE u.id = @usuarioId AND u.estado = 1
      `);

    if (result.recordset.length === 0) {
      return NextResponse.json({ user: null, error: "Usuario no encontrado" });
    }

    const filas = result.recordset;
    
    const usuarioLogueadoActivo = {
      id: filas[0].id,
      nombre: filas[0].nombre,
      email: filas[0].email,
      rol_id: filas[0].rol_id,
      permisos: filas
        .filter(row => row.clave_permiso)
        .map(row => row.clave_permiso.toLowerCase().trim())
    };

    return NextResponse.json({ user: usuarioLogueadoActivo });

  } catch (error) {
    console.error("Error en la API de sesión:", error);
    return NextResponse.json({ user: null, error: error.message }, { status: 500 });
  }
}