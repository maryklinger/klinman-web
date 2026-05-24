'use client';
import { signIn } from "next-auth/react";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

export default function AdminLogin() {
  return (
    <main className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-[#fdfcf9] font-sans antialiased text-[#1f4d3a] select-none relative">
      
      {/* SECCIÓN IZQUIERDA: LOGIN CON GOOGLE */}
      <div className="flex flex-col items-center justify-center p-8 md:p-16 relative">
        
        {/* BOTÓN VOLVER */}
        <div className="absolute top-6 left-8 md:top-10 md:left-16">
          <Link href="/" className="inline-flex items-center gap-2 border border-[#ece7dc] hover:border-[#1f4d3a] bg-white px-4 py-2 rounded-full text-[11px] font-black uppercase tracking-widest transition-all text-[#1f4d3a] shadow-sm hover:shadow">
            <ArrowLeftIcon className="w-3 h-3 stroke-[3]" />
            Volver al inicio
          </Link>
        </div>

        <div className="w-full max-w-md space-y-8 mt-12 lg:mt-0 text-center">
          <div>
            <h2 className="text-[#1f4d3a] text-4xl font-bold tracking-tight">Ingreso Klinman</h2>
            <p className="text-slate-400 text-xs font-semibold uppercase tracking-[0.15em] mt-2">
              Plataforma de Gestión Integral
            </p>
          </div>

          <div className="pt-8">
            <button
              onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
              className="w-full bg-[#1f4d3a] text-white font-black text-xs tracking-widest py-5 rounded-2xl border border-[#c8a96a]/20 hover:bg-[#16382b] transition-all flex items-center justify-center gap-3 uppercase shadow-lg shadow-emerald-900/10"
            >
              Ingresar con cuenta Klinman
            </button>
            <p className="mt-6 text-[10px] text-slate-400 font-bold uppercase tracking-widest">
              Uso exclusivo para personal autorizado
            </p>
          </div>

          <p className="text-center text-[9px] text-slate-400 uppercase tracking-[0.2em] font-bold pt-4">
            © 2026 Klinman SpA • Gestión de Activos Corporativos
          </p>
        </div>
      </div>

      {/* SECCIÓN DERECHA: BRANDING (Mantiene tu diseño original) */}
      <div className="hidden lg:flex bg-[#1f4d3a] relative items-center justify-center p-8">
        <div className="absolute inset-4 border border-[#c8a96a]/20 rounded-[3rem] pointer-events-none" />
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 left-0 w-96 h-96 border-[40px] border-[#c8a96a] rounded-full -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 right-0 w-64 h-64 border-[20px] border-[#c8a96a] rounded-full translate-x-1/3 translate-y-1/3"></div>
        </div>
        <div className="relative z-10 text-center p-12 max-w-md space-y-6">
          <span className="text-[#c8a96a] text-[10px] font-black tracking-[0.4em] uppercase block">
            Core Operations Center
          </span>
          <blockquote className="text-2xl font-light italic text-[#fdfcf9] leading-relaxed">
            "La <span className="text-[#c8a96a] font-normal">maestría técnica</span> es el pilar que preserva el valor de cada activo inmobiliario."
          </blockquote>
          <div className="h-[1px] w-12 bg-[#c8a96a]/40 mx-auto"></div>
        </div>
      </div>
    </main>
  );
}