'use client';
import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

// Importamos las acciones desde la ruta relativa correcta (un nivel arriba)
import { 
  crearUsuarioAction, 
  actualizarUsuarioAction, 
  cambiarEstadoUsuarioAction 
} from '../actions';

// Iconos vectoriales limpios
const IconX = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>;
const IconCheck = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="5"><polyline points="20 6 9 17 4 12"></polyline></svg>;
const IconUserPlus = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="8.5" cy="7" r="4"></circle><line x1="20" y1="8" x2="20" y2="14"></line><line x1="17" y1="11" x2="23" y2="11"></line></svg>;
const IconTrash = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>;
const IconAlert = () => <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#c8a96a" strokeWidth="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>;
const IconSave = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path><polyline points="17 21 17 13 7 13 7 21"></polyline><polyline points="7 3 7 8 15 8"></polyline></svg>;

export default function GestionAccesosKlinman() {
  
  // NOMBRES DE PERMISOS ALINEADOS AL MILÍMETRO CON LOS IDs DEL SIDEBAR Y LAS CLAVES DE BD
  const LISTA_PERMISOS = [
    { id: "dashboard", label: "ACCESO AL DASHBOARD", cat: "SISTEMA" },
    { id: "solicitudes", label: "ACCESO A SOLICITUDES", cat: "SISTEMA" },
    { id: "clientes", label: "ACCESO A CLIENTES", cat: "SISTEMA" },
    { id: "reportes", label: "ACCESO A REPORTES", cat: "SISTEMA" },
    { id: "configuracion", label: "ACCESO A CONFIGURAR", cat: "SISTEMA" },
    { id: "cambiar_prioridad", label: "CAMBIAR PRIORIDAD", cat: "OPERACIONES" },
    { id: "cambiar_estado", label: "CAMBIAR ESTADO", cat: "OPERACIONES" },
    { id: "modificar_permisos", label: "MODIFICAR PERMISOS USUARIOS", cat: "SEGURIDAD" },
    { id: "descargar_reportes", label: "DESCARGAR REPORTES", cat: "ADMINISTRACIÓN" }
  ];

  const obtenerNombreRol = (rolId) => {
    const roles = { 1: "ADMINISTRADOR", 2: "OPERADOR", 3: "SUPERVISOR" };
    return roles[rolId] || "SIN ROL";
  };

  // Estados locales
  const [usuarios, setUsuarios] = useState([]);
  const [userActivo, setUserActivo] = useState(null);
  const [modalRegistro, setModalRegistro] = useState(false);
  const [modalBaja, setModalBaja] = useState(false);
  const [cargando, setCargando] = useState(false);

  // Estados de los campos del formulario de edición
  const [editNombre, setEditNombre] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editRol, setEditRol] = useState(2);

  // Carga inicial de usuarios
  const obtenerUsuarios = async () => {
    try {
      const res = await fetch('/api/usuarios'); 
      if (!res.ok) throw new Error("No API Route");
      const data = await res.json();
      
      const listaSaneada = data.map(u => ({ 
        ...u, 
        estado: (u.estado === true || u.estado === 1 || u.estado === '1') ? 1 : 0, 
        permisos: u.permisos || [] 
      }));
      setUsuarios(listaSaneada);
      
      const activos = listaSaneada.filter(u => u.estado === 1);
      if (activos.length > 0 && !userActivo) {
        seleccionarUsuario(activos[0]);
      }
    } catch (error) { 
      const mockInicial = [
        { id: 1, nombre: "BRAD PITT", email: "NOINFORMA@NOINFORMA.CL", rol_id: 1, estado: 1, permisos: ["dashboard", "solicitudes"] },
        { id: 2, nombre: "VANESSA KG", email: "VANESSAKG34@ICLOUD.COM", rol_id: 2, estado: 1, permisos: ["solicitudes"] }
      ];
      setUsuarios(mockInicial);
      if (!userActivo) seleccionarUsuario(mockInicial[0]);
    }
  };

  useEffect(() => {
    obtenerUsuarios();
  }, []);

  const seleccionarUsuario = (u) => {
    setUserActivo(u);
    if (u) {
      setEditNombre(u.nombre || "");
      setEditEmail(u.email || "");
      setEditRol(u.rol_id || 2);
    }
  };

  // Enviar y crear nuevo usuario
  const handleCrearUsuario = async (e) => {
    e.preventDefault();
    if (cargando) return;
    setCargando(true);

    const form = e.target;
    const datosNuevos = {
      nombre: form.nombre.value.toUpperCase().trim(),
      email: form.email.value.toUpperCase().trim(),
      rol_id: parseInt(form.rol_id.value)
    };

    const res = await crearUsuarioAction(datosNuevos);

    if (res.success) {
      toast.success("USUARIO REGISTRADO CON ÉXITO");
      setModalRegistro(false);
      form.reset();
      await obtenerUsuarios(); 
    } else {
      toast.error(res.error || "ERROR AL REGISTRAR EL USUARIO");
    }
    setCargando(false);
  };

  // MODIFICADO: GUARDAR CAMBIOS DE DATOS Y MATRIZ DE PERMISOS RELACIONAL A LA VEZ
  const handleGuardarCambiosDatos = async (e) => {
    if (e) { e.preventDefault(); e.stopPropagation(); }
    if (!userActivo || cargando) return;
    
    setCargando(true);

    const datosModificados = {
      nombre: editNombre.toUpperCase().trim(),
      email: editEmail.toUpperCase().trim(),
      rol_id: parseInt(editRol)
    };

    // 1. Guardamos las propiedades básicas del usuario (Nombre, Email, Rol) via Server Action
    const resUsuario = await actualizarUsuarioAction(parseInt(userActivo.id), datosModificados);

    if (resUsuario.success) {
      try {
        // 2. Guardamos de forma relacional el rol y sus checkboxes marcados en 'rol_permisos'
        const resPermisos = await fetch('/api/roles/permisos', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            usuario_id: parseInt(userActivo.id),
            permisos_marcados: userActivo.permisos || [] // Pasamos las claves que están marcadas en la pantalla
          })
        });

        const dataPermisos = await resPermisos.json();

        if (dataPermisos.success) {
          toast.success("DATOS Y MATRIZ RELACIONAL GUARDADOS");
          const usuarioActualizado = { ...userActivo, ...datosModificados };
          setUsuarios(usuarios.map(u => u.id === userActivo.id ? usuarioActualizado : u));
          setUserActivo(usuarioActualizado);
        } else {
          toast.error("Datos guardados, pero hubo un error en la matriz de permisos");
        }
      } catch (err) {
        console.error("Error guardando permisos:", err);
        toast.error("Fallo de conexión al actualizar la matriz");
      }
    } else {
      toast.error(resUsuario.error || "NO SE HAN GUARDADO LOS CAMBIOS");
    }
    setCargando(false);
  };

  // Cambiar estado de cuenta
  const toggleEstado = async (e) => {
    if (e) { e.preventDefault(); e.stopPropagation(); }
    if (!userActivo || cargando) return;

    setCargando(true);
    const proximoEstadoBit = userActivo.estado === 1 ? 0 : 1;
    
    const res = await cambiarEstadoUsuarioAction(parseInt(userActivo.id), proximoEstadoBit);
    
    if (res.success) {
      toast.success("ESTADO ACTUALIZADO CORRECTAMENTE");
      await obtenerUsuarios();
    } else {
      toast.error("NO SE PUDO MODIFICAR EL ESTADO");
    }
    setCargando(false);
  };

  // Confirmar baja lógica
  const confirmarBajaLogica = async (e) => {
    if (e) { e.preventDefault(); e.stopPropagation(); }
    if (!userActivo || cargando) return;

    setCargando(true);
    const res = await cambiarEstadoUsuarioAction(parseInt(userActivo.id), 0); 
    
    if (res.success) {
      toast.success("COLABORADOR DADO DE BAJA");
      setModalBaja(false);
      setUserActivo(null);
      await obtenerUsuarios();
    } else {
      toast.error("ERROR DAR DE BAJA");
    }
    setCargando(false);
  };

  // Cambiar estado visual de un checkbox localmente antes de guardar
  const togglePermiso = (permisoId) => {
    if (!userActivo) return;
    const tiene = userActivo.permisos?.includes(permisoId);
    const nuevosPermisos = tiene 
      ? userActivo.permisos.filter(p => p !== permisoId) 
      : [...(userActivo.permisos || []), permisoId];

    const usuarioActualizado = { ...userActivo, permisos: nuevosPermisos };
    setUsuarios(usuarios.map(u => u.id === userActivo.id ? usuarioActualizado : u));
    setUserActivo(usuarioActualizado);
  };

  const usuariosVisibles = usuarios.filter(u => u.estado === 1);

  return (
    <div className="p-8 md:p-14 bg-[#f8f5ef] min-h-screen font-sans antialiased text-[#1f4d3a] select-none">
      
      {/* MODAL REGISTRO */}
      {modalRegistro && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-[#1f4d3a]/90 backdrop-blur-md">
          <form onSubmit={handleCrearUsuario} className="bg-white w-full max-w-xl rounded-[4rem] p-14 shadow-2xl border border-[#c8a96a]/30">
            <div className="flex justify-between items-center mb-10">
              <h2 className="text-4xl font-black uppercase tracking-tighter">NUEVO INGRESO</h2>
              <button type="button" onClick={() => setModalRegistro(false)} className="text-gray-300 hover:text-red-500"><IconX /></button>
            </div>
            <div className="space-y-4">
              <input name="nombre" required placeholder="NOMBRE COMPLETO" className="w-full bg-[#f8f5ef] p-6 rounded-[2rem] outline-none font-black uppercase text-xs border-2 border-transparent focus:border-[#c8a96a]" />
              <input name="email" required type="email" placeholder="EMAIL CORPORATIVO" className="w-full bg-[#f8f5ef] p-6 rounded-[2rem] outline-none font-black uppercase text-xs border-2 border-transparent focus:border-[#c8a96a]" />
              <select name="rol_id" className="w-full bg-[#f8f5ef] p-6 rounded-[2rem] outline-none font-black uppercase text-xs border-2 border-transparent focus:border-[#c8a96a] appearance-none">
                 <option value="1">ADMINISTRADOR</option>
                 <option value="2">OPERADOR</option>
                 <option value="3">SUPERVISOR</option>
              </select>
              <button disabled={cargando} type="submit" className="w-full bg-[#1f4d3a] text-white py-6 rounded-[2.5rem] font-black text-[10px] uppercase tracking-[0.4em] mt-4">
                {cargando ? "PROCESANDO..." : "REGISTRAR USUARIO"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* MODAL ELIMINACIÓN */}
      {modalBaja && userActivo && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-6 bg-[#1f4d3a]/95 backdrop-blur-md">
          <div className="bg-white w-full max-w-lg rounded-[3.5rem] p-12 shadow-2xl text-center">
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-[#f8f5ef] rounded-full flex items-center justify-center">
                <IconAlert />
              </div>
            </div>
            <h3 className="text-2xl font-black tracking-tighter uppercase mb-4 text-[#1f4d3a]">CONFIRMAR BAJA DE USUARIO</h3>
            <p className="text-xs font-medium text-gray-500 leading-relaxed max-w-sm mx-auto mb-10 uppercase">
              ¿Está seguro de dar de baja al usuario? <span className="font-black text-[#1f4d3a] block my-1 text-sm">{userActivo.nombre}</span>Se eliminará del panel de usuarios.
            </p>
            <div className="grid grid-cols-2 gap-4">
              <button type="button" onClick={() => setModalBaja(false)} className="bg-[#f8f5ef] text-[#1f4d3a] py-5 rounded-[2rem] font-black text-[10px] uppercase tracking-[0.2em]">CANCELAR</button>
              <button type="button" disabled={cargando} onClick={confirmarBajaLogica} className="bg-red-700 text-white py-5 rounded-[2rem] font-black text-[10px] uppercase tracking-[0.2em]">
                {cargando ? "ELIMINANDO..." : "SÍ, DAR DE BAJA"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* HEADER PRINCIPAL */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-6 mb-12">
        <div className="space-y-1">
          <h1 className="text-4xl font-bold text-[#1f4d3a] tracking-tight">
            Usuarios
          </h1>
          <p className="text-sm text-slate-500 font-normal">
            Gestión de usuarios y permisos
          </p>
        </div>
        <button 
          onClick={() => setModalRegistro(true)} 
          className="bg-[#1f4d3a] text-white px-8 py-3.5 rounded-[2.5rem] text-[10px] font-black uppercase tracking-[0.3em] flex items-center gap-3 border border-[#c8a96a]/20 hover:bg-[#16382b] transition-all self-start sm:self-auto shadow-sm"
        >
          <IconUserPlus /> AGREGAR
        </button>
      </div>

      <div className="grid grid-cols-12 gap-10">
        {/* PANEL IZQUIERDO */}
        <div className="col-span-12 lg:col-span-4 space-y-4">
          {usuariosVisibles.map((u) => (
            <div key={u.id} onClick={() => seleccionarUsuario(u)} className={`p-6 rounded-[2.5rem] border transition-all cursor-pointer flex items-center justify-between ${userActivo?.id === u.id ? 'bg-white border-[#c8a96a] shadow-xl scale-105' : 'bg-white/40 border-transparent opacity-60'}`}>
              <div className="flex items-center gap-5">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-black bg-[#1f4d3a]">{u.nombre?.charAt(0) || "U"}</div>
                <div>
                  <h3 className="text-lg font-black uppercase tracking-tighter">{u.nombre}</h3>
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[9px] font-black text-[#c8a96a] tracking-wider">{obtenerNombreRol(u.rol_id)}</span>
                    <span className="text-[7px] font-black font-mono text-green-600">● ACTIVO</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
          {usuariosVisibles.length === 0 && (
            <p className="text-xs font-black uppercase text-gray-400 text-center pt-8">No hay colaboradores activos</p>
          )}
        </div>

        {/* PANEL DERECHO */}
        <div className="col-span-12 lg:col-span-8">
          {userActivo && (
            <div className="bg-white p-12 rounded-[4rem] shadow-2xl border border-[#ece7dc] space-y-10">
              <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-4">
                <div className="text-left">
                  <p className="text-[9px] font-black text-gray-400 tracking-[0.3em] uppercase">MODO EDICIÓN DE CREDENCIALES</p>
                  <h2 className="text-4xl font-black uppercase tracking-tighter">{userActivo.nombre}</h2>
                  <p className="text-xs font-mono text-gray-400 lowercase">{userActivo.email}</p>
                </div>
                <div className="flex items-center gap-2 self-start">
                  <button type="button" onClick={() => setModalBaja(true)} className="p-4 rounded-full bg-red-50 text-red-600 hover:bg-red-100 transition-colors"><IconTrash /></button>
                  <button type="button" onClick={toggleEstado} disabled={cargando} className="px-8 py-4 rounded-full font-black text-[9px] uppercase tracking-widest transition-all font-mono bg-green-100 text-green-700">
                    ● CUENTA ACTIVA
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex flex-col gap-2">
                  <label className="text-[9px] font-black tracking-wider text-gray-400 uppercase pl-2">Nombre Colaborador</label>
                  <input type="text" value={editNombre} onChange={(e) => setEditNombre(e.target.value)} className="bg-[#f8f5ef] p-5 rounded-[1.5rem] outline-none font-black text-xs uppercase text-[#1f4d3a] border-2 border-transparent focus:border-[#c8a96a]" />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-[9px] font-black tracking-wider text-gray-400 uppercase pl-2">Correo Corporativo</label>
                  <input type="text" value={editEmail} onChange={(e) => setEditEmail(e.target.value)} className="bg-[#f8f5ef] p-5 rounded-[1.5rem] outline-none font-black text-xs uppercase text-[#1f4d3a] border-2 border-transparent focus:border-[#c8a96a]" />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-[9px] font-black tracking-wider text-gray-400 uppercase pl-2">Rol Asignado</label>
                  <select value={editRol} onChange={(e) => setEditRol(parseInt(e.target.value))} className="bg-[#f8f5ef] p-5 rounded-[1.5rem] outline-none font-black text-xs uppercase text-[#1f4d3a] border-2 border-transparent focus:border-[#c8a96a] appearance-none">
                    <option value="1">ADMINISTRADOR</option>
                    <option value="2">OPERADOR</option>
                    <option value="3">SUPERVISOR</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end">
                <button type="button" onClick={handleGuardarCambiosDatos} disabled={cargando} className="bg-[#1f4d3a] text-white px-8 py-4 rounded-[2rem] font-black text-[10px] tracking-[0.2em] uppercase flex items-center gap-3 border border-[#c8a96a] shadow-md">
                  <IconSave /> {cargando ? "GUARDANDO..." : "GUARDAR CAMBIOS"}
                </button>
              </div>

              {/* SECCIÓN INFERIOR: MATRIZ DE PERMISOS ACTUALIZADA */}
              <div className="space-y-4 pt-4 border-t border-gray-100">
                <p className="text-[9px] font-black text-gray-400 tracking-[0.3em] uppercase">MATRIZ DE PERMISOS COMPLEMENTARIOS</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {LISTA_PERMISOS.map((p) => {
                    const tiene = userActivo.permisos?.includes(p.id);
                    return (
                      <div key={p.id} onClick={() => togglePermiso(p.id)} className={`flex justify-between items-center p-5 rounded-[1.5rem] border-2 cursor-pointer transition-all ${tiene ? 'bg-[#f8f5ef] border-[#1f4d3a]' : 'bg-white border-gray-50 opacity-40'}`}>
                        <div className="flex flex-col">
                          <span className="text-[10px] font-black uppercase">{p.label}</span>
                          <span className="text-[7px] font-bold text-[#c8a96a] uppercase tracking-wider">{p.cat}</span>
                        </div>
                        <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${tiene ? 'bg-[#1f4d3a] text-white' : 'bg-gray-100 text-transparent'}`}><IconCheck /></div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
          {!userActivo && usuariosVisibles.length > 0 && (
            <p className="text-xs font-black uppercase text-gray-400 text-center pt-24">Selecciona un colaborador para editar sus credenciales</p>
          )}
        </div>
      </div>
    </div>
  );
}