import sql from "mssql";
import { NextResponse } from "next/server";

const config = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER,
  database: process.env.DB_DATABASE,
  options: {
    encrypt: true,
    trustServerCertificate: true,
  },
};

export async function POST(request) {
  try {
    const body = await request.json();
    const { correo, contrasena } = body; 

    if (!correo || !contrasena) {
      return NextResponse.json({ success: false, error: "Faltan credenciales" }, { status: 400 });
    }

    const pool = await sql.connect(config);

    // Cambiamos 'password' por 'password_hash' en el SELECT
    const result = await pool.request()
      .input("email", sql.VarChar, correo.trim().toLowerCase())
      .query(`
        SELECT id, nombre, email, password_hash, rol_id 
        FROM usuarios 
        WHERE email = @email AND estado = 1
      `);

    if (result.recordset.length === 0) {
      return NextResponse.json({ success: false, error: "El usuario no existe o está inactivo." }, { status: 401 });
    }

    const usuarioEncontrado = result.recordset[0];

    // Comparamos usando 'password_hash' que viene de la base de datos
    if (usuarioEncontrado.password_hash !== contrasena) {
      return NextResponse.json({ success: false, error: "Contraseña incorrecta." }, { status: 401 });
    }

    const response = NextResponse.json({ 
      success: true, 
      user: { id: usuarioEncontrado.id, nombre: usuarioEncontrado.nombre, email: usuarioEncontrado.email }
    });

    response.cookies.set("user_id", usuarioEncontrado.id.toString(), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24, 
    });

    return response;

  } catch (error) {
    console.error("Error en Login API:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}