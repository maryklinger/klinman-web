import sql from "mssql";
import { NextResponse } from 'next/server';

const config = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER,
  database: process.env.DB_DATABASE,
  options: { encrypt: true, trustServerCertificate: false }
};

export async function GET() {
  try {
    const pool = await sql.connect(config);
    
    // Traemos los usuarios y cruzamos con sus permisos según su ROL
    const result = await pool.request().query(`
      SELECT 
        u.id, 
        u.nombre, 
        u.email, 
        u.rol_id, 
        u.estado,
        p.clave_permiso
      FROM usuarios u
      LEFT JOIN rol_permisos rp ON u.rol_id = rp.rol_id
      LEFT JOIN permisos p ON rp.permiso_id = p.id
    `);
    

    // Agrupamos las filas por usuario para consolidar el array de permisos string
    const usuariosMap = {};
    
    result.recordset.forEach(row => {
      if (!usuariosMap[row.id]) {
        usuariosMap[row.id] = {
          id: row.id,
          nombre: row.nombre,
          email: row.email,
          rol_id: row.rol_id,
          estado: row.estado,
          permisos: []
        };
      }
      if (row.clave_permiso) {
        usuariosMap[row.id].permisos.push(row.clave_permiso.toLowerCase().trim());
      }
    });

    const listaUsuarios = Object.values(usuariosMap);
    return NextResponse.json(listaUsuarios);

  } catch (error) {
    console.error("Error al obtener usuarios relacionales:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}