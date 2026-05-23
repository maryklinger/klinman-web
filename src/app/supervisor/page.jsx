export default function SupervisorDashboard() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Centro de Supervisión y Asignación</h1>
        <p className="text-slate-500 text-sm mt-1">Monitoreo de solicitudes operacionales en tiempo real.</p>
      </div>

      {/* Tarjetas de Métricas Rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white border border-[#ece7dc] p-6 rounded-2xl shadow-sm">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Solicitudes Pendientes</span>
          <div className="text-3xl font-bold mt-2 text-amber-600">12</div>
        </div>
        <div className="bg-white border border-[#ece7dc] p-6 rounded-2xl shadow-sm">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">En Ejecución</span>
          <div className="text-3xl font-bold mt-2 text-blue-600">5</div>
        </div>
        <div className="bg-white border border-[#ece7dc] p-6 rounded-2xl shadow-sm">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Críticas sin Asignar</span>
          <div className="text-3xl font-bold mt-2 text-red-600">2</div>
        </div>
      </div>

      {/* Aquí puedes renderizar tu tabla o lista reutilizando tus Server Actions */}
      <div className="bg-white border border-[#ece7dc] rounded-2xl p-6 shadow-sm">
        <h3 className="text-sm font-bold uppercase tracking-wider text-[#1f4d3a] mb-4">Próximas Solicitudes a Revisar</h3>
        <p className="text-xs text-slate-400">Despliega aquí el listado usando tus Server Actions de solicitudes...</p>
      </div>
    </div>
  );
}