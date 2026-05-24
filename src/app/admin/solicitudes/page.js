import sql from "mssql";
import AdminTableClient from "../AdminTableClient";

// 🔑 Configuración adaptativa: Si process.env falla en local, usa el respaldo directo
const config = {
  user: process.env.DB_USER || "adminklinman",
  password: process.env.DB_PASSWORD || "K25250438-9",
  server: process.env.DB_SERVER || "klinman-server.database.windows.net",
  database: process.env.DB_DATABASE || "klinman-db",
  options: { 
    encrypt: true, 
    trustServerCertificate: true // Importante en true para evitar rechazos de certificados en desarrollo
  },
};

async function getSolicitudes() {
  try {
    // Nos conectamos usando la configuración blindada
    const pool = await sql.connect(config);
    const result = await pool.request().query("SELECT * FROM solicitudes ORDER BY fecha_creacion DESC");
    return result.recordset;
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

      {/* TU TABLA CLIENTE */}
      <AdminTableClient solicitudesIniciales={solicitudes} />
    </div>
  );
}