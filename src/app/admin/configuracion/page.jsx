"use client";
import React, { useState } from 'react';

// Iconos Sólidos Klinman
const IconPlus = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>;
const IconTrash = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>;

export default function CerebroKlinmanFinal() {
  // Estado conectado idealmente a tu tabla 'servicios'
  const [servicios, setServicios] = useState([
    { id: 1, nombre: "LIMPIEZA CORPORATIVA", codigo: "SRV-001" },
    { id: 2, nombre: "MANTENIMIENTO INDUSTRIAL", codigo: "SRV-002" }
  ]);

  const [modalAbierto, setModalAbierto] = useState(false);
  const [nuevoServicio, setNuevoServicio] = useState("");

  return (
    /* ======================================================================
       ¡CAMBIO PRINCIPAL AQUÍ! 
       Añadimos 'font-sans antialiased' para acoplar la tipografía global Geist.
       ====================================================================== */
    <div className="p-8 md:p-14 bg-[#f8f5ef] min-h-screen font-sans antialiased text-[#1f4d3a] select-none">
      
      {/* MODAL DE REGISTRO (SIN CURSIVAS, TODO BLACK) */}
      {modalAbierto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-[#1f4d3a]/70 backdrop-blur-md">
          <div className="bg-white w-full max-w-lg rounded-[3.5rem] p-12 shadow-2xl border border-[#c8a96a]/30">
            <h2 className="text-3xl font-black uppercase tracking-tighter mb-10">ALTA DE SERVICIO</h2>
            <div className="space-y-6">
              <input 
                autoFocus
                type="text" 
                value={nuevoServicio}
                onChange={(e) => setNuevoServicio(e.target.value.toUpperCase())}
                className="w-full bg-[#f8f5ef] border-2 border-transparent focus:border-[#c8a96a] p-6 rounded-[2rem] outline-none font-black uppercase text-lg transition-all"
                placeholder="NOMBRE DEL SERVICIO"
              />
              <div className="flex gap-4">
                <button 
                  onClick={() => setModalAbierto(false)}
                  className="flex-1 bg-gray-100 text-gray-400 py-6 rounded-[2rem] font-black text-xs uppercase tracking-[0.2em]"
                >
                  CANCELAR
                </button>
                <button 
                  className="flex-[2] bg-[#1f4d3a] text-white py-6 rounded-[2rem] font-black text-xs uppercase tracking-[0.2em] shadow-xl hover:bg-[#c8a96a] transition-all"
                >
                  CONFIRMAR
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* HEADER DE IMPACTO */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 mb-24">
        <div>
          <h1 className="text-[72px] font-black tracking-[-0.06em] leading-[0.8] uppercase">
            CEREBRO <br/> <span className="text-[#c8a96a]">MAESTRO</span>
          </h1>
          {/* Añadido font-mono para los registros internos */}
          <p className="text-[12px] font-black text-gray-400 uppercase tracking-[0.6em] mt-8">Sincronización de base de datos activa</p>
        </div>
        <div className="flex gap-4">
            <button className="bg-white text-[#1f4d3a] px-10 py-6 rounded-[2.5rem] text-[11px] font-black uppercase tracking-[0.3em] shadow-sm border border-[#ece7dc]">
              REPORTE LOGS
            </button>
            <button className="bg-[#1f4d3a] text-white px-10 py-6 rounded-[2.5rem] text-[11px] font-black uppercase tracking-[0.3em] shadow-2xl border border-[#c8a96a]">
              GUARDAR CAMBIOS
            </button>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-12">
        
        {/* LISTADO DE SERVICIOS (OPERATIVO) */}
        <div className="col-span-12 lg:col-span-8 space-y-8">
          <div className="flex justify-between items-center px-8">
            <h2 className="text-2xl font-black uppercase tracking-tighter">CATÁLOGO DE SERVICIOS</h2>
            <button 
              onClick={() => setModalAbierto(true)}
              className="bg-[#1f4d3a] text-white p-5 rounded-2xl hover:bg-[#c8a96a] transition-all"
            >
              <IconPlus />
            </button>
          </div>

          <div className="space-y-4">
            {servicios.map((s) => (
              <div key={s.id} className="bg-white p-10 rounded-[3.5rem] border border-[#ece7dc] shadow-sm flex items-center justify-between group hover:border-[#1f4d3a] transition-all">
                <div className="flex items-center gap-12">
                  {/* font-mono para los ID correlativos */}
                  <div className="w-16 h-16 bg-[#f8f5ef] rounded-[1.5rem] flex items-center justify-center font-black text-[#c8a96a] text-sm font-mono">
                    {s.id.toString().padStart(2, '0')}
                  </div>
                  <div>
                    <h3 className="text-3xl font-black uppercase tracking-tighter leading-none">{s.nombre}</h3>
                    {/* font-mono para el código del SKU / Servicio */}
                    <span className="text-[10px] font-black text-gray-300 uppercase tracking-[0.3em] mt-3 block font-mono">{s.codigo}</span>
                  </div>
                </div>
                <button className="p-4 bg-red-50 text-red-300 rounded-2xl opacity-0 group-hover:opacity-100 transition-all hover:bg-red-500 hover:text-white">
                  <IconTrash />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* FACTURACIÓN Y PAGOS (REGLAS DE NEGOCIO) */}
        <div className="col-span-12 lg:col-span-4 space-y-10">
          
          <section className="bg-white p-10 rounded-[3.5rem] border border-[#ece7dc] shadow-sm">
            <h2 className="text-xl font-black uppercase tracking-tighter mb-8">PAGOS Y FACTURACIÓN</h2>
            <div className="space-y-6">
              <div className="p-8 bg-[#f8f5ef] rounded-[2.5rem]">
                <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 block mb-4">DÍA DE COBRO MENSUAL</span>
                <div className="flex items-end gap-2">
                  {/* font-mono asignado al día de cobro */}
                  <span className="text-5xl font-black leading-none text-[#1f4d3a] font-mono">{"05"}</span>
                  <span className="text-[11px] font-black uppercase mb-1">CADA MES</span>
                </div>
              </div>
              
              <div className="p-8 bg-[#f8f5ef] rounded-[2.5rem]">
                <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 block mb-4">IMPUESTO (IVA)</span>
                <div className="flex items-end gap-2">
                  {/* font-mono asignado al porcentaje del IVA */}
                  <span className="text-5xl font-black leading-none text-[#c8a96a] font-mono">19</span>
                  <span className="text-2xl font-black uppercase mb-1">%</span>
                </div>
              </div>
            </div>
          </section>

          {/* ESTADO DE CAJA / REGISTRO */}
          <section className="bg-[#1f4d3a] p-10 rounded-[4rem] text-white shadow-2xl border border-[#c8a96a]/20">
            <h2 className="text-xl font-black uppercase text-[#c8a96a] tracking-tighter mb-6">REGISTRO FINANCIERO</h2>
            <div className="space-y-4">
               <div className="flex justify-between border-b border-white/10 pb-4">
                  <span className="text-[10px] font-black uppercase tracking-widest opacity-40">TICKETS PAGADOS</span>
                  {/* font-mono asignado */}
                  <span className="text-[12px] font-black uppercase font-mono">128</span>
               </div>
               <div className="flex justify-between border-b border-white/10 pb-4">
                  <span className="text-[10px] font-black uppercase tracking-widest opacity-40">PENDIENTES COBRO</span>
                  {/* font-mono asignado */}
                  <span className="text-[12px] font-black uppercase text-red-400 font-mono">12</span>
               </div>
            </div>
            <button className="w-full mt-8 py-5 bg-white/5 border border-white/10 rounded-2xl text-[9px] font-black uppercase tracking-[0.3em] hover:bg-white hover:text-[#1f4d3a] transition-all">
                VER HISTORIAL DE PAGOS
            </button>
          </section>

        </div>
      </div>
    </div>
  );
}