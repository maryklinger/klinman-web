export default function OperadorPage() {
  // Simulamos una orden asignada que vendría de tu BD
  const tareasAsignadas = [
    { id: 104, titulo: "Mantención Climatización Piso 3", prioridad: "ALTA", estado: "Pendiente" }
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="bg-white border border-[#ece7dc] p-5 rounded-2xl shadow-sm">
        <h2 className="text-xs font-black text-slate-400 uppercase tracking-widest">Mi Turno Activo</h2>
        <p className="text-lg font-bold text-[#1f4d3a] mt-1">Órdenes de Trabajo Asignadas</p>
      </div>

      <div className="space-y-3">
        {tareasAsignadas.map((tarea) => (
          <div key={tarea.id} className="bg-white border-l-4 border-l-amber-500 border border-[#ece7dc] p-5 rounded-xl shadow-sm space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[10px] font-bold text-slate-400">OT #{tarea.id}</span>
                <h3 className="font-bold text-[#1f4d3a] text-sm mt-0.5">{tarea.titulo}</h3>
              </div>
              <span className="bg-amber-50 text-amber-700 border border-amber-200 text-[10px] font-black px-2.5 py-1 rounded-full uppercase">
                {tarea.prioridad}
              </span>
            </div>

            <div className="pt-2 border-t border-slate-100 flex gap-2">
              {/* Aquí llamarías directamente a tu Server Action 'actualizarEstado' */}
              <button className="flex-1 bg-[#1f4d3a] hover:bg-[#16382b] text-white text-xs font-bold py-3 rounded-xl transition-all uppercase tracking-wider">
                Iniciar Tarea
              </button>
              <button className="px-4 py-3 border border-slate-200 hover:bg-slate-50 text-slate-500 text-xs font-bold rounded-xl transition-all uppercase">
                Ver Detalles
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}