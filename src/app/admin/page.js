export const dynamic = "force-dynamic";

import sql from "mssql";
// Probamos sin la extensión .jsx si falla, o verificamos que sea exacta
import AdminSidebar from "../../components/AdminSidebar"; 
import AdminTableClient from "./AdminTableClient"; 

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
    // Es importante cerrar la conexión, pero en Next.js a veces es mejor 
    // dejar que el pool se maneje solo si hay muchas peticiones.
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
    <main className="min-h-screen flex bg-[#f8f5ef]">
      {/* 1. Sidebar */}
      <AdminSidebar />

      {/* 2. Contenido */}
      <section className="flex-1 p-10">
        <div className="max-w-7xl mx-auto">
          <header className="mb-10">
            <h1 className="text-4xl font-bold text-[#1f4d3a]">Panel Administrativo</h1>
            <p className="text-gray-600 mt-2">Gestión de solicitudes Klinman</p>
          </header>

          {/* Enviamos los datos de SQL al componente de cliente */}
          <AdminTableClient solicitudesIniciales={solicitudes} />
        </div>
      </section>
    </main>
  );
}