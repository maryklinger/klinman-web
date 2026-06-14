export const dynamic = 'force-dynamic';

import { getServerSession } from "next-auth";
import { NextResponse } from 'next/server';
import sql from "@/lib/db"; // <--- ESTO ES LO QUE DEBE ESTAR

// Configuración de sesión mantenida localmente para esta ruta
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

export async function GET(request) {
  try {
    // 1. Obtener la sesión
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user?.id) {
      return NextResponse.json({ user: null, message: "No hay sesión activa" }, { status: 401 });
    }

    // 2. Consultar base de datos
    const result = await sql`
      SELECT u.id, u.nombre, u.email, u.rol_id, 
             COALESCE(p1.clave_permiso, p2.clave_permiso) AS clave_permiso
      FROM usuarios u
      LEFT JOIN rol_permisos rp ON u.rol_id = rp.rol_id
      LEFT JOIN permisos p1 ON rp.permiso_id = p1.id
      LEFT JOIN usuario_permisos up ON u.id = up.usuario_id
      LEFT JOIN permisos p2 ON up.permiso_id = p2.id
      WHERE u.id = ${parseInt(session.user.id)} AND u.estado = TRUE
    `;

    if (result.length === 0) {
      return NextResponse.json({ user: null }, { status: 404 });
    }

    return NextResponse.json({ 
      user: {
        id: result[0].id,
        nombre: result[0].nombre,
        permisos: [...new Set(result.map(r => r.clave_permiso).filter(Boolean).map(p => p.toLowerCase().trim()))]
      }
    });
  } catch (error) {
    console.error("Error en API perfil:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}