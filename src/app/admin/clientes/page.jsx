'use client';

import { useMemo } from 'react';

export default function ClientesPage({ solicitudes = [] }) {
  
  // --- LÓGICA DE TRANSFORMACIÓN CON DATOS DE RESPALDO ---
  const clientes = useMemo(() => {
    // 1. SI LA BASE DE DATOS ESTÁ VACÍA, USAMOS ESTOS DATOS DE PRUEBA PARA VER EL DISEÑO
    let datosParaProcesar = solicitudes;

    if (!solicitudes || solicitudes.length === 0) {
      console.warn("⚠️ Advertencia: No llegan datos. Usando datos de respaldo.");
      datosParaProcesar = [
        { id: 1, empresa: "Met Gala", nombre: "Vanessa", servicio: "Limpieza" },
        { id: 2, empresa: "Met Gala", nombre: "Robert", servicio: "Aseo" },
        { id: 3, empresa: "Senderos", nombre: "Claudia", servicio: "Mantenimiento" },
        { id: 4, empresa: "Senderos", nombre: "Vanessa", servicio: "Jardinería" },
      ];
    }

    // 2. PROCESAMIENTO
    const cartera = datosParaProcesar.reduce((acc, sol) => {
      const nombreEmpresa = (sol.empresa || sol.cliente || "Sin Empresa").trim();
      
      if (!acc[nombreEmpresa]) {
        acc[nombreEmpresa] = {
          nombre: nombreEmpresa,
          totalTickets: 0,
          solicitantesUnicos: new Set(),
          ultimoServicio: sol.servicio || "General",
          logo: nombreEmpresa.substring(0, 2).toUpperCase()
        };
      }
      
      acc[nombreEmpresa].totalTickets += 1;
      const nombrePersona = sol.nombre || sol.solicitante || "Anónimo";
      acc[nombreEmpresa].solicitantesUnicos.add(nombrePersona);
      
      return acc;
    }, {});

    return Object.values(cartera);
  }, [solicitudes]);

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
        <button className="bg-[#1f4d3a] text-white px-6 py-3 rounded-2xl text-[11px] font-black uppercase tracking-widest border border-[#c8a96a] shadow-sm">
          Registrar Empresa
        </button>
      </div>

      {/* GRID DE CLIENTES */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {clientes.length > 0 ? (
          clientes.map((cliente) => (
            <div key={cliente.nombre} className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-[#ece7dc] hover:shadow-md transition-all group relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1.5 h-full bg-[#c8a96a] opacity-0 group-hover:opacity-100 transition-opacity"></div>

              <div className="flex justify-between items-start mb-8">
                <div className="w-14 h-14 rounded-2xl bg-[#1f4d3a] flex items-center justify-center text-[#c8a96a] font-black text-xl border border-[#c8a96a]/30">
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
                    {cliente.solicitantesUnicos.size} Solicitantes autorizados
                  </p>
                </div>
              </div>

              <div className="bg-[#faf8f3] rounded-2xl p-4 mb-8 border border-[#f1ede4]">
                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Última Actividad</p>
                <p className="text-xs font-bold text-[#1f4d3a]">{cliente.ultimoServicio}</p>
              </div>
              
              <div className="pt-6 border-t border-[#f1ede4] flex justify-between items-center">
                <button className="text-[10px] font-black text-[#c8a96a] uppercase tracking-[0.2em]">
                  Abrir Expediente
                </button>
                
                <div className="flex -space-x-2">
                  {[...cliente.solicitantesUnicos].slice(0, 3).map((nombre, i) => (
                    <div key={i} title={nombre} className="w-7 h-7 rounded-full bg-[#f1ede4] border-2 border-white flex items-center justify-center text-[8px] font-black text-[#1f4d3a]">
                      {nombre.charAt(0).toUpperCase()}
                    </div>
                  ))}
                  {cliente.solicitantesUnicos.size > 3 && (
                    <div className="w-7 h-7 rounded-full bg-[#c8a96a] border-2 border-white flex items-center justify-center text-[8px] font-black text-white">
                      +{cliente.solicitantesUnicos.size - 3}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
           <p className="text-center col-span-full text-gray-400 italic">No hay datos disponibles.</p>
        )}
      </div>
    </div>
  );
}