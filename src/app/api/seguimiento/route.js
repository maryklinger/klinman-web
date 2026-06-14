import { NextResponse } from 'next/server';
import sql from '@/lib/db'; // Tu conector a Neon

export async function GET(req) {
  try {
    // Capturamos el parámetro "ticket" de la URL (?ticket=KLIN-0025)
    const { searchParams } = new URL(req.url);
    const ticket = searchParams.get('ticket');

    if (!ticket) {
      return NextResponse.json({ success: false, error: 'Código de ticket requerido' }, { status: 400 });
    }

    // Consulta a PostgreSQL
    const result = await sql`
      SELECT codigo_ticket, nombre, servicio, estado, prioridad, fecha_creacion 
      FROM solicitudes 
      WHERE codigo_ticket = ${ticket.trim()}
    `;

    // Verificamos si existe el registro
    if (result.length === 0) {
      return NextResponse.json({ success: false, error: 'No se encontró ningún ticket con ese código' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: result[0] });

  } catch (error) {
    console.error("Error en API de seguimiento:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}