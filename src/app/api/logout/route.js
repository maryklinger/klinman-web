"use client";
import { useRouter } from "next/navigation";

export default function Sidebar({ usuarioLogueado }) {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      // 1. Si usas NextAuth o una API propia para borrar la cookie de sesión:
      // await signOut({ redirect: false }); // Descomenta si usas next-auth
      
      // O si manejas un endpoint propio para borrar cookies:
      await fetch('/api/auth/logout', { method: 'POST' });

      // 2. Limpias cualquier rastro en el almacenamiento del navegador
      localStorage.clear();
      sessionStorage.clear();

      // 3. ¡La redirección mágica al Home de Klinman!
      router.push("/");
      router.refresh(); // Fuerza a Next.js a resetear los layouts compartidos
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  return (
    <div className="w-64 bg-[#1E4620] h-screen flex flex-col justify-between p-4">
      {/* ... El resto de tus módulos del menú arriba ... */}
      
      {/* SECCIÓN INFERIOR DEL PERFIL (Imagen 6d1b74) */}
      <div className="border-t border-emerald-800 pt-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-[#D4AF37] rounded-full flex items-center justify-center font-bold text-white">
            CE
          </div>
          <div>
            <h4 className="text-white font-bold text-sm">CELIA ST JAMES</h4>
            {/* Convertimos el texto en un botón interactivo real */}
            <button 
              onClick={handleLogout}
              className="text-[#D4AF37] hover:text-white text-xs font-semibold block text-left transition-colors"
            >
              CERRAR SESIÓN
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}