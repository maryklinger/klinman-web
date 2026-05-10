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

export async function PATCH(req, context) {

  try {

    const { id } = context.params;

    const body = await req.json();

    const { estado } = body;

    console.log(id, estado);

    const pool = await sql.connect(config);

    await pool
      .request()
      .input("id", sql.Int, id)
      .input("estado", sql.VarChar, estado)
      .query(`
        UPDATE solicitudes
        SET estado = @estado
        WHERE id = @id
      `);

    return Response.json({
      success: true,
    });

  } catch (error) {

    console.error(error);

    return Response.json({
      success: false,
      error: error.message,
    });

  }
}

