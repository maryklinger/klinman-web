'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import toast, { Toaster } from 'react-hot-toast';

export default function PortalClientesPage() {
  const [ticketInput, setTicketInput] = useState('');
  const [resultado, setResultado] = useState(null);
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);

  const buscarTicket = async (e) => {
    e.preventDefault();
    if (!ticketInput.trim()) return;

    setCargando(true);
    setError('');
    setResultado(null);
    toast.dismiss();

    try {
      // Apunta directamente a la API que movimos en el Paso 1
      const res = await fetch(`/api/seguimiento?ticket=${ticketInput.toUpperCase()}`);
      const data = await res.json();

      if (data.success) {
        setResultado(data.data);
        toast.success("TICKET LOCALIZADO", {
          style: { background: '#1f4d3a', color: '#ffffff', fontWeight: '900', borderRadius: '24px', fontSize: '11px' }
        });
      } else {
        setError(data.error || 'NO SE ENCONTRÓ EL REGISTRO.');
        toast.error("TICKET NO ENCONTRADO", {
          style: { background: '#7f1d1d', color: '#ffffff', fontWeight: '900', borderRadius: '24px', fontSize: '11px' }
        });
      }
    } catch (err) {
      setError('ERROR DE CONEXIÓN CON AZURE SQL.');
    } finally {
      setCargando(false);
    }
  };

  return (
    <main className="bg-white text-[#1f4d3a] font-sans antialiased min-h-screen flex flex-col justify-between">
      <Toaster position="top-right" />

      {/* NAVBAR */}
      <nav className="flex items-center justify-between px-10 py-8 bg-white border-b border-[#f1ede4]">
        <Link href="/" className="flex items-center gap-4 group">
          <div className="w-10 h-10 rounded-full overflow-hidden border border-[#ece7dc]">
            <img src="/klinman_logo.png" alt="logo" className="w-full h-full object-cover" />
          </div>
          <h1 className="text-xl font-black tracking-[0.3em] text-[#1f4d3a]">KLINMAN</h1>
        </Link>
        <Link href="/">
          <button className="border-2 border-[#ece7dc] hover:border-[#1f4d3a] px-6 py-3 rounded-2xl text-[10px] font-black tracking-[0.2em] transition-all">
            VOLVER AL INICIO
          </button>
        </Link>
      </nav>

      {/* CONTENIDO PRINCIPAL */}
      <section className="py-20 px-6 flex-grow flex flex-col items-center justify-center bg-[#f8f5ef]">
        <div className="max-w-xl w-full bg-white rounded-[3.5rem] border border-[#ece7dc] p-10 md:p-14 shadow-sm text-center">
          <div className="mb-10">
            <h2 className="text-3xl font-black uppercase tracking-tighter text-[#1f4d3a]">PORTAL CLIENTES</h2>
            <p className="text-gray-400 font-black uppercase text-[10px] tracking-[0.3em] mt-3">Seguimiento de requerimientos en tiempo real</p>
          </div>

          <form onSubmit={buscarTicket} className="space-y-6">
            <input
              type="text"
              placeholder="INGRESE CÓDIGO TICKET (EJ: KLIN-0025)"
              value={ticketInput}
              onChange={(e) => setTicketInput(e.target.value)}
              className="w-full bg-[#f8f5ef] p-5 rounded-2xl outline-none font-black uppercase text-center text-xs tracking-widest font-mono border border-transparent focus:border-[#c8a96a]"
              required
            />
            <button
              type="submit"
              disabled={cargando}
              className="bg-[#1f4d3a] text-white px-10 py-4 rounded-[2rem] text-[11px] font-black uppercase tracking-[0.3em] border border-[#c8a96a] hover:bg-[#c8a96a] w-full transition-all disabled:bg-gray-300"
            >
              {cargando ? 'PROCESANDO SOLICITUD...' : 'BUSCAR TICKET'}
            </button>
          </form>

          {error && (
            <div className="mt-8 p-5 bg-[#fce8e6] border border-[#ef4444]/20 text-[#a83232] rounded-2xl font-black text-[11px] tracking-wider uppercase">
              {error}
            </div>
          )}

          {resultado && (
            <div className="mt-8 text-left bg-[#f8f5ef] border border-[#ece7dc] rounded-[2.5rem] p-8">
              <div className="flex justify-between items-center border-b-2 border-[#1f4d3a] pb-4 mb-6">
                <span className="font-mono font-black text-xl tracking-wider text-[#1f4d3a]">{resultado.codigo_ticket}</span>
                <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${
                  resultado.estado === 'pendiente' ? 'bg-[#fef3c7] text-[#b45309]' : 
                  resultado.estado === 'en proceso' ? 'bg-[#dbeafe] text-[#1d4ed8]' : 'bg-[#d1fae5] text-[#065f46]'
                  

                }`}>
                  {resultado.estado}
                </span>
              </div>
              <div className="space-y-3 text-xs">
                <p className="text-gray-400 font-black tracking-wider uppercase">CLIENTE: <span className="text-[#1f4d3a] font-black block mt-0.5">{resultado.nombre}</span></p>
                <p className="text-gray-400 font-black tracking-wider uppercase">SERVICIO: <span className="text-[#1f4d3a] font-black block mt-0.5">{resultado.servicio}</span></p>
                <p className="text-gray-400 font-black tracking-wider uppercase">PRIORIDAD: <span className="text-[#1f4d3a] font-black block mt-0.5">{resultado.prioridad}</span></p>
                <p className="text-gray-400 font-black tracking-wider uppercase font-mono text-[10px] pt-4 border-t border-[#ece7dc]/60">
                  FECHA INGRESO: {new Date(resultado.fecha_creacion).toLocaleDateString('es-CL')}
                </p>
              </div>
            </div>
          )}
        </div>
      </section>

      <footer className="bg-white border-t border-[#ece7dc] py-6 text-center text-gray-400 font-black text-[10px] tracking-widest uppercase">
        KLINMAN S.A. — CHILE
      </footer>
    </main>
  );
}