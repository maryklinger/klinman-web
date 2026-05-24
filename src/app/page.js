'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import toast, { Toaster } from 'react-hot-toast';
import { UserIcon, ChevronDownIcon, ArrowRightOnRectangleIcon, ComputerDesktopIcon } from "@heroicons/react/24/outline";

export default function Home() {
  const [ticketCreado, setTicketCreado] = useState(null);
  const [loading, setLoading] = useState(false);
  
  // ESTADO NUEVO: Control interactivo y animado del menú desplegable
  const [menuAbierto, setMenuAbierto] = useState(false);
  const menuRef = useRef(null);

  // Cerrar el menú si se hace clic fuera de él (Mejora de UX)
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuAbierto(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    toast.dismiss();
    setLoading(true);

    const form = e.target;
    const data = {
      nombre: form.nombre.value,
      empresa: form.empresa.value,
      telefono: form.telefono.value,
      email: form.email.value,
      servicio: form.servicio.value,
      mensaje: form.mensaje.value || "",
    };

    try {
      const res = await fetch('/api/contacto', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (result.success) {
        setTicketCreado(result.codigo_ticket);
        
        toast.success(
          `SOLICITUD REGISTRADA BAJO EL TICKET ${result.codigo_ticket}`,
          {
            duration: 6000,
            style: {
              background: '#1f4d3a',
              color: '#ffffff',
              border: '1px solid #c8a96a',
              padding: '20px',
              borderRadius: '24px',
              fontWeight: '900',
              fontSize: '11px',
              letterSpacing: '0.1em'
            },
          }
        );
        form.reset();
      } else {
        toast.error(
          (result.error || "NO FUE POSIBLE PROCESAR LA SOLICITUD.").toUpperCase(),
          {
            duration: 5000,
            style: {
              background: '#7f1d1d',
              color: '#ffffff',
              border: '1px solid #ef4444',
              padding: '20px',
              borderRadius: '24px',
              fontWeight: '900',
              fontSize: '11px',
              letterSpacing: '0.1em'
            },
          }
        );
      }
    } catch (error) {
      console.error(error);
      toast.error(
        "ERROR DE CONEXIÓN CON EL SERVIDOR. INTENTE NUEVAMENTE.",
        {
          duration: 5000,
          style: {
            background: '#7f1d1d',
            color: '#ffffff',
            border: '1px solid #ef4444',
            padding: '20px',
            borderRadius: '24px',
            fontWeight: '900',
            fontSize: '11px',
            letterSpacing: '0.1em'
          },
        }
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="bg-white text-[#1f4d3a] font-sans antialiased selection:bg-[#1f4d3a] selection:text-white">

      <Toaster position="top-right" />

      {/* NAVBAR */}
      <nav className="flex items-center justify-between px-10 py-8 bg-white border-b border-[#f1ede4] sticky top-0 z-50">
        <a href="#inicio" className="flex items-center gap-4 group">
          <div className="w-10 h-10 rounded-full overflow-hidden border border-[#ece7dc]">
            <img src="/klinman_logo.png" alt="logo" className="w-full h-full object-cover" />
          </div>
          <h1 className="text-xl font-black tracking-[0.3em] text-[#1f4d3a] group-hover:text-[#c8a96a] transition-colors">
            KLINMAN
          </h1>
        </a>

        <ul className="hidden md:flex gap-10 text-[11px] font-black tracking-[0.25em] text-gray-400">
          {[{ name: "INICIO", id: "inicio" }, { name: "SERVICIOS", id: "servicios" }, { name: "NOSOTROS", id: "nosotros" }, { name: "VALORES", id: "valores" }].map((item) => (
            <li key={item.id}>
              <a href={`#${item.id}`} className="relative group hover:text-[#1f4d3a] transition-colors py-2">
                {item.name}
                <span className="absolute left-0 -bottom-1 w-0 h-[3px] bg-[#c8a96a] transition-all duration-300 group-hover:w-full"></span>
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-4">
          
          {/* MENÚ DESPLEGABLE PREMIUM OPTIMIZADO */}
          <div className="relative" ref={menuRef}>
            <button 
              onClick={() => setMenuAbierto(!menuAbierto)}
              className={`px-4 py-3.5 border-2 rounded-2xl transition-all flex items-center gap-2 font-black text-[10px] tracking-widest uppercase ${
                menuAbierto 
                  ? 'border-[#1f4d3a] bg-[#faf8f3] text-[#c8a96a]' 
                  : 'border-[#ece7dc] text-[#1f4d3a] hover:border-[#1f4d3a] hover:bg-[#faf8f3]'
              }`}
            >
              <UserIcon className="w-4 h-4" />
              <span>Accesos</span>
              <ChevronDownIcon className={`w-3 h-3 transition-transform duration-300 ${menuAbierto ? 'rotate-180 text-[#c8a96a]' : 'text-[#1f4d3a]'}`} />
            </button>
            
            {/* Contenedor Animado con Estética Klinman */}
            <div className={`absolute right-0 mt-3 w-64 bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border border-[#1f4d3a]/10 z-[60] overflow-hidden transition-all duration-300 origin-top-right ${
              menuAbierto 
                ? 'opacity-100 scale-100 translate-y-0 pointer-events-auto' 
                : 'opacity-0 scale-95 -translate-y-2 pointer-events-none'
            }`}>
              <div className="bg-[#f8f5ef] px-5 py-3 border-b border-[#ece7dc]">
                <p className="text-[9px] font-black tracking-widest text-[#1f4d3a]/60 uppercase">Portales del Sistema</p>
              </div>

              <Link 
                href="/admin/login" 
                onClick={() => setMenuAbierto(false)}
                className="flex items-center gap-3 px-5 py-4 text-[#1f4d3a] hover:bg-[#f8f5ef] font-black text-[10px] uppercase tracking-widest border-b border-[#f1ede4]/60 transition-colors group"
              >
                <ArrowRightOnRectangleIcon className="w-4 h-4 text-gray-400 group-hover:text-[#c8a96a] transition-colors" />
                <span className="group-hover:text-[#c8a96a] transition-colors">Colaboradores</span>
              </Link>

              {/* RUTA RECORREGIDA: Apuntando exactamente a /portalClientes */}
              <Link 
                href="/portalClientes" 
                onClick={() => setMenuAbierto(false)}
                className="flex items-center gap-3 px-5 py-4 text-[#1f4d3a] hover:bg-[#f8f5ef] font-black text-[10px] uppercase tracking-widest transition-colors group"
              >
                <ComputerDesktopIcon className="w-4 h-4 text-gray-400 group-hover:text-[#1f4d3a] transition-colors" />
                <span className="group-hover:underline decoration-[#c8a96a] decoration-2">Portal Clientes</span>
              </Link>
              
              <div className="h-1 bg-gradient-to-r from-[#1f4d3a] via-[#c8a96a] to-[#1f4d3a]"></div>
            </div>
          </div>

          <a href="#contacto">
            <button className="bg-[#1f4d3a] text-white px-8 py-3.5 rounded-2xl text-[10px] font-black tracking-[0.2em] border border-[#c8a96a] hover:bg-[#c8a96a] transition-all shadow-lg shadow-[#1f4d3a]/10">
              CONTACTO
            </button>
          </a>
        </div>
      </nav>

      {/* HERO DE IMPACTO */}
      <section id="inicio" className="relative w-full h-[650px] flex items-center justify-center overflow-hidden">
        <img src="/fondo_covert.jpg" className="absolute w-full h-full object-cover" alt="Klinman Cover" />
        <div className="absolute w-full h-full bg-gradient-to-b from-black/70 via-black/45 to-black/60 backdrop-blur-[1px]"></div>
        <div className="relative z-10 flex flex-col items-center justify-center text-center text-white px-6 max-w-5xl mx-auto">
          <h1 className="text-4xl md:text-[64px] font-black tracking-[-0.05em] leading-[0.95] uppercase" style={{ textShadow: '0px 4px 12px rgba(0, 0, 0, 0.7)' }}>
            Tres décadas elevando el <br/>
            <span className="text-[#c8a96a]">estándar de limpieza</span>
          </h1>
          <p className="mt-8 text-[12px] font-black tracking-[0.4em] text-gray-200 uppercase" style={{ textShadow: '0px 2px 8px rgba(0, 0, 0, 0.8)' }}>
            Cuidamos sus espacios como activos de valor estratégico
          </p>
          <a href="#contacto" className="mt-12">
            <button className="bg-transparent text-white px-10 py-5 rounded-[2rem] text-[11px] font-black tracking-[0.3em] uppercase border-2 border-white/40 hover:border-white hover:bg-white hover:text-[#1f4d3a] transition-all shadow-xl">
              SOLICITAR ASESORÍA
            </button>
          </a>
        </div>
      </section>

      {/* SECCIÓN SERVICIOS */}
      <section id="servicios" className="py-32 px-8 bg-[#f8f5ef]">
        <div className="max-w-7xl mx-auto">
          <div className="mb-20 text-center md:text-left">
            <h2 className="text-4xl font-black text-[#1f4d3a] tracking-[-0.04em] uppercase">SERVICIOS DE CARTERA</h2>
            <p className="text-gray-400 font-black uppercase text-[11px] tracking-[0.3em] mt-3">Soluciones técnicas de precisión operativa</p>
          </div>
          <div className="grid lg:grid-cols-3 gap-12">
            {[
              { titulo: "Limpieza Corporativa", desc: "Espacios corporativos impecables gobernados bajo rigurosos estándares profesionales.", img: "/limpieza_corporativa.jpg" },
              { titulo: "Mantenimiento Técnico", desc: "Tratamientos especializados y conservación de superficies e infraestructura de alto tráfico.", img: "/mantenimiento_Tecnico.jpg" },
              { titulo: "Servicios Especializados", desc: "Soluciones a la medida de los requerimientos logísticos y operativos de cada cliente.", img: "/servicios_especializados.jpg" }
            ].map((s, i) => (
              <div key={i} className="group border border-[#ece7dc] rounded-[3.5rem] overflow-hidden bg-white hover:border-[#1f4d3a] hover:shadow-xl transition-all duration-500">
                <div className="h-[280px] overflow-hidden relative">
                  <img src={s.img} alt={s.titulo} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  <div className="absolute top-6 left-6 w-12 h-12 bg-white/90 backdrop-blur-md rounded-2xl flex items-center justify-center text-[#c8a96a] font-mono font-black text-xs border border-[#ece7dc]">
                    {(i + 1).toString().padStart(2, '0')}
                  </div>
                </div>
                <div className="p-10">
                  <h3 className="text-2xl font-black uppercase tracking-tighter text-[#1f4d3a] mb-4">{s.titulo}</h3>
                  <p className="text-gray-500 text-[13px] font-medium leading-relaxed mb-8">{s.desc}</p>
                  <a href="#contacto">
                    <button className="text-[10px] font-black uppercase tracking-[0.2em] px-6 py-3 bg-[#f8f5ef] text-[#1f4d3a] rounded-xl border border-[#ece7dc] hover:bg-[#1f4d3a] hover:text-white transition-all">
                      Solicitar Asesoría →
                    </button>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECCIÓN NOSOTROS */}
      <section id="nosotros" className="py-32 px-8 text-center max-w-4xl mx-auto border-b border-[#f1ede4]">
        <h2 className="text-4xl font-black uppercase tracking-[-0.04em] mb-8">NOSOTROS</h2>
        <p className="text-xl md:text-2xl font-light text-[#1f4d3a]/80 leading-relaxed tracking-tight">
          Klinman opera como un <span className="font-black text-[#1f4d3a]">socio estratégico</span> integrado en los esquemas de mantenimiento corporativo y limpieza de alta complejidad técnica en el país.
        </p>
      </section>

      {/* SECCIÓN VALORES */}
      <section id="valores" className="py-32 px-8 bg-white text-center">
        <h2 className="text-4xl font-black uppercase tracking-[-0.04em] mb-4">VALORES CORPORATIVOS</h2>
        <p className="text-gray-400 font-black uppercase text-[10px] tracking-[0.3em] mb-20">Pilares fundamentales de ejecución</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-5xl mx-auto">
          {[
            { nombre: "EXPERIENCIA", icon: <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg> },
            { nombre: "COMPROMISO", icon: <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /></svg> },
            { nombre: "SINERGIA", icon: <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 2a5 5 0 0 0-5 5v3a5 5 0 0 0 10 0V7a5 5 0 0 0-5-5z" /></svg> },
            { nombre: "RESPETO", icon: <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg> }
          ].map((v, i) => (
            <div key={i} className="group p-10 rounded-[3rem] bg-[#f8f5ef] border border-[#ece7dc] flex flex-col items-center justify-center gap-6 hover:bg-[#1f4d3a] hover:border-[#1f4d3a] transition-all duration-500 ease-out hover:-translate-y-1">
              <div className="text-[#c8a96a] group-hover:text-white transition-colors duration-300 transform group-hover:scale-110">{v.icon}</div>
              <span className="font-black text-xs tracking-[0.25em] text-[#1f4d3a] group-hover:text-white transition-colors duration-300">{v.nombre}</span>
            </div>
          ))}
        </div>
      </section>

      {/* FORMULARIO DE CONTACTO INTEGRADOR */}
      <section id="contacto" className="py-32 px-8 bg-[#f8f5ef] border-t border-[#ece7dc]">
        <div className="max-w-4xl mx-auto bg-white rounded-[4rem] border border-[#ece7dc] p-12 md:p-16 shadow-sm">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-black uppercase tracking-tighter text-[#1f4d3a]">FORMULARIO DE CONTACTO</h2>
            <p className="text-gray-400 font-black uppercase text-[10px] tracking-[0.3em] mt-3">Inicie el alta operaria de sus activos</p>
          </div>

          {ticketCreado ? (
            <div className="p-8 bg-[#f8f5ef] border-2 border-dashed border-[#c8a96a] rounded-[2.5rem] text-center max-w-2xl mx-auto py-12 transition-all">
              <div className="w-16 h-16 bg-[#1f4d3a] text-white rounded-full flex items-center justify-center mx-auto text-xl font-black mb-4">✓</div>
              <h3 className="text-2xl font-black text-[#1f4d3a] uppercase tracking-wide mb-2">¡Solicitud Registrada!</h3>
              <p className="text-gray-500 font-medium text-sm mb-6">
                Tu requerimiento ha sido procesado de manera exitosa bajo el identificador de seguimiento:
              </p>
              <div className="inline-block bg-[#1f4d3a] text-white px-8 py-4 rounded-2xl font-mono font-black text-xl tracking-widest border border-[#c8a96a] shadow-md mb-6">
                {ticketCreado}
              </div>
              <p className="text-gray-400 text-xs font-bold uppercase tracking-wider block mb-4">
                Hemos enviado un correo automatizado de respaldo.
              </p>
              <button 
                onClick={() => setTicketCreado(null)}
                className="text-xs font-black text-[#c8a96a] hover:text-[#1f4d3a] uppercase tracking-widest underline transition-colors"
              >
                Ingresar un nuevo requerimiento
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <input
                  name="nombre"
                  type="text"
                  placeholder="NOMBRE COMPLETO"
                  className="w-full bg-[#f8f5ef] border border-transparent focus:border-[#c8a96a] p-5 rounded-2xl outline-none font-black uppercase text-xs tracking-wider text-[#1f4d3a] transition-all"
                  required
                />
                <input
                  name="empresa"
                  type="text"
                  placeholder="EMPRESA"
                  className="w-full bg-[#f8f5ef] border border-transparent focus:border-[#c8a96a] p-5 rounded-2xl outline-none font-black uppercase text-xs tracking-wider text-[#1f4d3a] transition-all"
                  required
                />
                <input
                  name="telefono"
                  type="text"
                  placeholder="TELÉFONO DE CONTACTO"
                  className="w-full bg-[#f8f5ef] border border-transparent focus:border-[#c8a96a] p-5 rounded-2xl outline-none font-black uppercase text-xs tracking-wider text-[#1f4d3a] font-mono transition-all"
                  required
                />
                <input
                  name="email"
                  type="email"
                  placeholder="CORREO ELECTRÓNICO"
                  className="w-full bg-[#f8f5ef] border border-transparent focus:border-[#c8a96a] p-5 rounded-2xl outline-none font-black uppercase text-xs tracking-wider text-[#1f4d3a] transition-all"
                  required
                />
              </div>

              <div className="flex flex-col space-y-2">
                <select
                  name="servicio"
                  className="w-full bg-[#f8f5ef] border border-transparent focus:border-[#c8a96a] p-5 rounded-2xl outline-none font-black uppercase text-xs tracking-wider text-[#1f4d3a] appearance-none transition-all"
                  required
                >
                  <option value="" className="text-gray-400">TIPO DE SERVICIO REQUERIDO</option>
                  <option value="Limpieza Corporativa">LIMPIEZA CORPORATIVA</option>
                  <option value="Mantenimiento Técnico">MANTENIMIENTO TÉCNICO</option>
                  <option value="Servicios Especializados">SERVICIOS ESPECIALIZADOS</option>
                </select>
              </div>

              <div className="flex flex-col space-y-2">
                <textarea
                  name="mensaje"
                  placeholder="MENSAJE ADICIONAL (OPCIONAL)"
                  className="w-full bg-[#f8f5ef] border border-transparent focus:border-[#c8a96a] p-6 rounded-[2rem] outline-none font-black uppercase text-xs tracking-wider text-[#1f4d3a] transition-all resize-none"
                  rows={5}
                />
              </div>

              <div className="pt-4 text-center">
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-[#1f4d3a] text-white px-12 py-5 rounded-[2rem] text-[11px] font-black uppercase tracking-[0.3em] border border-[#c8a96a] hover:bg-[#c8a96a] transition-all shadow-xl w-full md:w-auto disabled:bg-gray-300"
                >
                  {loading ? 'PROCESANDO REGISTRO...' : 'SOLICITAR REGISTRO DE CONTACTO'}
                </button>
              </div>
            </form>
          )}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-white border-t border-[#ece7dc] py-12 px-10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-4">
            <img src="/klinman_logo.png" className="w-8 h-8 object-cover" alt="Klinman Logo" />
            <span className="text-sm font-black tracking-[0.3em] text-[#1f4d3a]">KLINMAN S.A.</span>
          </div>
          <div className="text-[11px] font-black tracking-widest text-gray-400 uppercase font-mono">Morandé 776, Santiago — Chile</div>
          <div className="flex gap-6 text-[11px] font-black tracking-wider text-gray-400 uppercase">
            <a href="#" className="hover:text-[#c8a96a]">LinkedIn</a>
            <a href="#" className="hover:text-[#c8a96a]">Facebook</a>
            <a href="mailto:correo@gmail.com" className="hover:text-[#c8a96a]">Correo</a>
            <a href="https://wa.me/56900000000" className="hover:text-[#c8a96a] font-mono">WhatsApp</a>
          </div>
        </div>
      </footer>
    </main>
  );
}