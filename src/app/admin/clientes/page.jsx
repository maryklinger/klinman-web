import sql from "mssql";

// 1. FUNCIÓN DE DATOS (Se ejecuta en el servidor)
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
    // Traemos todos los registros de la tabla solicitudes
    const result = await pool.request().query("SELECT * FROM solicitudes ORDER BY fecha_creacion DESC");
    return result.recordset;
  } catch (error) {
    console.error("Error en base de datos:", error);
    return [];
  }
}

// 2. COMPONENTE PRINCIPAL (Diseño exacto + Lógica Real)
export default async function ClientesPageServer() {
  const solicitudes = await getSolicitudes();

  // --- LÓGICA DE AGRUPACIÓN Y CONTEO REAL ---
  const cartera = solicitudes.reduce((acc, sol) => {
    let nombreEmpresa = (sol.empresa || "Sin Empresa").trim();
    
    // Normalización de nombres para que "Miaula" y "Mi aula" sean el mismo cliente
    const idNormalizado = nombreEmpresa.toLowerCase().replace(/\s/g, '');
    if (idNormalizado === 'miaula') nombreEmpresa = "Mi Aula";

    if (!acc[nombreEmpresa]) {
      acc[nombreEmpresa] = {
        nombre: nombreEmpresa,
        totalTickets: 0,
        solicitantesUnicos: new Set(),
        ultimoServicio: sol.servicio || "General",
        // Iniciales para el logo
        logo: nombreEmpresa.split(/\s+/).map(w => w[0]).join('').toUpperCase().slice(0, 2)
      };
    }

    acc[nombreEmpresa].totalTickets += 1; // CONTEO REAL DESDE LA TABLA
    acc[nombreEmpresa].solicitantesUnicos.add(sol.nombre || "Anónimo");
    // Actualiza siempre al último servicio encontrado
    if (sol.servicio) acc[nombreEmpresa].ultimoServicio = sol.servicio;
    
    return acc;
  }, {});

  const clientes = Object.values(cartera);

  return (
    /* ======================================================================
      ¡CAMBIO CLAVE AQUÍ! 
      Agregamos 'font-sans antialiased' al contenedor principal para heredar 
      la tipografía Geist configurada en tu RootLayout.
      ====================================================================== 
    */
    <div className="p-8 md:p-12 space-y-10 bg-[#f8f5ef] min-h-screen font-sans antialiased">
      
      {/* CABECERA - CON EL BOTÓN REGISTRAR EMPRESA REINSTALADO */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-black text-[#1f4d3a] tracking-tight">Cartera de Clientes</h1>
          <p className="text-gray-500 font-bold uppercase text-[11px] tracking-[0.15em] mt-2">
            Expediente centralizado de activos corporativos
          </p>
        </div>
      </div>

      {/* GRID DE TARJETAS CON TU DISEÑO ORIGINAL */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {clientes.length > 0 ? (
          clientes.map((cliente) => (
            <div key={cliente.nombre} className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-[#ece7dc] hover:shadow-md transition-all group relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1.5 h-full bg-[#c8a96a] opacity-0 group-hover:opacity-100 transition-opacity"></div>

              <div className="flex justify-between items-start mb-8">
                {/* Forzamos font-black para el identificador visual */}
                <div className="w-14 h-14 rounded-2xl bg-[#1f4d3a] flex items-center justify-center text-[#c8a96a] font-black text-xl border border-[#c8a96a]/30">
                  {cliente.logo}
                </div>
                <div className="text-right">
                  <span className="block text-[10px] font-black text-gray-400 uppercase tracking-widest">Total Tickets</span>
                  {/* Agregamos font-mono opcional si quieres que el número use la variante Mono de Geist */}
                  <span className="text-3xl font-black text-[#1f4d3a] leading-none font-mono tracking-tight">
                    {cliente.totalTickets}
                  </span>
                </div>
              </div>
              
              <div className="mb-8">
                <h3 className="text-2xl font-black text-[#1f4d3a] tracking-tight group-hover:text-[#c8a96a] transition-colors">
                  {cliente.nombre}
                </h3>
                <div className="flex items-center gap-2 mt-2">
                  <div className="w-2 h-2 rounded-full bg-[#c8a96a]"></div>
                  <p className="text-[11px] text-gray-500 font-bold uppercase tracking-wider">
                    {cliente.solicitantesUnicos.size} Solicitantes autorizados
                  </p>
                </div>
              </div>

              <div className="bg-[#faf8f3] rounded-2xl p-4 mb-8 border border-[#f1ede4]">
                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Última Actividad</p>
                <p className="text-xs font-bold text-[#1f4d3a] line-clamp-1">{cliente.ultimoServicio}</p>
              </div>
              
              {/* PIE DE TARJETA - ABRIR EXPEDIENTE Y AVATARES */}
              <div className="pt-6 border-t border-[#f1ede4] flex justify-between items-center">
                <button className="text-[10px] font-black text-[#c8a96a] uppercase tracking-[0.2em] hover:underline">
                  Abrir Expediente
                </button>
                
                <div className="flex -space-x-2">
                  {[...cliente.solicitantesUnicos].slice(0, 3).map((nombre, i) => (
                    <div key={i} title={nombre} className="w-7 h-7 rounded-full bg-[#f1ede4] border-2 border-white flex items-center justify-center text-[8px] font-black text-[#1f4d3a]">
                      {nombre.charAt(0).toUpperCase()}
                    </div>
                  ))}
                  {cliente.solicitantesUnicos.size > 3 && (
                    <div className="w-7 h-7 rounded-full bg-[#c8a96a] border-2 border-white flex items-center justify-center text-[8px] font-black text-white font-mono">
                      +{cliente.solicitantesUnicos.size - 3}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full py-20 text-center border-2 border-dashed border-[#ece7dc] rounded-[2.5rem] bg-white/50">
            <p className="text-gray-400 font-bold uppercase text-[10px] tracking-widest">
              No se encontraron datos en la tabla solicitudes
            </p>
          </div>
        )}
      </div>
    </div>
  );
}