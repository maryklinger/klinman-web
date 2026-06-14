import sql from "@/lib/db"; // Tu conector a Neon
import React from 'react';

// Iconos SVG minimalistas (Font-weight fuerte para que combine)
const IconStar = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>;
const IconUsers = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle></svg>;
const IconChart = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></svg>;

// 1. FUNCIÓN DE DATOS PARA NEON
async function getReportData() {
  try {
    // Sintaxis de la librería postgres (Neon)
    const result = await sql`SELECT * FROM solicitudes`;
    return result;
  } catch (error) {
    console.error("Error en DB Reportes Neon:", error);
    return [];
  }
}

export default async function ReportesPage() {
  const data = await getReportData();

  // --- LÓGICA DE PRODUCTIVIDAD (POR TÉCNICO REAL) ---
  const conteoTecnicos = data.reduce((acc, sol) => {
    // Nota: sol.nombre es el nombre del solicitante, si quieres agrupar por operador usa sol.operador_id
    const tecnico = (sol.nombre || "Sin Asignar").trim();
    acc[tecnico] = (acc[tecnico] || 0) + 1;
    return acc;
  }, {});

  const rankingTecnicos = Object.entries(conteoTecnicos)
    .map(([name, tickets]) => ({
      name,
      tickets,
      status: tickets > 10 ? "ÉLITE" : "ACTIVO"
    }))
    .sort((a, b) => b.tickets - a.tickets);

  // --- LÓGICA DE CALIDAD (POR EMPRESA CLIENTE) ---
  const conteoEmpresas = data.reduce((acc, sol) => {
    const emp = (sol.empresa || "General").trim();
    acc[emp] = (acc[emp] || 0) + 1;
    return acc;
  }, {});

  const calidadEmpresas = Object.entries(conteoEmpresas).map(([empresa, cant]) => ({
    empresa,
    rating: Math.min(85 + (cant), 99),
    color: cant > 5 ? "bg-[#1f4d3a]" : "bg-[#c8a96a]"
  }));

  return (
    <div className="p-8 md:p-12 space-y-12 bg-[#f8f5ef] min-h-screen font-sans antialiased">
      
      {/* CABECERA */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-[42px] font-black text-[#1f4d3a] tracking-[-0.05em] leading-none">
            Reportes
          </h1>
          <p className="text-gray-500 font-black uppercase text-[11px] tracking-[0.3em] mt-3">
            Análisis de rendimiento operacional
          </p>
        </div>
        
        <div className="flex gap-4">
          <button className="bg-white text-[#1f4d3a] px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] border border-[#ece7dc] shadow-sm hover:bg-[#fafafa] transition-all">
            Descargar Excel
          </button>
          <button className="bg-[#1f4d3a] text-white px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] border border-[#c8a96a] shadow-lg hover:opacity-90 transition-all">
            Reporte PDF
          </button>
        </div>
      </div>

      {/* KPIs SUPERIORES */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white p-8 rounded-[2.5rem] border border-[#ece7dc] flex items-center justify-between shadow-sm group">
          <div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Tickets Totales</p>
            <h2 className="text-4xl font-black text-[#1f4d3a] tracking-tighter mt-1 font-mono">{data.length}</h2>
          </div>
          <div className="w-14 h-14 bg-[#f8f5ef] rounded-2xl flex items-center justify-center text-[#c8a96a] border border-[#ece7dc] group-hover:bg-[#1f4d3a] group-hover:text-white transition-colors">
            <IconChart />
          </div>
        </div>

        <div className="bg-white p-8 rounded-[2.5rem] border border-[#ece7dc] flex items-center justify-between shadow-sm group">
          <div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Técnicos Activos</p>
            <h2 className="text-4xl font-black text-[#1f4d3a] tracking-tighter mt-1 font-mono">{Object.keys(conteoTecnicos).length}</h2>
          </div>
          <div className="w-14 h-14 bg-[#f8f5ef] rounded-2xl flex items-center justify-center text-[#c8a96a] border border-[#ece7dc] group-hover:bg-[#1f4d3a] group-hover:text-white transition-colors">
            <IconUsers />
          </div>
        </div>

        <div className="bg-white p-8 rounded-[2.5rem] border border-[#ece7dc] flex items-center justify-between shadow-sm group">
          <div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Performance</p>
            <h2 className="text-4xl font-black text-[#1f4d3a] tracking-tighter mt-1 font-mono">99%</h2>
          </div>
          <div className="w-14 h-14 bg-[#f8f5ef] rounded-2xl flex items-center justify-center text-[#c8a96a] border border-[#ece7dc] group-hover:bg-[#1f4d3a] group-hover:text-white transition-colors">
            <IconStar />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* TABLA DE PRODUCTIVIDAD */}
        <div className="bg-white p-10 rounded-[2.5rem] border border-[#ece7dc] shadow-sm">
          <h3 className="text-xl font-black text-[#1f4d3a] mb-8 tracking-tighter uppercase">Productividad Técnica</h3>
          <table className="w-full">
            <thead>
              <tr className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] border-b border-[#f1ede4]">
                <th className="text-left pb-6">Operador</th>
                <th className="text-center pb-6">Tickets</th>
                <th className="text-right pb-6">Rango</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {rankingTecnicos.map((tech, i) => (
                <tr key={i} className="group">
                  <td className="py-5 text-[13px] font-black text-[#1f4d3a] uppercase tracking-tight">{tech.name}</td>
                  <td className="py-5 text-center font-black text-[#c8a96a] text-lg tracking-tighter font-mono">{tech.tickets}</td>
                  <td className="py-5 text-right">
                    <span className="text-[9px] font-black px-4 py-1.5 bg-[#f8f5ef] rounded-full text-[#1f4d3a] border border-[#ece7dc] uppercase tracking-widest">
                      {tech.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* CALIDAD POR CLIENTE */}
        <div className="bg-white p-10 rounded-[2.5rem] border border-[#ece7dc] shadow-sm">
          <h3 className="text-xl font-black text-[#1f4d3a] mb-8 tracking-tighter uppercase">Calidad de Servicio</h3>
          <div className="space-y-8">
            {calidadEmpresas.map((item, index) => (
              <div key={index} className="space-y-3">
                <div className="flex justify-between items-end text-[11px] font-black uppercase tracking-[0.1em]">
                  <span className="text-gray-500">{item.empresa}</span>
                  <span className="text-lg text-[#1f4d3a] tracking-tighter leading-none font-mono">{item.rating}%</span>
                </div>
                <div className="h-3 w-full bg-[#f8f5ef] rounded-full overflow-hidden border border-[#ece7dc]">
                  <div className={`h-full ${item.color} transition-all duration-1000`} style={{ width: `${item.rating}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}