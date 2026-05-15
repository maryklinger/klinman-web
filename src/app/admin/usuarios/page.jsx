'use client';
import React, { useState, useEffect } from 'react';
import toast, { Toaster } from 'react-hot-toast';

const IconX = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>;
const IconCheck = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="5"><polyline points="20 6 9 17 4 12"></polyline></svg>;
const IconUserPlus = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="8.5" cy="7" r="4"></circle><line x1="20" y1="8" x2="20" y2="14"></line><line x1="17" y1="11" x2="23" y2="11"></line></svg>;

export default function GestionAccesosKlinman() {
  const LISTA_PERMISOS = [
    { id: "ver_c", label: "VER CARTERA DE CLIENTES", cat: "SISTEMA" },
    { id: "dash", label: "ACCESO AL DASHBOARD", cat: "ESTADÍSTICAS" },
    { id: "del_r", label: "ELIMINAR REGISTROS", cat: "SEGURIDAD" },
    { id: "ch_est", label: "CAMBIAR ESTADOS", cat: "OPERACIONES" },
    { id: "conf", label: "ACCESO A CONFIGURACIÓN", cat: "SISTEMA" },
    { id: "rep", label: "ACCESO A REPORTES", cat: "ADMINISTRACIÓN" },
    { id: "fact", label: "ACCEDER A FACTURACIÓN", cat: "FINANZAS" },
    { id: "prior", label: "CAMBIAR PRIORIDAD", cat: "OPERACIONES" }
  ];

  const [usuarios, setUsuarios] = useState([]);
  const [userActivo, setUserActivo] = useState(null);
  const [modalRegistro, setModalRegistro] = useState(false);
  const [cargando, setCargando] = useState(false);

  // 1. CARGAR USUARIOS
  const obtenerUsuarios = async () => {
    try {
      const res = await fetch('/api/usuarios');
      const data = await res.json();
      const conPermisos = data.map(u => ({ ...u, permisos: [] }));
      setUsuarios(conPermisos);
      if (conPermisos.length > 0 && !userActivo) setUserActivo(conPermisos[0]);
    } catch (error) { toast.error("ERROR AL CARGAR"); }
  };

  useEffect(() => { obtenerUsuarios(); }, []);

  // 2. CREAR USUARIO (CONEXIÓN SQL)
  const handleCrearUsuario = async (e) => {
    e.preventDefault();
    setCargando(true);
    const form = e.target;

    const data = {
      nombre: form.nombre.value.toUpperCase(),
      email: form.email.value.toUpperCase(),
      rol_id: parseInt(form.rol_id.value),
      password_hash: "KLINMAN_2026"
    };

    try {
      const res = await fetch('/api/usuarios', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const result = await res.json();

      if (result.success) {
        toast.success("USUARIO REGISTRADO");
        setModalRegistro(false);
        obtenerUsuarios();
        form.reset();
      } else {
        toast.error(result.error);
      }
    } catch (error) {
      toast.error("ERROR DE CONEXIÓN");
    } finally {
      setCargando(false);
    }
  };

  // 3. TOGGLE ESTADO (ACTIVO/INACTIVO)
  const toggleEstado = () => {
    if (!userActivo) return;
    const nuevos = usuarios.map(u => {
      if (u.id === userActivo.id) {
        const actualizado = { ...u, estado: u.estado === 1 ? 0 : 1 };
        setUserActivo(actualizado);
        return actualizado;
      }
      return u;
    });
    setUsuarios(nuevos);
    toast.success("ESTADO ACTUALIZADO");
  };

  // 4. TOGGLE PERMISOS
  const togglePermiso = (permisoId) => {
    const nuevos = usuarios.map(u => {
      if (u.id === userActivo?.id) {
        const tiene = u.permisos.includes(permisoId);
        const actualizado = { ...u, permisos: tiene ? u.permisos.filter(p => p !== permisoId) : [...u.permisos, permisoId] };
        setUserActivo(actualizado);
        return actualizado;
      }
      return u;
    });
    setUsuarios(nuevos);
  };

  return (
    <div className="p-8 md:p-14 bg-[#f8f5ef] min-h-screen font-sans text-[#1f4d3a] select-none">
      <Toaster position="top-right" />

      {/* MODAL REGISTRO RE-INTEGRADO */}
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
                {cargando ? "PROCESANDO..." : "REGISTRAR EN SQL"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-end gap-8 mb-16">
        <h1 className="text-[72px] font-black tracking-[-0.06em] leading-[0.8] uppercase">EQUIPO Y <br/> <span className="text-[#c8a96a]">ACCESOS</span></h1>
        <button onClick={() => setModalRegistro(true)} className="bg-[#1f4d3a] text-white px-10 py-5 rounded-[2.5rem] text-[10px] font-black uppercase tracking-[0.3em] border border-[#c8a96a] flex items-center gap-4"><IconUserPlus /> AGREGAR</button>
      </div>

      <div className="grid grid-cols-12 gap-10">
        {/* LISTA IZQUIERDA */}
        <div className="col-span-12 lg:col-span-4 space-y-4">
          {usuarios.map((u) => (
            <div key={u.id} onClick={() => setUserActivo(u)} className={`p-6 rounded-[2.5rem] border transition-all cursor-pointer flex items-center justify-between ${userActivo?.id === u.id ? 'bg-white border-[#c8a96a] shadow-xl scale-105' : 'bg-white/40 border-transparent opacity-50'}`}>
              <div className="flex items-center gap-5">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white font-black ${u.estado === 1 ? 'bg-[#1f4d3a]' : 'bg-red-900'}`}>{u.nombre.charAt(0)}</div>
                <div>
                  <h3 className="text-lg font-black uppercase tracking-tighter">{u.nombre}</h3>
                  <span className={`text-[7px] font-black uppercase p-1 rounded ${u.estado === 1 ? 'text-[#c8a96a]' : 'text-red-500'}`}>{u.estado === 1 ? 'ACTIVO' : 'INACTIVO'}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* PANEL DERECHA */}
        <div className="col-span-12 lg:col-span-8">
          {userActivo && (
            <div className="bg-white p-12 rounded-[4rem] shadow-2xl border border-[#ece7dc]">
              {/* BOTÓN TOGGLE ESTADO */}
              <div className="flex justify-between items-start mb-10">
                <div className="text-left">
                  <p className="text-[9px] font-black text-gray-400 tracking-[0.3em] uppercase">COLABORADOR</p>
                  <h2 className="text-4xl font-black uppercase tracking-tighter">{userActivo.nombre}</h2>
                </div>
                <button 
                  onClick={toggleEstado}
                  className={`px-8 py-4 rounded-full font-black text-[9px] uppercase tracking-widest transition-all ${userActivo.estado === 1 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}
                >
                  {userActivo.estado === 1 ? '● CUENTA ACTIVA' : '○ CUENTA INACTIVA'}
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {LISTA_PERMISOS.map((p) => {
                  const tiene = userActivo.permisos.includes(p.id);
                  return (
                    <div key={p.id} onClick={() => togglePermiso(p.id)} className={`flex justify-between items-center p-5 rounded-[1.5rem] border-2 cursor-pointer transition-all ${tiene ? 'bg-[#f8f5ef] border-[#1f4d3a]' : 'bg-white border-gray-50 opacity-40'}`}>
                      <div className="flex flex-col"><span className="text-[10px] font-black uppercase">{p.label}</span><span className="text-[7px] font-bold text-[#c8a96a] uppercase">{p.cat}</span></div>
                      <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${tiene ? 'bg-[#1f4d3a] text-white' : 'bg-gray-100 text-transparent'}`}><IconCheck /></div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}