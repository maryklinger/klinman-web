import { NextResponse } from 'next/server';
import sql from '@/lib/db'; // Tu conector a Neon

export async function POST(request) {
  try {
    const { usuario_id, permisos_marcados } = await request.json();
    if (!usuario_id) return NextResponse.json({ success: false }, { status: 400 });

    // En Neon (postgres), utilizamos sql.begin para manejar transacciones
    await sql.begin(async (sql) => {
      // 1. Borrar permisos individuales antiguos
      await sql`DELETE FROM usuario_permisos WHERE usuario_id = ${usuario_id}`;

      // 2. Insertar nuevos
      if (permisos_marcados && permisos_marcados.length > 0) {
        for (const clave of permisos_marcados) {
          await sql`
            INSERT INTO usuario_permisos (usuario_id, permiso_id) 
            SELECT ${usuario_id}, id FROM permisos WHERE clave_permiso = ${clave}
          `;
        }
      }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error en API de permisos:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}