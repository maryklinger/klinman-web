'use client';

export default function ClientesPage() {
  // Estructura de datos orientada a "Cuenta Corporativa"
  const clientes = [
    { 
      id: 1, 
      nombre: "Met Gala", 
      totalTickets: 10, 
      contactosActivos: 4, // Personas de la empresa que han pedido servicios
      logo: "MG",
      ultimoServicio: "Limpieza Corporativa"
    },
    { 
      id: 2, 
      nombre: "Friends Cafe", 
      totalTickets: 5, 
      contactosActivos: 2, 
      logo: "FC",
      ultimoServicio: "Mantenimiento Preventivo"
    },
    { 
      id: 3, 
      nombre: "Klinman Corp", 
      totalTickets: 42, 
      contactosActivos: 12, 
      logo: "KC",
      ultimoServicio: "Aseo Industrial"
    },
  ];

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
        <button className="bg-[#1f4d3a] text-white px-6 py-3 rounded-2xl text-[11px] font-black uppercase tracking-widest border border-[#c8a96a] hover:bg-[#16382b] transition-all shadow-sm">
          Registrar Empresa
        </button>
      </div>

      {/* GRID DE CLIENTES */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {clientes.map((cliente) => (
          <div key={cliente.id} className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-[#ece7dc] hover:shadow-md transition-all group relative overflow-hidden">
            
            {/* DECORACIÓN SUTIL LATERAL */}
            <div className="absolute top-0 left-0 w-1.5 h-full bg-[#c8a96a] opacity-0 group-hover:opacity-100 transition-opacity"></div>

            <div className="flex justify-between items-start mb-8">
              <div className="w-14 h-14 rounded-2xl bg-[#1f4d3a] flex items-center justify-center text-[#c8a96a] font-black text-xl border border-[#c8a96a]/30 shadow-inner">
                {cliente.logo}
              </div>
              <div className="text-right">
                <span className="block text-[10px] font-black text-gray-400 uppercase tracking-widest">Total Tickets</span>
                <span className="text-3xl font-black text-[#1f4d3a] leading-none">{cliente.totalTickets}</span>
              </div>
            </div>
            
            <div className="mb-8">
              <h3 className="text-2xl font-black text-[#1f4d3a] tracking-tight group-hover:text-[#c8a96a] transition-colors">
                {cliente.nombre}
              </h3>
              <div className="flex items-center gap-2 mt-2">
                <div className="w-2 h-2 rounded-full bg-[#c8a96a]"></div>
                <p className="text-[11px] text-gray-500 font-bold uppercase tracking-wider">
                  {cliente.contactosActivos} Solicitantes autorizados
                </p>
              </div>
            </div>

            {/* INFO EXTRA TÉCNICA */}
            <div className="bg-[#faf8f3] rounded-2xl p-4 mb-8 border border-[#f1ede4]">
              <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Última Actividad</p>
              <p className="text-xs font-bold text-[#1f4d3a]">{cliente.ultimoServicio}</p>
            </div>
            
            <div className="pt-6 border-t border-[#f1ede4] flex justify-between items-center">
              <button className="text-[10px] font-black text-[#c8a96a] uppercase tracking-[0.2em] hover:text-[#1f4d3a] transition-colors">
                Abrir Expediente
              </button>
              
              <div className="flex -space-x-2">
                {/* REPRESENTACIÓN DE LAS DIFERENTES PERSONAS DE LA EMPRESA */}
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="w-7 h-7 rounded-full bg-[#f1ede4] border-2 border-white flex items-center justify-center text-[8px] font-black text-[#1f4d3a]">
                    U{i+1}
                  </div>
                ))}
                {cliente.contactosActivos > 3 && (
                  <div className="w-7 h-7 rounded-full bg-[#c8a96a] border-2 border-white flex items-center justify-center text-[8px] font-black text-white">
                    +{cliente.contactosActivos - 3}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}