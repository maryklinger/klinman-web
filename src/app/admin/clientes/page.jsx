export default function ClientesPage() {
  // Datos de ejemplo basados en tu diseño
  const clientes = [
    { id: 1, nombre: "Met Gala", sucursales: 3, serviciosActivos: 2, logo: "MG" },
    { id: 2, nombre: "Friends Cafe", sucursales: 1, serviciosActivos: 5, logo: "FC" },
    { id: 3, nombre: "Klinman Corp", sucursales: 12, serviciosActivos: 8, logo: "KC" },
  ];

  return (
    <div className="p-8 md:p-12 space-y-10">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-bold text-[#1f4d3a] tracking-tight">Clientes</h1>
          <p className="text-gray-500 font-medium mt-1">Expediente de activos y contratos</p>
        </div>
        <button className="bg-[#1f4d3a] text-white px-6 py-3 rounded-2xl text-sm font-bold border border-[#c8a96a] hover:bg-[#16382b] transition-all">
          Nuevo Cliente
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {clientes.map((cliente) => (
          <div key={cliente.id} className="bg-white rounded-[2rem] p-8 shadow-sm border border-[#ece7dc] hover:shadow-md transition-all group">
            <div className="flex justify-between items-start mb-6">
              <div className="w-12 h-12 rounded-2xl bg-[#f8f5ef] flex items-center justify-center text-[#1f4d3a] font-black text-xl border border-[#ece7dc]">
                {cliente.logo}
              </div>
              <span className="bg-[#1f4d3a]/5 text-[#1f4d3a] px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider">
                {cliente.serviciosActivos} Servicios
              </span>
            </div>
            
            <h3 className="text-xl font-bold text-[#1f4d3a] mb-1">{cliente.nombre}</h3>
            <p className="text-sm text-gray-400 font-medium mb-6">{cliente.sucursales} Sucursales registradas</p>
            
            <div className="pt-6 border-t border-[#f1ede4] flex justify-between items-center">
              <button className="text-xs font-black text-[#c8a96a] uppercase tracking-widest hover:text-[#1f4d3a] transition-colors">
                Ver Expediente
              </button>
              <div className="flex -space-x-2">
                {/* Indicadores visuales de activos */}
                <div className="w-6 h-6 rounded-full bg-[#1f4d3a] border-2 border-white"></div>
                <div className="w-6 h-6 rounded-full bg-[#c8a96a] border-2 border-white"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}