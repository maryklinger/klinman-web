import sql from "@/lib/db"; // Tu conector centralizado a Neon
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Consulta unificada: Permisos de ROL + Permisos de USUARIO (UNION)
    // Nota: u.estado en Postgres es boolean, lo convertimos a 1/0 para tu formato
    const result = await sql`
      SELECT u.id, u.nombre, u.email, u.rol_id, u.estado, p.clave_permiso
      FROM usuarios u
      LEFT JOIN rol_permisos rp ON u.rol_id = rp.rol_id
      LEFT JOIN permisos p ON rp.permiso_id = p.id
      UNION
      SELECT u.id, u.nombre, u.email, u.rol_id, u.estado, p2.clave_permiso
      FROM usuarios u
      LEFT JOIN usuario_permisos up ON u.id = up.usuario_id
      LEFT JOIN permisos p2 ON up.permiso_id = p2.id
    `;

    const usuariosMap = {};
    
    result.forEach(row => {
      if (!usuariosMap[row.id]) {
        usuariosMap[row.id] = {
          id: row.id,
          nombre: row.nombre,
          email: row.email,
          rol_id: row.rol_id,
          estado: row.estado ? 1 : 0, // Mantenemos tu formato de salida
          permisos: new Set()
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
    console.error("Error en API de usuarios:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}