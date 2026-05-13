import sql from "mssql";
import { useMemo } from 'react';

// 1. FUNCIÓN DE DATOS (Servidor)
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
    // Traemos TODO para que el conteo de la cartera sea real (los 13+ registros)
    const result = await pool.request().query("SELECT * FROM solicitudes ORDER BY fecha_creacion DESC");
    return result.recordset;
  } catch (error) {
    console.error("Error en base de datos:", error);
    return [];
  }
}

// 2. COMPONENTE PRINCIPAL
export default async function ClientesPageServer() {
  const solicitudes = await getSolicitudes();

  // --- LÓGICA DE AGRUPACIÓN Y CONTEO ---
  // Procesamos las solicitudes para agruparlas por empresa y contar tickets
  const cartera = solicitudes.reduce((acc, sol) => {
    let nombreEmpresa = (sol.empresa || "Sin Empresa").trim();
    
    // Unificamos "Mi aula" y "Miaula"
    const idNormalizado = nombreEmpresa.toLowerCase().replace(/\s/g, '');
    if (idNormalizado === 'miaula') nombreEmpresa = "Mi Aula";

    if (!acc[nombreEmpresa]) {
      acc[nombreEmpresa] = {
        nombre: nombreEmpresa,
        totalTickets: 0,
        solicitantesUnicos: new Set(),
        ultimoServicio: sol.servicio || "General",
        logo: nombreEmpresa.split(/\s+/).map(w => w[0]).join('').toUpperCase().slice(0, 2)
      };
    }

    acc[nombreEmpresa].totalTickets += 1; // Aquí se hace el conteo real
    acc[nombreEmpresa].solicitantesUnicos.add(sol.nombre || "Anónimo");
    
    return acc;
  }, {});

  const clientes = Object.values(cartera);

  return (
    <div className="p-8 md:p-12 space-y-10 bg-[#f8f5ef] min-h-screen">
      {/* CABECERA */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-black text-[#1f4d3a] tracking-tight">Cartera de Clientes</h1>
          <p className="text-gray-500 font-bold uppercase text-[11px] tracking-[0.15em] mt-2">
            Expediente centralizado de activos corporativos
          </p>
        </div>
      </div>

      {/* GRID DE TARJETAS (CARTERA) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {clientes.length > 0 ? (
          clientes.map((cliente) => (
            <div key={cliente.nombre} className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-[#ece7dc] relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-1.5 h-full bg-[#c8a96a] opacity-0 group-hover:opacity-100 transition-opacity"></div>
              
              <div className="flex justify-between items-start mb-8">
                <div className="w-14 h-14 rounded-2xl bg-[#1f4d3a] flex items-center justify-center text-[#c8a96a] font-black text-xl">
                  {cliente.logo}
                </div>
                <div className="text-right">
                  <span className="block text-[10px] font-black text-gray-400 uppercase tracking-widest">Total Tickets</span>
                  <span className="text-3xl font-black text-[#1f4d3a] leading-none">
                    {cliente.totalTickets}
                  </span>
                </div>
              </div>
              
              <div className="mb-8">
                <h3 className="text-2xl font-black text-[#1f4d3a] tracking-tight">{cliente.nombre}</h3>
                <p className="text-[11px] text-gray-500 font-bold uppercase mt-1">
                  {cliente.solicitantesUnicos.size} Solicitantes autorizados
                </p>
              </div>

              <div className="bg-[#faf8f3] rounded-2xl p-4 border border-[#f1ede4]">
                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Última Actividad</p>
                <p className="text-xs font-bold text-[#1f4d3a] line-clamp-1">{cliente.ultimoServicio}</p>
              </div>

              <div className="pt-6 mt-6 border-t border-[#f1ede4] flex justify-between items-center">
                <span className="text-[10px] font-black text-[#c8a96a] uppercase tracking-widest">Expediente Activo</span>
                <div className="flex -space-x-2">
                  {[...cliente.solicitantesUnicos].slice(0, 3).map((n, i) => (
                    <div key={i} className="w-7 h-7 rounded-full bg-[#f1ede4] border-2 border-white flex items-center justify-center text-[8px] font-black text-[#1f4d3a]">
                      {n.charAt(0).toUpperCase()}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full py-20 text-center border-2 border-dashed border-[#ece7dc] rounded-[2.5rem]">
            <p className="text-gray-400 font-bold uppercase text-[10px] tracking-widest">
              No se encontraron datos en la tabla solicitudes
            </p>
          </div>
        )}
      </div>
    </div>
  );
}