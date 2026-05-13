'use client';
import { 
  ClockIcon, 
  CheckBadgeIcon, 
  ExclamationTriangleIcon, 
  StarIcon 
} from "@heroicons/react/24/outline";

export default function DashboardAdmin() {
  const stats = [
    { label: 'Solicitudes Pendientes', value: '5', color: 'text-[#c8a96a]', icon: <ExclamationTriangleIcon className="w-6 h-6" /> },
    { label: 'En Proceso', value: '5', color: 'text-[#1f4d3a]', icon: <ClockIcon className="w-6 h-6" /> },
    { label: 'Finalizadas', value: '1', color: 'text-gray-400', icon: <CheckBadgeIcon className="w-6 h-6" /> },
    { label: 'Satisfacción', value: '4.8', color: 'text-[#c8a96a]', icon: <StarIcon className="w-6 h-6" /> },
  ];

  return (
    <div className="p-8 bg-[#f8f5ef] min-h-screen">
      {/* CABECERA */}
      <header className="mb-10">
        <h1 className="text-4xl font-bold text-[#1f4d3a]">Panel Administrativo</h1>
        <p className="text-gray-500 font-medium">Gestión de solicitudes Klinman • {new Date().toLocaleDateString()}</p>
      </header>

      {/* TARJETAS DE ESTADO (KPIs) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white p-8 rounded-[2rem] border border-[#ece7dc] shadow-sm hover:shadow-md transition-all">
            <div className="flex justify-between items-start mb-4">
              <span className="text-sm font-bold text-gray-400 uppercase tracking-widest">{stat.label}</span>
              <div className={`${stat.color} opacity-80`}>{stat.icon}</div>
            </div>
            <span className={`text-5xl font-bold ${stat.color}`}>{stat.value}</span>
          </div>
        ))}
      </div>

      {/* SECCIÓN DE ACTIVIDAD RECIENTE Y ALERTAS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* COLUMNA: ÚLTIMOS TICKETS CRÍTICOS */}
        <div className="lg:col-span-2 bg-white rounded-[2rem] border border-[#ece7dc] p-8">
          <h3 className="text-[#1f4d3a] font-bold text-xl mb-6 flex items-center gap-2">
            <div className="w-2 h-6 bg-[#c8a96a] rounded-full"></div>
            Alertas de Operación Inmediata
          </h3>
          <div className="space-y-4">
            {/* Ejemplo de un item de alerta */}
            <div className="flex items-center justify-between p-4 bg-[#faf8f3] rounded-2xl border border-[#ece7dc]">
              <div>
                <p className="font-bold text-[#1f4d3a]">KLIN-0011 - Met Gala</p>
                <p className="text-xs text-gray-400 font-medium uppercase">Limpieza Corporativa • Pendiente hace 2h</p>
              </div>
              <button className="text-[#c8a96a] font-bold text-sm hover:underline">ASIGNAR AHORA</button>
            </div>
          </div>
        </div>

        {/* COLUMNA: RESUMEN DE SERVICIOS */}
        <div className="bg-[#1f4d3a] rounded-[2rem] p-8 text-white">
          <h3 className="text-[#c8a96a] font-bold text-xl mb-6">Distribución de Tickets</h3>
          <div className="space-y-6">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Limpieza Corporativa</span>
                <span className="font-bold">70%</span>
              </div>
              <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
                <div className="bg-[#c8a96a] h-full w-[70%]"></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Mantenimiento Industrial</span>
                <span className="font-bold">30%</span>
              </div>
              <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
                <div className="bg-white h-full w-[30%]"></div>
              </div>
            </div>
          </div>
          <p className="mt-12 text-white/40 text-xs leading-relaxed uppercase tracking-widest">
            Data basada en los últimos 30 días de operación técnica.
          </p>
        </div>

      </div>
    </div>
  );
}