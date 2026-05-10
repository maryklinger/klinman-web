import sql from 'mssql';

const config = {
  user: 'adminklinman',
  password: 'K25250438-9',
  server: 'klinman-server.database.windows.net',
  database: 'klinman-db',
  options: {
    encrypt: true,
  },
};

export async function POST(req) {
  try {
    const body = await req.json();

    const pool = await sql.connect(config);

    const countResult = await pool
  .request()
  .query(`
    SELECT COUNT(*) as total
    FROM solicitudes
  `);

const total = countResult.recordset[0].total + 1;

const ticket = `KLIN-${String(total).padStart(4, "0")}`;

await pool.request()
  .input('ticket', sql.VarChar, ticket)
  .input('nombre', sql.NVarChar, body.nombre)
  .input('empresa', sql.NVarChar, body.empresa)
  .input('telefono', sql.NVarChar, body.telefono)
  .input('email', sql.NVarChar, body.email)
  .input('servicio', sql.NVarChar, body.servicio)
  .input('mensaje', sql.NVarChar, body.mensaje)
  .query(`
    INSERT INTO solicitudes 
    (
      ticket,
      nombre,
      empresa,
      telefono,
      email,
      servicio,
      mensaje
    )
    VALUES
    (
      @ticket,
      @nombre,
      @empresa,
      @telefono,
      @email,
      @servicio,
      @mensaje
    )
  `);

    return Response.json({ success: true });

  } catch (error) {
    console.error(error);
    return Response.json({ success: false, error: error.message });
  }
}