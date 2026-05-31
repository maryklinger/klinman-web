import sql from "mssql";
import { NextResponse } from 'next/server';

const config = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER,
  database: process.env.DB_DATABASE,
  options: { encrypt: true, trustServerCertificate: true }
};

export async function GET() {
  try {
    const pool = await sql.connect(config);
    
    // Consulta unificada: Permisos de ROL + Permisos de USUARIO (UNION)
    const result = await pool.request().query(`
      SELECT u.id, u.nombre, u.email, u.rol_id, u.estado, p.clave_permiso
      FROM usuarios u
      LEFT JOIN rol_permisos rp ON u.rol_id = rp.rol_id
      LEFT JOIN permisos p ON rp.permiso_id = p.id
      UNION
      SELECT u.id, u.nombre, u.email, u.rol_id, u.estado, p2.clave_permiso
      FROM usuarios u
      LEFT JOIN usuario_permisos up ON u.id = up.usuario_id
      LEFT JOIN permisos p2 ON up.permiso_id = p2.id
    `);

    const usuariosMap = {};
    result.recordset.forEach(row => {
      if (!usuariosMap[row.id]) {
        usuariosMap[row.id] = {
          id: row.id,
          nombre: row.nombre,
          email: row.email,
          rol_id: row.rol_id,
          estado: row.estado ? 1 : 0,
          permisos: new Set() // Usamos Set para evitar duplicados
        };
      }
      if (row.clave_permiso) {
        usuariosMap[row.id].permisos.add(row.clave_permiso.toLowerCase().trim());
      }
    });

    const listaUsuarios = Object.values(usuariosMap).map(u => ({
      ...u,
      permisos: Array.from(u.permisos)
    }));

    return NextResponse.json(listaUsuarios);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}