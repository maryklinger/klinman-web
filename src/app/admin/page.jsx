'use client';
import { 
  ClockIcon, 
  CheckBadgeIcon, 
  ExclamationTriangleIcon, 
  StarIcon 
} from "@heroicons/react/24/outline";

export default function DashboardAdmin() {
  const stats = [
    { label: 'SOLICITUDES PENDIENTES', value: '5', color: 'text-[#c8a96a]', icon: <ExclamationTriangleIcon className="w-4 h-4" /> },
    { label: 'EN PROCESO', value: '5', color: 'text-[#1f4d3a]', icon: <ClockIcon className="w-4 h-4" /> },
    { label: 'FINALIZADAS', value: '1', color: 'text-gray-400', icon: <CheckBadgeIcon className="w-4 h-4" /> },
    { label: 'SATISFACCIÓN', value: '4.8', color: 'text-[#c8a96a]', icon: <StarIcon className="w-4 h-4" /> },
  ];

  return (
    <div className="p-8 bg-[#f8f5ef] min-h-screen">
      {/* CABECERA */}
      <header className="mb-10">
        <h1 className="text-4xl font-black text-[#1f4d3a] tracking-tight">Panel Administrativo</h1>
        <p className="text-gray-500 font-bold uppercase text-[11px] tracking-[0.15em] mt-2">
          Gestión de solicitudes Klinman • {new Date().toLocaleDateString("es-CL")}
        </p>
      </header>

      {/* TARJETAS DE ESTADO (KPIs) - Estilo de letras corregido */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white p-6 rounded-[1.5rem] border border-[#ece7dc] shadow-sm flex flex-col justify-between">
            <div className="flex justify-between items-center mb-4">
              {/* Estilo de label corregido */}
              <span className="text-[10px] font-medium text-gray-400 uppercase tracking-[0.15em]">{stat.label}</span>
              <div className={`${stat.color} opacity-80`}>{stat.icon}</div>
            </div>
            {/* Estilo de valor corregido */}
            <span className={`text-6xl font-black ${stat.color} tracking-tight`}>{stat.value}</span>
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
            <div className="flex items-center justify-between p-5 bg-[#faf8f3] rounded-[1.5rem] border border-[#ece7dc] group hover:border-[#c8a96a] transition-colors">
              <div>
                <p className="font-black text-[#1f4d3a] text-lg hover:text-[#c8a96a]">KLIN-0011 - Met Gala</p>
                <p className="text-[10px] text-gray-400 font-medium uppercase tracking-[0.15em] mt-1">
                  Limpieza Corporativa • <span className="text-red-700 font-bold">Pendiente hace 2h</span>
                </p>
              </div>
              <button className="bg-[#1f4d3a] text-white px-4 py-2 rounded-xl font-bold text-[10px] tracking-widest uppercase border border-[#c8a96a] hover:bg-[#16382b] transition-all">
                ASIGNAR
              </button>
            </div>
          </div>
        </div>

        {/* COLUMNA: RESUMEN DE SERVICIOS */}
        <div className="bg-[#1f4d3a] rounded-[2rem] p-8 text-white shadow-xl">
          <h3 className="text-[#c8a96a] font-black text-xl mb-8 uppercase tracking-wider text-center lg:text-left">
            Distribución
          </h3>
          <div className="space-y-8">
            <div>
              <div className="flex justify-between text-[11px] font-medium uppercase tracking-[0.15em] mb-3">
                <span>Limpieza Corporativa</span>
                <span className="font-black text-[#c8a96a] text-xs">70%</span>
              </div>
              <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                <div className="bg-[#c8a96a] h-full w-[70%] rounded-full shadow-[0_0_10px_rgba(200,169,106,0.3)]"></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-[11px] font-medium uppercase tracking-[0.15em] mb-3">
                <span>Mantenimiento Industrial</span>
                <span className="font-black text-white/80 text-xs">30%</span>
              </div>
              <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                <div className="bg-white h-full w-[30%] rounded-full opacity-60"></div>
              </div>
            </div>
          </div>
          
          <div className="mt-16 p-4 border border-white/10 rounded-2xl bg-white/5">
            <p className="text-white/40 text-[9px] leading-relaxed uppercase tracking-[0.15em] font-medium">
              Análisis técnico basado en los últimos 30 días de operación.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}