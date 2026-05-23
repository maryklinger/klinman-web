'use client';

import { useState, useEffect } from "react";
import Link from "next/link";
import StatusBadge from "../../components/StatusBadge.jsx";
import EstadoSelect from "../../components/EstadoSelect.jsx";
import PrioridadSelect from "../../components/PrioridadSelect.jsx"; 

// Badge de prioridad: Mantiene el tamaño 10px y la estética Klinman
function PriorityBadge({ prioridad }) {
  const styles = {
    Alta: "bg-[#991b1b] text-white", 
    Media: "bg-[#c8a96a] text-white",
    Baja: "bg-[#4a5568] text-white",
  };

  return (
    <span className={`px-2 py-1 rounded-md text-[10px] font-black uppercase shadow-sm ${styles[prioridad] || "bg-gray-500 text-white"}`}>
      {prioridad}
    </span>
  );
}

// 🔑 AGREGAMOS "permisos = []" EN LOS PROPS DEL COMPONENTE
export default function AdminTableClient({ solicitudesIniciales, permisos = [] }) {
  const [busqueda, setBusqueda] = useState("");
  const [estadoFiltro, setEstadoFiltro] = useState("todos");
  const [servicioFiltro, setServicioFiltro] = useState("todos");
  const [prioridadFiltro, setPrioridadFiltro] = useState("todos");
  
  const [fechaDesde, setFechaDesde] = useState("");
  const [fechaHasta, setFechaHasta] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  useEffect(() => {
    setCurrentPage(1);
  }, [busqueda, estadoFiltro, servicioFiltro, prioridadFiltro, fechaDesde, fechaHasta]);

  // 1. Lógica de filtrado combinada
  const solicitudesFiltradas = solicitudesIniciales.filter((s) => {
    const cumpleTexto = 
      s.nombre?.toLowerCase().includes(busqueda.toLowerCase()) ||
      s.ticket?.toLowerCase().includes(busqueda.toLowerCase());
    
    const cumpleEstado = 
      estadoFiltro === "todos" || 
      s.estado?.trim().toLowerCase() === estadoFiltro.toLowerCase();

    const cumpleServicio = 
      servicioFiltro === "todos" || 
      s.servicio === servicioFiltro;

    const cumplePrioridad = 
      prioridadFiltro === "todos" || 
      s.prioridad === prioridadFiltro;

    const fechaSolicitud = new Date(s.fecha_creacion);
    const inicio = fechaDesde ? new Date(fechaDesde + "T00:00:00") : null;
    const fin = fechaHasta ? new Date(fechaHasta + "T23:59:59") : null;

    const cumpleFecha = (!inicio || fechaSolicitud >= inicio) && 
                        (!fin || fechaSolicitud <= fin);

    return cumpleTexto && cumpleEstado && cumpleServicio && cumplePrioridad && cumpleFecha;
  });

  // 2. Paginación
  const totalPages = Math.ceil(solicitudesFiltradas.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = solicitudesFiltradas.slice(indexOfFirstItem, indexOfLastItem);

  // 3. Estadísticas para las Cards
  const stats = solicitudesIniciales.reduce((acc, s) => {
    const estado = s.estado?.trim().toLowerCase();
    if (estado === "pendiente") acc.pendientes++;
    else if (estado === "en revisión") acc.revision++;
    else if (estado === "finalizado") acc.finalizadas++;
    return acc;
  }, { pendientes: 0, revision: 0, finalizadas: 0 });

  return (
    <div className="font-sans antialiased text-[#1f4d3a]">
      {/* CARDS DE RESUMEN */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <SummaryCard label="Solicitudes Pendientes" count={stats.pendientes} color="text-[#c8a96a]" />
        <SummaryCard label="En Revisión" count={stats.revision} color="text-[#1f4d3a]" />
        <SummaryCard label="Finalizadas" count={stats.finalizadas} color="text-[#1f4d3a]" />
      </div>

      {/* BARRA DE FILTROS PRINCIPAL */}
      <div className="flex flex-col md:flex-row gap-4 mb-4">
        <input
          type="text"
          placeholder="Buscar por ticket o nombre..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="flex-1 border border-[#d8d2c7] rounded-2xl px-4 py-3 outline-none focus:border-[#c8a96a] bg-white shadow-sm"
        />

        <select
          value={servicioFiltro}
          onChange={(e) => setServicioFiltro(e.target.value)}
          className="border border-[#d8d2c7] rounded-2xl px-4 py-3 bg-white outline-none focus:border-[#c8a96a] shadow-sm font-medium text-[#1f4d3a]"
        >
          <option value="todos">Todos los servicios</option>
          <option value="Limpieza Corporativa">Limpieza Corporativa</option>
          <option value="Limpieza Residencial">Limpieza Residencial</option>
          <option value="Mantenimiento de Áreas Comunes">Mantenimiento de Áreas Comunes</option>
        </select>

        <select
          value={prioridadFiltro}
          onChange={(e) => setPrioridadFiltro(e.target.value)}
          className="border border-[#d8d2c7] rounded-2xl px-4 py-3 bg-white outline-none focus:border-[#c8a96a] shadow-sm font-medium text-[#1f4d3a]"
        >
          <option value="todos">Prioridad (Todas)</option>
          <option value="Alta">Alta</option>
          <option value="Media">Media</option>
          <option value="Baja">Baja</option>
        </select>

        <select
          value={estadoFiltro}
          onChange={(e) => setEstadoFiltro(e.target.value)}
          className="border border-[#d8d2c7] rounded-2xl px-4 py-3 bg-white outline-none focus:border-[#c8a96a] shadow-sm font-medium text-[#1f4d3a]"
        >
          <option value="todos">Todos los estados</option>
          <option value="pendiente">Pendiente</option>
          <option value="en revisión">En revisión</option>
          <option value="finalizado">Finalizado</option>
        </select>
      </div>

      {/* FILTROS DE FECHA */}
      <div className="flex flex-wrap items-center gap-4 mb-8 bg-[#faf8f3] p-4 rounded-2xl border border-[#ece7dc]">
        <div className="flex flex-col">
          <label className="text-[10px] font-bold text-[#1f4d3a] uppercase ml-1 mb-1">Fecha Inicial</label>
          <input
            type="date"
            value={fechaDesde}
            onChange={(e) => setFechaDesde(e.target.value)}
            className="border border-[#d8d2c7] rounded-xl px-3 py-2 bg-white text-sm focus:border-[#c8a96a] outline-none"
          />
        </div>
        <div className="flex flex-col">
          <label className="text-[10px] font-bold text-[#1f4d3a] uppercase ml-1 mb-1">Fecha Final</label>
          <input
            type="date"
            value={fechaHasta}
            onChange={(e) => setFechaHasta(e.target.value)}
            className="border border-[#d8d2c7] rounded-xl px-3 py-2 bg-white text-sm focus:border-[#c8a96a] outline-none"
          />
        </div>
        {(fechaDesde || fechaHasta) && (
          <button 
            onClick={() => { setFechaDesde(""); setFechaHasta(""); }}
            className="mt-5 text-xs text-red-600 font-semibold hover:underline"
          >
            Limpiar filtros de fecha
          </button>
        )}
      </div>

      {/* TABLA DE DATOS */}
      <div className="bg-white rounded-3xl shadow-sm border border-[#ece7dc] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-[#1f4d3a] text-white">
              <tr>
                <th className="p-5 font-medium">Ticket</th>
                <th className="p-5 font-medium">Prioridad</th>
                <th className="p-5 font-medium">Cliente</th>
                <th className="p-5 font-medium">Empresa</th>
                <th className="p-5 font-medium">Servicio</th>
                <th className="p-5 font-medium min-w-[220px]">Estado</th>
                <th className="p-5 font-medium whitespace-nowrap">Fecha</th>
                <th className="p-5 font-medium text-right">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.length > 0 ? (
                currentItems.map((s) => (
                  <tr key={s.id} className="border-b border-[#f1ede4] hover:bg-[#faf8f3] transition">
                    <td className="p-5 font-semibold font-mono text-[#c8a96a]">{s.ticket}</td>
                    
                    {/* 🔒 CANDADO PARA PRIORIDAD */}
                    <td className="p-5">
                      <div className="flex flex-col gap-2">
                        <PriorityBadge prioridad={s.prioridad} />
                        {permisos.includes("cambiar prioridad") && (
                          <PrioridadSelect solicitudId={s.id} prioridadActual={s.prioridad} />
                        )}
                      </div>
                    </td>

                    <td className="p-5 font-medium text-gray-800">{s.nombre}</td>
                    <td className="p-5 text-gray-600">{s.empresa}</td>
                    <td className="p-5 text-gray-600">{s.servicio}</td>
                    
                    {/* 🔒 CANDADO PARA ESTADO */}
                    <td className="p-5">
                      <div className="flex items-center gap-3">
                        <StatusBadge estado={s.estado} />
                        {permisos.includes("cambiar estado") && (
                          <EstadoSelect solicitudId={s.id} estadoActual={s.estado} />
                        )}
                      </div>
                    </td>

                    <td className="p-5 text-gray-500 whitespace-nowrap text-sm font-mono">
                      {new Date(s.fecha_creacion).toLocaleDateString("es-CL")}
                    </td>
                    <td className="p-5 text-right">
                      <Link 
                        href={`/admin/solicitudes/${s.id}`}
                        className="inline-block bg-[#1f4d3a] text-white px-5 py-2 rounded-lg text-sm font-medium border border-[#c8a96a] hover:bg-[#16382b] transition-all whitespace-nowrap"
                      >
                        Ver detalle
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="p-10 text-center text-gray-400 italic">
                    No se encontraron solicitudes con los filtros seleccionados.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* PAGINACIÓN */}
        <div className="flex items-center justify-between px-6 py-4 bg-gray-50 border-t border-[#f1ede4]">
          <p className="text-sm text-gray-600">
            Mostrando <span className="font-semibold">{currentItems.length}</span> de <span className="font-semibold">{solicitudesFiltradas.length}</span> resultados
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-[#d8d2c7] rounded-xl disabled:opacity-30 transition"
            >
              Anterior
            </button>
            <div className="flex items-center px-4 text-sm font-medium text-[#1f4d3a] font-mono">
              Página {currentPage} de {totalPages || 1}
            </div>
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages || totalPages === 0}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-[#d8d2c7] rounded-xl disabled:opacity-30 transition"
            >
              Siguiente
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function SummaryCard({ label, count, color }) {
  return (
    <div className="bg-white rounded-3xl p-7 shadow-sm border border-[#ece7dc]">
      <p className="text-sm text-gray-500 font-medium">{label}</p>
      <h2 className={`text-5xl font-bold font-mono ${color} mt-3`}>{count}</h2>
    </div>
  );
}