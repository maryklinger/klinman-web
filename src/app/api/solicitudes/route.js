import sql from "@/lib/db"; // Tu conector centralizado a Neon
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Consulta directa a PostgreSQL
    const result = await sql`
      SELECT
        id,
        codigo_ticket AS ticket,
        nombre,
        empresa,
        telefono,
        email,
        servicio,
        mensaje,
        estado,
        fecha_creacion
      FROM solicitudes
      ORDER BY fecha_creacion DESC
    `;

    // Devolvemos el array de registros directamente
    return NextResponse.json(result);

  } catch (error) {
    console.error("Error al obtener solicitudes en Neon:", error);
    
    return NextResponse.json(
      {
        error: "Error al obtener solicitudes",
      },
      {
        status: 500,
      }
    );
  }
}