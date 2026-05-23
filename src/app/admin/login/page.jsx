'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import { 
  ShieldCheckIcon, 
  UserGroupIcon, 
  WrenchScrewdriverIcon 
} from "@heroicons/react/24/outline";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rolSeleccionado, setRolSeleccionado] = useState("admin"); // "admin" | "supervisor" | "operador"
  const [error, setError] = useState("");
  const [statusType, setStatusType] = useState(""); // "error" o "success"
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const rolesConfig = {
    admin: { label: "Admin", path: "/admin", icon: <ShieldCheckIcon className="w-4 h-4" /> },
    supervisor: { label: "Supervisor", path: "/supervisor", icon: <UserGroupIcon className="w-4 h-4" /> },
    operador: { label: "Operador", path: "/operador", icon: <WrenchScrewdriverIcon className="w-4 h-4" /> }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setStatusType("");

    try {
      // LLAMADO DIRECTO A LA NUEVA API REST DE LOGIN
      const res = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          correo: email,
          contrasena: password,
          rol: rolSeleccionado
        })
      });

      const data = await res.json();

      if (data.success) {
        setStatusType("success");
        setError(`Acceso concedido como ${data.user.nombre.toUpperCase()}. Redirigiendo...`);
        
        // Ejecutar router.refresh() para avisarle al Layout superior que lea la nueva cookie creada
        router.refresh();

        // Redirección basada en la configuración elegida en las píldoras
        setTimeout(() => {
          router.push(rolesConfig[rolSeleccionado].path);
        }, 1200);
      } else {
        setLoading(false);
        setStatusType("error");
        setError(data.error || "Credenciales inválidas para el perfil seleccionado.");
      }
    } catch (err) {
      console.error("Error en login front:", err);
      setLoading(false);
      setStatusType("error");
      setError("Error de red o caída de servidor. Intente más tarde.");
    }
  };

  return (
    <main className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-[#fdfcf9] font-sans antialiased text-[#1f4d3a] select-none">
      
      {/* SECCIÓN IZQUIERDA: FORMULARIO DE ACCESO REESTILIZADO */}
      <div className="flex items-center justify-center p-8 md:p-16">
        <div className="w-full max-w-md space-y-8">
          
          {/* LOGO / BRANDING INSTITUCIONAL */}
          <div>
            <h2 className="text-[#1f4d3a] text-4xl font-bold tracking-tight">
              Ingreso Klinman
            </h2>
            <p className="text-slate-400 text-xs font-semibold uppercase tracking-[0.15em] mt-2">
              Plataforma de Gestión Integral
            </p>
          </div>

          {/* SELECTOR DE PERFIL DE INGRESO (PÍLDORAS TÁCTILES) */}
          <div className="space-y-2">
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
              Seleccione Perfil de Acceso
            </label>
            <div className="grid grid-cols-3 gap-2 bg-[#faf8f3] border border-[#ece7dc] p-1.5 rounded-[1.5rem]">
              {Object.entries(rolesConfig).map(([key, value]) => {
                const esActivo = rolSeleccionado === key;
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setRolSeleccionado(key)}
                    className={`flex items-center justify-center gap-1.5 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
                      esActivo 
                        ? 'bg-[#1f4d3a] text-[#c8a96a] shadow-md shadow-[#1f4d3a]/10' 
                        : 'text-slate-400 hover:text-[#1f4d3a]'
                    }`}
                  >
                    {value.icon}
                    {value.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* FORMULARIO */}
          <form onSubmit={handleLogin} className="space-y-5">
            
            {/* ALERTAS Y MENSAJES DE FEEDBACK CON ESTILO KLINMAN */}
            {error && (
              <div className={`p-4 rounded-[1.25rem] text-xs font-bold border flex items-center gap-3 transition-all animate-in fade-in slide-in-from-top-2 ${
                statusType === "success" 
                  ? "bg-emerald-50/50 text-[#1f4d3a] border-emerald-200" 
                  : "bg-red-50/50 text-red-600 border-red-200"
              }`}>
                <div className={`w-2 h-2 rounded-full shrink-0 ${
                  statusType === "success" ? "bg-[#c8a96a] animate-pulse" : "bg-red-500"
                }`} />
                <span className="uppercase tracking-tight">{error}</span>
              </div>
            )}

            <div className="space-y-2">
              <label className="block text-[10px] font-black text-[#1f4d3a] uppercase tracking-widest ml-1">
                Correo Electrónico
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border-2 border-slate-100 rounded-2xl px-5 py-4 outline-none focus:border-[#1f4d3a] transition-all bg-white text-[#1f4d3a] text-sm"
                placeholder="ejemplo@klinman.cl"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-[10px] font-black text-[#1f4d3a] uppercase tracking-widest ml-1">
                Contraseña
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border-2 border-slate-100 rounded-2xl px-5 py-4 outline-none focus:border-[#1f4d3a] transition-all bg-white text-[#1f4d3a] text-sm"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#1f4d3a] text-white font-black text-xs tracking-widest py-4.5 rounded-2xl border border-[#c8a96a]/20 hover:bg-[#16382b] transition-all disabled:opacity-70 flex items-center justify-center gap-3 uppercase shadow-lg shadow-emerald-900/5 mt-2"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-[#c8a96a]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Verificando Credenciales...</span>
                </>
              ) : (
                `Ingresar como ${rolesConfig[rolSeleccionado].label}`
              )}
            </button>
          </form>

          <p className="text-center text-[9px] text-slate-400 uppercase tracking-[0.2em] font-bold pt-4">
            © 2026 Klinman SpA • Gestión de Activos Corporativos
          </p>
        </div>
      </div>

      {/* SECCIÓN DERECHA: BRANDING PREMIUM */}
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