import { NextResponse } from 'next/server';
import sql from "@/lib/db"; // Tu conector centralizado a Neon

export async function POST(req) {
  try {
    const { ticketId, operadorId } = await req.json();
    
    // Usamos sql.begin para ejecutar la transacción de forma segura
    await sql.begin(async (sql) => {
      // 1. Actualizamos el operador en el ticket
      await sql`
        UPDATE solicitudes 
        SET operador_id = ${operadorId}, estado = 'En Revisión' 
        WHERE id = ${ticketId}
      `;

      // 2. Insertamos en bitácora para la auditoría
      await sql`
        INSERT INTO bitacora_ticket (ticket_id, mensaje_actualizacion) 
        VALUES (${ticketId}, ${`Ticket asignado al operador ID: ${operadorId}`})
      `;
    });

    return NextResponse.json({ success: true }, { status: 200 });
    
  } catch (error) {
    console.error("Error en asignación de operador:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}