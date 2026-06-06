import { getDBConnection, sql } from "@/lib/db";

export async function POST(req) {
  try {
    const { ticketId, operadorId } = await req.json();
    const pool = await getDBConnection();
    
    // 1. Actualizamos el operador en el ticket
    // 2. Insertamos en bitácora para que quede registro (Auditoría para Klinman)
    const transaction = new sql.Transaction(pool);
    await transaction.begin();
    
    try {
      await transaction.request()
        .input("ticketId", sql.Int, ticketId)
        .input("operadorId", sql.Int, operadorId)
        .query(`
          UPDATE solicitudes 
          SET operador_id = @operadorId, estado = 'En Revisión' 
          WHERE id = @ticketId
        `);

      await transaction.request()
        .input("ticketId", sql.Int, ticketId)
        .input("msg", sql.NVarChar, `Ticket asignado al operador ID: ${operadorId}`)
        .query("INSERT INTO bitacora_ticket (ticket_id, mensaje_actualizacion) VALUES (@ticketId, @msg)");

      await transaction.commit();
      return new Response(JSON.stringify({ success: true }), { status: 200 });
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}