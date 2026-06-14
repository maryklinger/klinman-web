import sql from "@/lib/db"; // Tu conector a Neon
import AdminTableClient from "../AdminTableClient";

async function getSolicitudes() {
  try {
    // Consulta directa a la base de datos usando el conector de Postgres
    const result = await sql`SELECT * FROM solicitudes ORDER BY fecha_creacion DESC`;
    return result;
  } catch (error) {
    console.error("Error en base de datos al traer solicitudes:", error);
    return [];
  }
}

export default async function SolicitudesPage() {
  const solicitudes = await getSolicitudes();

  return (
    <div className="p-8 md:p-12 space-y-10">
      {/* HEADER DE SECCIÓN */}
      <div>
        <h1 className="text-4xl font-bold text-[#1f4d3a] tracking-tight">Solicitudes</h1>
        <p className="text-gray-500 font-medium mt-1">Gestión y monitoreo de tickets activos</p>
      </div>

      {/* TABLA CLIENTE */}
      {/* Mantenemos tu componente cliente tal cual */}
      <AdminTableClient solicitudesIniciales={solicitudes} />
    </div>
  );
}