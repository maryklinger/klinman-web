'use client';
import { 
  ClockIcon, 
  CheckBadgeIcon, 
  ExclamationTriangleIcon, 
  StarIcon 
} from "@heroicons/react/24/outline";

export default function DashboardAdmin({ solicitudesIniciales: solicitudes = [] }) {
  
  // CALCULADO EN TIEMPO REAL: Con un mapeo ultra-flexible a prueba de errores de BD
  const conteo = solicitudes.reduce((acc, s) => {
    const estado = s.estado ? String(s.estado).toLowerCase().trim() : "";
    
    if (estado.includes("pendiente")) {
      acc["pendiente"]++;
    } else if (estado.includes("revis") || estado.includes("revisión")) { 
      acc["en revisión"]++;
    } else if (estado.includes("finalizado")) {
      acc["finalizado"]++;
    }
    return acc;
  }, { "pendiente": 0, "en revisión": 0, "finalizado": 0 });

  // Configuración de las tarjetas KPI usando los contadores calculados arriba
  const stats = [
    { label: 'SOLICITUDES PENDIENTES', value: conteo["pendiente"], color: 'text-[#c8a96a]', icon: <ExclamationTriangleIcon className="w-4 h-4" /> },
    { label: 'EN REVISIÓN', value: conteo["en revisión"], color: 'text-[#1f4d3a]', icon: <ClockIcon className="w-4 h-4" /> },
    { label: 'FINALIZADAS', value: conteo["finalizado"], color: 'text-gray-400', icon: <CheckBadgeIcon className="w-4 h-4" /> },
    { label: 'SATISFACCIÓN', value: '4.8', color: 'text-[#c8a96a]', icon: <StarIcon className="w-4 h-4" /> },
  ];

  // Filtro adaptado con la misma flexibilidad para evitar que se quede vacío
  const alertasPendientes = solicitudes.filter(s => {
    const estado = s.estado ? String(s.estado).toLowerCase().trim() : "";
    return estado.includes("pendiente");
  }).slice(0, 3);

  return (
    <div className="w-full space-y-10 font-sans antialiased">
      
      {/* ELIMINADO: Se quitó el <header> duplicado y el div con fondo 'min-h-screen' 
        para que se acople perfectamente al contenedor del admin/page.js
      */}

      {/* TARJETAS DE ESTADO (KPIs) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white p-6 rounded-[1.5rem] border border-[#ece7dc] shadow-sm flex flex-col justify-between min-h-[140px]">
            <div className="flex justify-between items-center mb-4">
              <span className="text-[10px] font-medium text-gray-400 uppercase tracking-[0.15em]">{stat.label}</span>
              <div className={`${stat.color} opacity-80`}>{stat.icon}</div>
            </div>
            <span className={`text-6xl font-black font-mono ${stat.color} tracking-tight`}>
              {stat.value}
            </span>
          </div>
        ))}
      </div>

      {/* SECCIÓN DE ACTIVIDAD RECIENTE Y ALERTAS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* COLUMNA: ÚLTIMOS TICKETS CRÍTICOS */}
        <div className="lg:col-span-2 bg-white rounded-[2rem] border border-[#ece7dc] p-8">
          <h3 className="text-[#1f4d3a] font-black text-xl mb-6 flex items-center gap-3">
            <div className="w-1.5 h-6 bg-[#c8a96a] rounded-full"></div>
            Alertas de Operación Inmediata
          </h3>
          
          <div className="space-y-4">
            {alertasPendientes.length > 0 ? (
              alertasPendientes.map((sol) => (
                <div key={sol.id} className="flex items-center justify-between p-5 bg-[#faf8f3] rounded-[1.5rem] border border-[#ece7dc] group hover:border-[#c8a96a] transition-colors">
                  <div>
                    <p className="font-black text-[#1f4d3a] text-lg hover:text-[#c8a96a]">
                      <span className="font-mono text-[#c8a96a]">{sol.ticket || `TK-${sol.id}`}</span> - {sol.nombre}
                    </p>
                    <p className="text-[10px] text-gray-400 font-medium uppercase tracking-[0.15em] mt-1">
                      {sol.servicio || 'Servicio General'} • <span className="text-red-700 font-bold">Pendiente</span>
                    </p>
                  </div>
                  <button className="bg-[#1f4d3a] text-white px-4 py-2 rounded-xl font-bold text-[10px] tracking-widest uppercase border border-[#c8a96a] hover:bg-[#16382b] transition-all">
                    ASIGNAR
                  </button>
                </div>
              ))
            ) : (
              <div className="p-8 text-center bg-[#faf8f3] rounded-[1.5rem] border border-dashed border-[#ece7dc]">
                <p className="text-sm text-gray-400 italic">No hay alertas críticas pendientes en la base de datos.</p>
              </div>
            )}
          </div>
        </div>

        {/* COLUMNA: RESUMEN DE SERVICIOS */}
        <div className="bg-[#1f4d3a] rounded-[2rem] p-8 text-white shadow-xl flex flex-col justify-between">
          <div>
            <h3 className="text-[#c8a96a] font-black text-xl mb-8 uppercase tracking-wider text-center lg:text-left">
              Distribución
            </h3>
            <div className="space-y-8">
              <div>
                <div className="flex justify-between text-[11px] font-medium uppercase tracking-[0.15em] mb-3">
                  <span>Limpieza Corporativa</span>
                  <span className="font-black text-[#c8a96a] text-xs font-mono">70%</span>
                </div>
                <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-[#c8a96a] h-full w-[70%] rounded-full shadow-[0_0_10px_rgba(200,169,106,0.3)]"></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[11px] font-medium uppercase tracking-[0.15em] mb-3">
                  <span>Mantenimiento Industrial</span>
                  <span className="font-black text-white/80 text-xs font-mono">30%</span>
                </div>
                <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-white h-full w-[30%] rounded-full opacity-60"></div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-8 p-4 border border-white/10 rounded-2xl bg-white/5">
            <p className="text-white/40 text-[9px] leading-relaxed uppercase tracking-[0.15em] font-medium">
              Análisis técnico basado en los últimos <span className="font-mono">30</span> días de operación.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}