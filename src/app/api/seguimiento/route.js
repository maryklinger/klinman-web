import { NextResponse } from 'next/server';
import sql from 'mssql';

const config = {
  user: process.env.DB_USER || 'adminklinman',
  password: process.env.DB_PASSWORD || 'K25250438-9',
  server: process.env.DB_SERVER || 'klinman-server.database.windows.net',
  database: process.env.DB_DATABASE || 'klinman-db',
  options: { encrypt: true, trustServerCertificate: false },
};

export async function GET(req) {
  try {
    // Capturamos el parámetro "ticket" de la URL (?ticket=KLIN-0025)
    const { searchParams } = new URL(req.url);
    const ticket = searchParams.get('ticket');

    if (!ticket) {
      return NextResponse.json({ success: false, error: 'Código de ticket requerido' }, { status: 400 });
    }

    const pool = await sql.connect(config);
    const result = await pool.request()
      .input('ticket', sql.NVarChar, ticket.trim())
      .query(`
        SELECT codigo_ticket, nombre, servicio, estado, prioridad, fecha_creacion 
        FROM solicitudes 
        WHERE codigo_ticket = @ticket
      `);

    if (result.recordset.length === 0) {
      return NextResponse.json({ success: false, error: 'No se encontró ningún ticket con ese código' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: result.recordset[0] });

  } catch (error) {
    console.error("Error en API de seguimiento:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}