import sql from "mssql";
import { NextResponse } from 'next/server';

// USAMOS TU CONFIGURACIÓN DE SOLICITUDES QUE YA FUNCIONA
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
    const result = await pool.request().query(`
      SELECT id, nombre, email, rol_id, estado, fecha_registro 
      FROM usuarios 
      ORDER BY fecha_registro DESC
    `);

    return NextResponse.json(result.recordset);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}




export async function POST(request) {
  try {
    const body = await request.json();
    const { nombre, email, rol_id, password_hash } = body;

    // CONEXIÓN DIRECTA (SIN IMPORTAR @/lib/db)
    const pool = await sql.connect(config);

    // INSERT RESPETANDO TU TABLA USUARIOS
    await pool.request()
      .input('nombre', sql.NVarChar, nombre)
      .input('email', sql.NVarChar, email)
      .input('password', sql.NVarChar, password_hash)
      .input('rol', sql.Int, rol_id)
      .query(`
        INSERT INTO usuarios (nombre, email, password_hash, rol_id, estado, fecha_registro)
        VALUES (@nombre, @email, @password, @rol, 1, GETDATE())
      `);

    return NextResponse.json({ success: true });




  } catch (error) {
    console.error("ERROR SQL:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}