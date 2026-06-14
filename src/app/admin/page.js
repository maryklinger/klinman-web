// src/app/admin/page.js
export const dynamic = "force-dynamic";

import sql from "@/lib/db"; // Tu conector a Neon
import DashboardAdmin from "./DashboardAdmin";

async function getSolicitudes() {
  try {
    // Consulta directa usando la sintaxis de la librería postgres
    const result = await sql`
      SELECT id, nombre, empresa, servicio, estado, fecha_creacion 
      FROM solicitudes 
      ORDER BY fecha_creacion DESC
    `;
    return result;
  } catch (error) {
    console.error("Error en getSolicitudes (Neon):", error);
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

          {/* DASHBOARD */}
          <DashboardAdmin solicitudesIniciales={solicitudes} />
          
        </div>
      </section>
    </main>
  );
}