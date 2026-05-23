import sql from "mssql";
import { NextResponse } from 'next/server';

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

export async function POST(request) {
  try {
    const body = await request.json();
    // CAMBIO CLAVE: Ahora el frontend nos manda el ID del usuario editado (usuario_id)
    const { usuario_id, permisos_marcados } = body; 

    if (!usuario_id) {
      return NextResponse.json({ success: false, error: "Falta el usuario_id" }, { status: 400 });
    }

    const pool = await sql.connect(config);
    const transaction = new sql.Transaction(pool);
    await transaction.begin();

    try {
      // 1. Limpiamos los permisos anteriores del USUARIO en la nueva tabla intermedia
      await transaction.request()
        .input('usuario_id', sql.Int, usuario_id)
        .query(`DELETE FROM usuario_permisos WHERE usuario_id = @usuario_id`);

      // 2. Insertamos la nueva selección quirúrgica por usuario
      if (permisos_marcados && permisos_marcados.length > 0) {
        const catalogoBD = await transaction.request().query(`SELECT id, clave_permiso FROM permisos`);
        const listaPermisos = catalogoBD.recordset;

        for (const clave of permisos_marcados) {
          const permisoEncontrado = listaPermisos.find(
            p => p.clave_permiso.toLowerCase() === clave.toLowerCase().trim()
          );

          if (permisoEncontrado) {
            // Guardamos la relación usando usuario_id en lugar de rol_id
            await transaction.request()
              .input('usuario_id', sql.Int, usuario_id)
              .input('permiso_id', sql.Int, permisoEncontrado.id)
              .query(`
                INSERT INTO usuario_permisos (usuario_id, permiso_id)
                VALUES (@usuario_id, @permiso_id)
              `);
          }
        }
      }

      await transaction.commit();
      return NextResponse.json({ success: true, message: "Permisos individuales del usuario actualizados" });

    } catch (sqlError) {
      await transaction.rollback();
      throw sqlError;
    }

  } catch (error) {
    console.error("Error al guardar la matriz por usuario:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}