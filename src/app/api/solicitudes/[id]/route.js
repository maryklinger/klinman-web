import sql from "@/lib/db"; // Tu conector a Neon
import { NextResponse } from 'next/server';

export async function PATCH(req, context) {
  try {
    // Obtenemos el ID de los parámetros del contexto
    const id = Number(context.params.id);
    const body = await req.json();
    const { estado } = body;

    // Actualización en PostgreSQL
    await sql`
      UPDATE solicitudes
      SET estado = ${estado}
      WHERE id = ${id}
    `;

    return NextResponse.json({
      success: true,
    });

  } catch (error) {
    console.error("Error al actualizar estado en Neon:", error);
    return NextResponse.json(
      {
        error: "Error al actualizar estado",
      },
      {
        status: 500,
      }
    );
  }
}