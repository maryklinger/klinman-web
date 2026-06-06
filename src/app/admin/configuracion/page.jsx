"use client";
import React from 'react';

export default function ConfiguracionPage() {
  return (
    <div className="p-8">
      {/* Header que sigue tu patrón */}
      <div className="mb-10">
        <h1 className="text-4xl font-black text-[#1f4d3a] tracking-tighter uppercase">Configuración</h1>
        <p className="text-[#1f4d3a]/60 font-medium">Gestión de parámetros del sistema y preferencias</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Contenedor tipo "Card" igual al de Usuarios */}
        <section className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm">
          <h2 className="text-lg font-black text-[#1f4d3a] uppercase mb-6 tracking-wider">Parámetros de Facturación</h2>
          
          <div className="space-y-6">
            <div>
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2 block">Día de cobro mensual</label>
              <input type="number" defaultValue="05" className="w-full bg-[#f8f5ef] p-4 rounded-xl font-bold text-[#1f4d3a] outline-none" />
            </div>
            <div>
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2 block">Porcentaje de IVA (%)</label>
              <input type="number" defaultValue="19" className="w-full bg-[#f8f5ef] p-4 rounded-xl font-bold text-[#c8a96a] outline-none" />
            </div>
          </div>
        </section>

        {/* Panel de acciones rápidas */}
        <section className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm">
          <h2 className="text-lg font-black text-[#1f4d3a] uppercase mb-6 tracking-wider">Preferencias de Sistema</h2>
          
          <div className="flex flex-col gap-4">
            <button className="w-full flex justify-between items-center p-4 bg-[#f8f5ef] rounded-xl font-bold text-[#1f4d3a] hover:bg-[#1f4d3a] hover:text-white transition-all">
              <span>Gestionar Módulos</span>
              <span className="text-[10px] bg-[#c8a96a] text-white px-2 py-1 rounded-lg">ACTIVO</span>
            </button>
            <button className="w-full flex justify-between items-center p-4 bg-[#f8f5ef] rounded-xl font-bold text-[#1f4d3a] hover:bg-[#1f4d3a] hover:text-white transition-all">
              <span>Backups Automáticos</span>
              <span className="text-[10px] bg-[#c8a96a] text-white px-2 py-1 rounded-lg">PROGRAMADO</span>
            </button>
          </div>
        </section>
      </div>

      {/* Cada sección es un 'Module Card' */}
<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
  
  {/* Módulo de Seguridad */}
  <section className="bg-white p-8 rounded-[2rem] border border-gray-100">
    <h3 className="text-sm font-black text-[#1f4d3a] uppercase mb-4 tracking-wider">Protocolos de Seguridad</h3>
    <div className="flex justify-between items-center py-4 border-b border-gray-50">
      <span className="text-sm font-bold text-gray-600">Alerta de Renovación de EPP</span>
      <input type="checkbox" className="toggle-checkbox" />
    </div>
    <div className="flex justify-between items-center py-4">
      <span className="text-sm font-bold text-gray-600">Certificación ISO 9001</span>
      <span className="text-[10px] font-black text-[#c8a96a]">ACTIVO</span>
    </div>
  </section>

  {/* Módulo de Operaciones */}
  <section className="bg-white p-8 rounded-[2rem] border border-gray-100">
    <h3 className="text-sm font-black text-[#1f4d3a] uppercase mb-4 tracking-wider">Gestión de Equipos</h3>
    <button className="w-full bg-[#f8f5ef] p-4 rounded-xl font-bold text-[#1f4d3a] text-left hover:bg-[#1f4d3a]/5 transition-all">
      Gestionar Inventario de Maquinaria
    </button>
  </section>
</div>

      {/* Botón de guardado inferior, igual que en Usuarios */}
      <div className="mt-8 flex justify-end">
        <button className="bg-[#1f4d3a] text-white px-10 py-4 rounded-2xl font-black uppercase tracking-widest text-sm hover:bg-[#1f4d3a]/90 transition-all">
          Guardar Cambios
        </button>
      </div>
    </div>
  );
}