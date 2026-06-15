'use client';
import React, { useState } from 'react';

export default function ConfiguracionPage() {
  const [config, setConfig] = useState({
    slaHoras: 24,
    iva: 19,
    notificaciones: true
  });

  return (
    <div className="p-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-4xl font-black text-[#1f4d3a] tracking-tighter uppercase">Configuración</h1>
        <p className="text-[#1f4d3a]/60 font-medium">Configuración de los flujos operativos.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* 1. Lógica de Solicitudes (SLA) */}
        <section className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm">
          <h2 className="text-sm font-black text-[#1f4d3a] uppercase mb-6 tracking-wider">Reglas de Atención (SLA)</h2>
          <div className="space-y-6">
            <div>
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2 block">Tiempo máximo de respuesta (Horas)</label>
              <input type="number" defaultValue={config.slaHoras} className="w-full bg-[#f8f5ef] p-4 rounded-xl font-bold text-[#1f4d3a] outline-none border-2 border-transparent focus:border-[#c8a96a]" />
            </div>
            <div>
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2 block">Asignación automática</label>
              <select className="w-full bg-[#f8f5ef] p-4 rounded-xl font-bold text-[#1f4d3a] outline-none">
                <option>Repartición equitativa</option>
                <option>Repartición manual</option>
              </select>
            </div>
          </div>
        </section>

        {/* 2. Preferencias de Notificación */}
        <section className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm">
          <h2 className="text-sm font-black text-[#1f4d3a] uppercase mb-6 tracking-wider">Notificaciones y Alertas</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-4 bg-[#f8f5ef] rounded-xl">
              <span className="font-bold text-[#1f4d3a] text-sm">Notificar cliente al asignar</span>
              <input type="checkbox" className="w-5 h-5 accent-[#c8a96a]" defaultChecked />
            </div>
            <div className="flex justify-between items-center p-4 bg-[#f8f5ef] rounded-xl">
              <span className="font-bold text-[#1f4d3a] text-sm">Alertas de tickets vencidos</span>
              <input type="checkbox" className="w-5 h-5 accent-[#c8a96a]" defaultChecked />
            </div>
          </div>
        </section>

        {/* 3. Gestión de Catálogos (CRM) */}
        <section className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm">
          <h3 className="text-sm font-black text-[#1f4d3a] uppercase mb-4 tracking-wider">Tipos de Solicitudes</h3>
          <div className="flex flex-wrap gap-2">
            {['Limpieza Corporativa', 'Mantenimiento Técnico', 'Servicios Especializados', 'Reclamos'].map(tag => (
              <span key={tag} className="px-4 py-2 bg-[#1f4d3a] text-white rounded-full text-xs font-bold uppercase">{tag}</span>
            ))}
            <button className="px-4 py-2 border-2 border-dashed border-gray-300 rounded-full text-xs font-black text-gray-400 hover:border-[#c8a96a] hover:text-[#c8a96a]">+ Agregar</button>
          </div>
        </section>

        {/* 4. Integraciones / Estado */}
        <section className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm">
          <h3 className="text-sm font-black text-[#1f4d3a] uppercase mb-4 tracking-wider">Conectividad Sistema</h3>
          <div className="p-4 border-2 border-dashed border-[#1f4d3a]/20 rounded-2xl text-center">
            <p className="text-xs font-bold text-[#1f4d3a]/60">Status del servicio: <span className="text-[#c8a96a]">CONECTADO</span></p>
           
          </div>
        </section>

      </div>

      <div className="mt-8 flex justify-end">
        <button className="bg-[#1f4d3a] text-white px-10 py-4 rounded-2xl font-black uppercase tracking-widest text-sm hover:opacity-90 transition-all shadow-xl shadow-[#1f4d3a]/20">
          Guardar Configuración
        </button>
      </div>
    </div>
  );
}