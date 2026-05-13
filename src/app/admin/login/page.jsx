'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [statusType, setStatusType] = useState(""); // "error" o "success"
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setStatusType("");

    // --- LÓGICA DE AUTENTICACIÓN ---
    // En producción, aquí harías un fetch a tu API Route
    if (email === "admin@klinman.cl" && password === "Klinman2026") {
      setStatusType("success");
      setError("Acceso concedido. Redirigiendo a la Central Operativa...");
      
      setTimeout(() => {
        router.push("/admin");
      }, 1500);
    } else {
      setTimeout(() => {
        setLoading(false);
        setStatusType("error");
        setError("Credenciales inválidas. Por favor, verifique su usuario y contraseña.");
      }, 1000); // Simulación de tiempo de red
    }
  };

  return (
    <main className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-white">
      
      {/* SECCIÓN IZQUIERDA: FORMULARIO */}
      <div className="flex items-center justify-center p-8 md:p-16">
        <div className="w-full max-w-md">
          {/* LOGO / BRANDING */}
          <div className="mb-10">
            <h2 className="text-[#1f4d3a] text-3xl font-bold tracking-tight">
              Klinman <span className="text-[#c8a96a]">Admin</span>
            </h2>
            <p className="text-gray-500 mt-2 font-medium">Centro de Control Operativo</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            
            {/* MENSAJES DE FEEDBACK CON COLORES CORRECTOS */}
            {error && (
              <div className={`p-4 rounded-2xl text-sm font-bold border flex items-center gap-3 transition-all animate-in fade-in slide-in-from-top-2 ${
                statusType === "success" 
                  ? "bg-green-50 text-[#1f4d3a] border-green-200" 
                  : "bg-red-50 text-red-600 border-red-100"
              }`}>
                <div className={`w-2 h-2 rounded-full animate-pulse ${
                  statusType === "success" ? "bg-[#1f4d3a]" : "bg-red-600"
                }`} />
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-bold text-[#1f4d3a] uppercase tracking-wider mb-2 ml-1">
                Correo Electrónico
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-[#d8d2c7] rounded-2xl px-5 py-4 outline-none focus:border-[#c8a96a] transition-all bg-[#faf8f3] text-[#1f4d3a]"
                placeholder="ejemplo@klinman.cl"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-[#1f4d3a] uppercase tracking-wider mb-2 ml-1">
                Contraseña
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-[#d8d2c7] rounded-2xl px-5 py-4 outline-none focus:border-[#c8a96a] transition-all bg-[#faf8f3] text-[#1f4d3a]"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#1f4d3a] text-white font-bold py-4 rounded-2xl border border-[#c8a96a] hover:bg-[#16382b] transition-all shadow-lg shadow-green-900/10 disabled:opacity-70 flex items-center justify-center gap-3"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  VERIFICANDO...
                </>
              ) : (
                "ACCEDER AL DASHBOARD"
              )}
            </button>
          </form>

          <p className="mt-10 text-center text-[10px] text-gray-400 uppercase tracking-[0.2em] font-bold">
            © 2026 Klinman SpA • Gestión de Activos de Alta Gama
          </p>
        </div>
      </div>

      {/* SECCIÓN DERECHA: BRANDING EXPERIENCIA EXCEPCIONAL */}
      <div className="hidden lg:flex bg-[#1f4d3a] relative items-center justify-center overflow-hidden">
        {/* Elementos decorativos abstractos */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 border-[40px] border-[#c8a96a] rounded-full -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 right-0 w-64 h-64 border-[20px] border-[#c8a96a] rounded-full translate-x-1/3 translate-y-1/3"></div>
        </div>
        
        <div className="relative z-10 text-center p-12 max-w-lg">
          <span className="text-[#c8a96a] text-xs font-bold tracking-[0.4em] uppercase mb-6 block">
            Expertos en Mantenimiento
          </span>
          <blockquote className="text-3xl font-light italic text-white leading-relaxed">
            "La <span className="text-[#c8a96a]">maestría técnica</span> es el pilar que preserva el valor de cada activo inmobiliario."
          </blockquote>
          <div className="mt-8 h-[2px] w-16 bg-[#c8a96a] mx-auto"></div>
        </div>
      </div>
    </main>
  );
}