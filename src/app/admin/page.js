// src/app/admin/page.js
export const dynamic = "force-dynamic";

import sql from "mssql";
import DashboardAdmin from "./DashboardAdmin"; // Tu componente limpio

async function getSolicitudes() {
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

  try {
    const pool = await sql.connect(config);
    const result = await pool.request().query(`
        SELECT id, ticket, nombre, empresa, servicio, estado, fecha_creacion 
        FROM solicitudes 
        ORDER BY fecha_creacion DESC
    `);
    await pool.close(); 
    return result.recordset;
  } catch (error) {
    console.error("Error en getSolicitudes:", error);
    return [];
  }
}

export default async function AdminPage() {
  const solicitudes = await getSolicitudes();

  return (
    <main className="min-h-screen bg-[#f8f5ef]">
      <section className="p-10">
        <div className="max-w-7xl mx-auto space-y-10">
          
          {/* Cabecera Principal */}
          <header className="mb-6">
            <h1 className="text-4xl font-black text-[#1f4d3a] tracking-tight">Panel Administrativo</h1>
            <p className="text-gray-600 mt-2">Gestión de solicitudes Klinman</p>
          </header>

          {/* ÚNICO COMPONENTE: Aquí vive el Dashboard completo con sus tarjetas, alertas y distribución */}
          <DashboardAdmin solicitudesIniciales={solicitudes} />
          
        </div>
      </section>
    </main>
  );
}