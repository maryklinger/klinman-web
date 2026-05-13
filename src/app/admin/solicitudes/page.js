import sql from "mssql";
import AdminTableClient from "../AdminTableClient";
async function getSolicitudes() {
  const config = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    server: process.env.DB_SERVER,
    database: process.env.DB_DATABASE,
    options: { encrypt: true, trustServerCertificate: false },
  };

  try {
    const pool = await sql.connect(config);
    const result = await pool.request().query("SELECT * FROM solicitudes ORDER BY fecha_creacion DESC");
    return result.recordset;
  } catch (error) {
    console.error("Error en base de datos:", error);
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