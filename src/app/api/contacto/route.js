import { NextResponse } from 'next/server';
import sql from '@/lib/db'; // Tu conector a Neon
import nodemailer from 'nodemailer';

export async function POST(req) {
  try {
    const body = await req.json();

    // 1. Validamos campos obligatorios
    if (!body.nombre || !body.email || !body.servicio) {
      return NextResponse.json({ success: false, error: 'Faltan campos obligatorios (Nombre, Email o Servicio)' }, { status: 400 });
    }

    // 2. Inserción en PostgreSQL
    // Usamos el formato de template literal de la librería 'postgres' (Neon)
    // El 'codigo_ticket' se genera automáticamente en la DB, lo recuperamos con RETURNING
    const result = await sql`
      INSERT INTO solicitudes 
      (nombre, empresa, telefono, email, servicio, mensaje, estado, prioridad, fecha_creacion)
      VALUES 
      (${body.nombre}, ${body.empresa || null}, ${body.telefono || null}, ${body.email}, ${body.servicio}, ${body.mensaje || ''}, 'pendiente', 'normal', CURRENT_TIMESTAMP)
      RETURNING codigo_ticket;
    `;

    const codigoTicket = result[0]?.codigo_ticket || 'KLIN-XXXX';

    // 3. Envío de Notificación por Gmail mediante Canal Seguro SMTP Directo
    try {
      console.log("=== INTENTANDO ENVIAR CORREO MEDIANTE SMTP SEGURO ===");
      
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.NOTIFICATION_EMAIL,
          pass: process.env.NOTIFICATION_PASSWORD
        },
      });

      const mailOptions = {
        from: `"Plataforma Klinman" <${process.env.NOTIFICATION_EMAIL}>`,
        to: body.email,
        bcc: process.env.NOTIFICATION_EMAIL,
        subject: `[${codigoTicket}] Nueva Solicitud: ${body.servicio} - ${body.empresa || body.nombre}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 8px; padding: 25px; background-color: #ffffff;">
            <h2 style="color: #0c3c2c; border-bottom: 2px solid #0c3c2c; padding-bottom: 10px; margin-top: 0;">
              Ticket Generado: ${codigoTicket}
            </h2>
            <p style="font-size: 14px; color: #555;">Se ha registrado exitosamente un nuevo contacto en la base de datos de la plataforma.</p>
            
            <table style="width: 100%; border-collapse: collapse; margin-top: 15px;">
              <tr>
                <td style="padding: 8px 0; font-weight: bold; color: #333; width: 35%;">Código Ticket:</td>
                <td style="padding: 8px 0; color: #0c3c2c; font-weight: bold;">${codigoTicket}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-weight: bold; color: #333;">Nombre Completo:</td>
                <td style="padding: 8px 0; color: #666;">${body.nombre}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-weight: bold; color: #333;">Correo Electrónico:</td>
                <td style="padding: 8px 0; color: #666;"><a href="mailto:${body.email}" style="color: #0c3c2c;">${body.email}</a></td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-weight: bold; color: #333;">Tipo de Servicio:</td>
                <td style="padding: 8px 0; color: #0c3c2c; font-weight: bold;">${body.servicio}</td>
              </tr>
            </table>

            <div style="margin-top: 20px; padding: 15px; background-color: #f9f9f9; border-left: 4px solid #0c3c2c; border-radius: 4px;">
              <strong style="color: #333; display: block; margin-bottom: 5px;">Mensaje Adjunto:</strong>
              <p style="margin: 0; color: #555; font-style: italic; white-space: pre-wrap;">${body.mensaje || 'Sin mensaje adicional.'}</p>
            </div>
            
            <footer style="margin-top: 30px; text-align: center; font-size: 11px; color: #999; border-top: 1px solid #eee; padding-top: 15px;">
              Este es un correo automático generado por el backend de la Plataforma Klinman.
            </footer>
          </div>
        `,
      };

      const info = await transporter.sendMail(mailOptions);
      console.log("=== ¡CORREO ENVIADO CON ÉXITO! ===");
      console.log("ID del mensaje:", info.messageId);
      
    } catch (mailError) {
      console.error("======= DETALLE DEL ERROR REAL EN SMTP =======");
      console.error(mailError.message);
    }

    // 4. Devolvemos respuesta
    return NextResponse.json({ 
      success: true, 
      codigo_ticket: codigoTicket 
    });

  } catch (error) {
    console.error("Error crítico en API contacto:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}