export const dynamic = 'force-dynamic';

import { getServerSession } from "next-auth";
import { NextResponse } from 'next/server';
import sql from "mssql";

// IMPORTANTE: Definimos la configuración básica aquí para getServerSession
// Esto evita tener que importar el handler desde otro archivo
const authOptions = {
  providers: [], 
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async session({ session, token }) {
      session.user.id = token.userId;
      return session;
    }
  }
};

const config = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER,
  database: process.env.DB_DATABASE,
  options: { encrypt: true, trustServerCertificate: true },
};

export async function GET(request) {
  try {
    // 1. Obtener la sesión usando la configuración local
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user?.id) {
      return NextResponse.json({ user: null, message: "No hay sesión activa" }, { status: 401 });
    }

    // 2. Consultar base de datos
    const pool = await sql.connect(config);
    const result = await pool.request()
      .input("usuarioId", sql.Int, parseInt(session.user.id))
      .query(`
        SELECT u.id, u.nombre, u.email, u.rol_id, 
               COALESCE(p1.clave_permiso, p2.clave_permiso) AS clave_permiso
        FROM usuarios u
        LEFT JOIN rol_permisos rp ON u.rol_id = rp.rol_id
        LEFT JOIN permisos p1 ON rp.permiso_id = p1.id
        LEFT JOIN usuario_permisos up ON u.id = up.usuario_id
        LEFT JOIN permisos p2 ON up.permiso_id = p2.id
        WHERE u.id = @usuarioId AND u.estado = 1
      `);

    if (result.recordset.length === 0) return NextResponse.json({ user: null }, { status: 404 });

    return NextResponse.json({ 
      user: {
        id: result.recordset[0].id,
        nombre: result.recordset[0].nombre,
        permisos: [...new Set(result.recordset.map(r => r.clave_permiso).filter(Boolean).map(p => p.toLowerCase().trim()))]
      }
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}