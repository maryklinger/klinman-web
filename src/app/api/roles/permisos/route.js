import sql from "mssql";
import { NextResponse } from 'next/server';

const config = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER,
  database: process.env.DB_DATABASE,
  options: { encrypt: true, trustServerCertificate: true }
};

export async function POST(request) {
  try {
    const { usuario_id, permisos_marcados } = await request.json();
    if (!usuario_id) return NextResponse.json({ success: false }, { status: 400 });

    const pool = await sql.connect(config);
    const transaction = new sql.Transaction(pool);
    await transaction.begin();

    try {
      // 1. Borrar permisos individuales antiguos
      await new sql.Request(transaction)
        .input('uid', sql.Int, usuario_id)
        .query("DELETE FROM usuario_permisos WHERE usuario_id = @uid");

      // 2. Insertar nuevos
      if (permisos_marcados && permisos_marcados.length > 0) {
        for (const clave of permisos_marcados) {
          await new sql.Request(transaction)
            .input('uid', sql.Int, usuario_id)
            .input('clave', sql.NVarChar, clave)
            .query(`
              INSERT INTO usuario_permisos (usuario_id, permiso_id) 
              SELECT @uid, id FROM permisos WHERE clave_permiso = @clave
            `);
        }
      }
      await transaction.commit();
      return NextResponse.json({ success: true });
    } catch (e) {
      await transaction.rollback();
      throw e;
    }
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}