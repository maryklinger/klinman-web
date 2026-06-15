'use client';
import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { 
  ClockIcon, 
  CheckBadgeIcon, 
  ExclamationTriangleIcon, 
  StarIcon,
  UserPlusIcon,
  XMarkIcon
} from "@heroicons/react/24/outline";

export default function DashboardAdmin({ 
  solicitudesIniciales = [], 
  usuariosIniciales = [] // Array que viene de tu consulta a la tabla: CREATE TABLE usuarios...
}) {
  
  // 1. ESTADOS LOCALES PARA EL WORKFLOW
  const [solicitudes, setSolicitudes] = useState(solicitudesIniciales);
  const [ticketSeleccionado, setTicketSeleccionado] = useState(null);
  const [modalAsignar, setModalAsignar] = useState(false);
  const [cargandoAsignacion, setCargandoAsignacion] = useState(false);






  
  // 1. FILTRADO DE OPERADORES: USANDO LOGICA DE COMPARACIÓN SEGURA
  const listaOperadores = usuariosIniciales.filter((u) => {
  return (
    Number(u.rol_id) === 3 &&
    u.estado === true
    );
  });

  // LOG DE CONTROL (Revisa la consola F12)
  console.log("Usuarios Totales Recibidos:", usuariosIniciales);
  console.log("Operadores Filtrados:", listaOperadores);

  
  // 2. PROCESAMIENTO DE ESTADÍSTICAS EN TIEMPO REAL
  const conteo = solicitudes.reduce((acc, s) => {
    const estado = s.estado ? String(s.estado).toLowerCase().trim() : "";
    if (estado.includes("pendiente")) {
      acc["pendiente"]++;
    } else if (estado.includes("revis") || estado.includes("revisión")) { 
      acc["en revisión"]++;
    } else if (estado.includes("finalizado")) {
      acc["finalizado"]++;
    }
    return acc;
  }, { "pendiente": 0, "en revisión": 0, "finalizado": 0 });

  const stats = [
    { label: 'Solicitudes Pendientes', value: conteo["pendiente"], color: 'text-[#c8a96a]', icon: <ExclamationTriangleIcon className="w-5 h-5" /> },
    { label: 'En Revisión', value: conteo["en revisión"], color: 'text-[#1f4d3a]', icon: <ClockIcon className="w-5 h-5" /> },
    { label: 'Finalizadas', value: conteo["finalizado"], color: 'text-slate-400', icon: <CheckBadgeIcon className="w-5 h-5" /> },
    { label: 'Satisfacción', value: '4.8', color: 'text-[#c8a96a]', icon: <StarIcon className="w-5 h-5" /> },
  ];

  const alertasPendientes = solicitudes.filter(s => {
    const estado = s.estado ? String(s.estado).toLowerCase().trim() : "";
    return estado.includes("pendiente");
  });

  // 3. HANDLERS DE ASIGNACIÓN INTERACTIVA
  const abrirAsignacion = (ticket) => {
    setTicketSeleccionado(ticket);
    setModalAsignar(true);
  };

  const ejecutarAsignacion = async (operadorId, operadorNombre) => {
    setCargandoAsignacion(true);
    try {
      // Endpoint o Server Action que interactúa con tu base de datos SQL Server
      // await asignarTicketEnBaseDatos(ticketSeleccionado.id, operadorId);
      
      await new Promise(resolve => setTimeout(resolve, 500));

      setSolicitudes(prev => prev.map(s => 
        s.id === ticketSeleccionado.id 
          ? { ...s, operador_id: operadorId, operador_nombre: operadorNombre, estado: 'En Revisión' } 
          : s
      ));

      toast.success(`TICKET ASIGNADO A ${operadorNombre.toUpperCase()}`);
      setModalAsignar(false);
      setTicketSeleccionado(null);
    } catch (error) {
      toast.error("Error al guardar la asignación en la base de datos");
    } finally {
      setCargandoAsignacion(false);
    }
  };

  // 4. PARAMETRIZACIÓN DEL GRÁFICO CIRCULAR (SVG)
  const totalTickets = conteo["pendiente"] + conteo["en revisión"] + conteo["finalizado"] || 1;
  const pctPendiente = Math.round((conteo["pendiente"] / totalTickets) * 100);
  const pctRevision = Math.round((conteo["en revisión"] / totalTickets) * 100);
  const pctFinalizado = Math.round((conteo["finalizado"] / totalTickets) * 100);

  return (
    <div className="w-full space-y-12 font-sans antialiased text-[#1f4d3a] select-none">
      
      {/* MODAL DE ASIGNACIÓN — SIN CAMBIOS EN TU MAQUETA VISUAL */}
      {modalAsignar && ticketSeleccionado && (
        <div className="fixed top-0 left-0  right-0 bottom-0  z-[99999] flex   items-center   justify-center bg-[#1f4d3a]/70 backdrop-blur-md">
          {/* Ajuste: max-h-[90vh] asegura que no tape todo, y rounded-[2rem] para un look más moderno */}
          <div className="bg-white w-full max-w-lg max-h-[90vh] flex flex-col rounded-[2rem] p-8 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            
            {/* Header del Modal */}
            <div className="flex justify-between items-center mb-6">
              <div>
                <p className="text-[9px] font-bold text-[#c8a96a] tracking-[0.2em] uppercase">Derivación</p>
                <h2 className="text-2xl font-bold text-[#1f4d3a]">Asignar Operador</h2>
              </div>
              <button 
                onClick={() => { setModalAsignar(false); setTicketSeleccionado(null); }} 
                className="p-2 text-slate-400 hover:bg-slate-100 rounded-full transition-colors"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-[#f8f5ef] p-5 rounded-2xl mb-6 border border-[#ece7dc]">
              <span className="text-[9px] font-black text-slate-400 tracking-wider block uppercase">Ticket Seleccionado</span>
              <p className="font-bold text-lg text-[#1f4d3a] mt-1">
                <span className="font-mono text-[#c8a96a]">{ticketSeleccionado.ticket || `TK-${ticketSeleccionado.id}`}</span> — {ticketSeleccionado.nombre}
              </p>
              <p className="text-xs text-slate-500 mt-0.5">{ticketSeleccionado.servicio || 'Servicio General'}</p>
            </div>

            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3 pl-1">Operadores Activos Disponibles</p>
            
            <div className="space-y-3 max-h-[280px] overflow-y-auto pr-1 scrollbar-thin">
              {listaOperadores.length > 0 ? (
                listaOperadores.map((op) => (
                  <div 
                    key={op.id}
                    className="flex items-center justify-between p-4 bg-white border-2 border-slate-100 hover:border-[#1f4d3a] rounded-2xl transition-all group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-[#1f4d3a] text-white flex items-center justify-center font-bold text-sm uppercase">
                        {op.nombre ? op.nombre.charAt(0) : 'O'}
                      </div>
                      <div>
                        {/* Se renderizan dinámicamente las columnas recuperadas de tu tabla SQL Server */}
                        <h4 className="font-bold text-base text-[#1f4d3a] uppercase tracking-tight">{op.nombre}</h4>
                        <p className="text-xs text-slate-400 font-mono lowercase">{op.email}</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      disabled={cargandoAsignacion}
                      onClick={() => ejecutarAsignacion(op.id, op.nombre)}
                      className="bg-[#f8f5ef] hover:bg-[#1f4d3a] text-[#1f4d3a] hover:text-white px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all border border-transparent group-hover:border-[#c8a96a]/20"
                    >
                      Asignar
                    </button>
                  </div>
                ))
              ) : (
                <div className="p-6 text-center bg-amber-50/60 rounded-2xl border border-dashed border-amber-200">
                  <p className="text-xs text-[#c8a96a] font-bold uppercase">No se encontraron usuarios activos con rol_id = 2 en la base de datos</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* HEADER CORREGIDO: SE ELIMINÓ POR COMPLETO "PANEL ADMINISTRATIVO" */}
      <div className="space-y-1">
        <h1 className="text-4xl font-bold tracking-tight text-[#1f4d3a]">Dashboard</h1>
        <p className="text-sm text-slate-500 font-normal">
          Panel ejecutivo de supervisión, analítica de solicitudes y asignación de carga
        </p>
      </div>

      {/* CARDS KPI DE CONTROL */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white p-6 rounded-[2rem] border border-[#ece7dc] shadow-sm flex flex-col justify-between min-h-[145px]">
            <div className="flex justify-between items-center">
              <span className="text-xs font-semibold text-slate-400 tracking-wide">{stat.label}</span>
              <div className={`${stat.color} p-2 bg-slate-50 rounded-xl`}>{stat.icon}</div>
            </div>
            <span className={`text-5xl font-bold font-mono ${stat.color} tracking-tight mt-4`}>
              {stat.value}
            </span>
          </div>
        ))}
      </div>

      {/* LAYOUT EN COLUMNAS CRUZADAS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* PANEL IZQUIERDO: SECCIÓN DE ALERTAS */}
        <div className="lg:col-span-2 bg-white rounded-[2.5rem] border border-[#ece7dc] p-8 space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-1.5 h-6 bg-[#c8a96a] rounded-full"></div>
            <h3 className="text-[#1f4d3a] font-bold text-xl tracking-tight">
              Alertas de Operación Inmediata
            </h3>
          </div>
          
          <div className="space-y-4">
            {alertasPendientes.length > 0 ? (
              alertasPendientes.slice(0, 4).map((sol) => (
                <div key={sol.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-6 bg-[#faf8f3] rounded-[2rem] border border-[#ece7dc] gap-4 hover:border-[#c8a96a]/60 transition-all">
                  <div>
                    <p className="font-bold text-[#1f4d3a] text-lg">
                      <span className="font-mono text-[#c8a96a]">{sol.ticket || `TK-${sol.id}`}</span> — {sol.nombre}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">
                        {sol.servicio || 'Servicio General'}
                      </span>
                      <span className="text-slate-300">•</span>
                      <span className="bg-amber-50 text-[#c8a96a] text-[9px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider border border-amber-200">
                        Pendiente
                      </span>
                    </div>
                  </div>
                  
                  <button 
                    onClick={() => abrirAsignacion(sol)}
                    className="bg-[#1f4d3a] text-white px-6 py-3 rounded-[1.5rem] font-bold text-[10px] tracking-widest uppercase border border-[#c8a96a]/30 hover:bg-[#16382b] transition-all flex items-center justify-center gap-2"
                  >
                    <UserPlusIcon className="w-4 h-4" /> Asignar
                  </button>
                </div>
              ))
            ) : (
              <div className="p-12 text-center bg-[#faf8f3] rounded-[2rem] border border-dashed border-[#ece7dc]">
                <p className="text-sm text-slate-400 font-medium uppercase tracking-wider">No hay tickets críticos pendientes de asignación</p>
              </div>
            )}
          </div>
        </div>

        {/* PANEL DERECHO: DONUT CHART NATIVO */}
        <div className="bg-white rounded-[2.5rem] border border-[#ece7dc] p-8 flex flex-col justify-between space-y-8 shadow-sm">
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-1.5 h-6 bg-[#1f4d3a] rounded-full"></div>
              <h3 className="text-[#1f4d3a] font-bold text-xl tracking-tight">Distribución Total</h3>
            </div>

            <div className="relative flex justify-center items-center my-6">
              <svg width="180" height="180" viewBox="0 0 42 42" className="transform -rotate-90">
                <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#f1ece1" strokeWidth="4.2" />
                <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#94a3b8" strokeWidth="4.5" 
                  strokeDasharray={`${pctFinalizado} ${100 - pctFinalizado}`} 
                  strokeDashoffset="0" 
                />
                <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#1f4d3a" strokeWidth="4.5" 
                  strokeDasharray={`${pctRevision} ${100 - pctRevision}`} 
                  strokeDashoffset={`-${pctFinalizado}`} 
                />
                <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#c8a96a" strokeWidth="4.5" 
                  strokeDasharray={`${pctPendiente} ${100 - pctPendiente}`} 
                  strokeDashoffset={`-${pctFinalizado + pctRevision}`} 
                />
              </svg>
              
              <div className="absolute text-center">
                <span className="text-3xl font-bold font-mono text-[#1f4d3a] tracking-tighter">{totalTickets}</span>
                <p className="text-[9px] text-slate-400 uppercase tracking-widest font-semibold mt-0.5">Casos</p>
              </div>
            </div>

            <div className="space-y-3.5 mt-4">
              <div className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-[#c8a96a]"></div>
                  <span className="text-xs font-semibold text-slate-600">Pendientes de Atención</span>
                </div>
                <span className="font-mono text-sm font-bold text-[#1f4d3a]">{pctPendiente}%</span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-[#1f4d3a]"></div>
                  <span className="text-xs font-semibold text-slate-600">En Proceso / Revisión</span>
                </div>
                <span className="font-mono text-sm font-bold text-[#1f4d3a]">{pctRevision}%</span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-slate-400"></div>
                  <span className="text-xs font-semibold text-slate-600">Finalizadas / Cerradas</span>
                </div>
                <span className="font-mono text-sm font-bold text-[#1f4d3a]">{pctFinalizado}%</span>
              </div>
            </div>
          </div>
          
          <div className="p-4 border border-[#ece7dc] rounded-2xl bg-[#faf8f3]">
            <p className="text-slate-400 text-[10px] leading-relaxed font-medium uppercase tracking-wide">
              Métricas dinámicas vinculadas al motor de asignación en tiempo real.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}