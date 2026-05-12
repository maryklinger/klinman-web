import sql from "mssql";

const config = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER,
  database: process.env.DB_DATABASE,

  options: {
    encrypt: true,
    trustServerCertificate: false,
  },
};

export async function GET() {

  try {

    const pool = await sql.connect(config);

    const result = await pool
      .request()
      .query(`
        SELECT
          id,
          ticket,
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
      `);

    return Response.json(result.recordset);

  } catch (error) {

    console.error(error);

    return Response.json(
      {
        error: "Error al obtener solicitudes",
      },
      {
        status: 500,
      }
    );
  }
}