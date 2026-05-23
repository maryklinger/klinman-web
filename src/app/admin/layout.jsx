'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation'; // <-- Importamos useRouter para sacarla de aquí
import { 
  Squares2X2Icon, 
  ClipboardDocumentListIcon, 
  UsersIcon,      
  UserGroupIcon,  
  ChartBarIcon, 
  Cog6ToothIcon 
} from "@heroicons/react/24/outline";

export default function AdminLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter(); // <-- Inicializamos el enrutador
  const [usuarioSesion, setUsuarioSesion] = useState(null);

  // 1. RESCATE DE LA SESIÓN ACTIVA + PERMISOS REALES DE AZURE
  useEffect(() => {
    const obtenerSesion = async () => {
      try {
        // CORRECCIÓN: Quitamos '/auth' para apuntar a tu API real /api/session
        const res = await fetch('/api/session'); 
        const data = await res.json();
        
        if (data.user) {
          setUsuarioSesion(data.user);
        } else {
          // Si la API responde que no hay sesión, vaciamos el estado
          setUsuarioSesion(null);
        }
      } catch (error) {
        console.error("Error real al rescatar sesión de Azure:", error);
        setUsuarioSesion(null);
      }
    };
    
    obtenerSesion();
  }, [pathname]);

  // FUNCIÓN PARA CERRAR SESIÓN DE VERDAD Y REDIRIGIR AL HOME DE LA WEB
  const handleLogout = async () => {
    try {
      // Llamamos a la API que borra las cookies seguras del servidor
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch (err) {
      console.error("Error al revocar cookies de sesión:", err);
    }

    // Limpiamos la memoria del navegador
    localStorage.clear();
    sessionStorage.clear();

    // Redirección forzada al Home ("/") de Klinman
    router.push("/");
    router.refresh();
  };

  const esLogin = pathname === '/admin/login' || pathname === '/login';

  // 2. LISTA MAESTRA DE MENÚS
  const menuItemsCompletos = [
    { id: 'dashboard', label: 'Dashboard', icon: <Squares2X2Icon className="w-6 h-6" />, href: '/admin' },
    { id: 'solicitudes', label: 'Solicitudes', icon: <ClipboardDocumentListIcon className="w-6 h-6" />, href: '/admin/solicitudes' },
    { id: 'usuarios', label: 'Usuarios', icon: <UserGroupIcon className="w-6 h-6" />, href: '/admin/usuarios' }, 
    { id: 'clientes', label: 'Clientes', icon: <UsersIcon className="w-6 h-6" />, href: '/admin/clientes' },
    { id: 'reportes', label: 'Reportes', icon: <ChartBarIcon className="w-6 h-6" />, href: '/admin/reportes' },
    { id: 'configuracion', label: 'Configuración', icon: <Cog6ToothIcon className="w-6 h-6" />, href: '/admin/configuracion' },
  ];

  // 3. FILTRADO ULTRA ESTRICTO
  const menuItems = menuItemsCompletos.filter(item => {
    return usuarioSesion?.permisos?.includes(item.id);
  });

  return (
    <div className="flex min-h-screen bg-[#f8f5ef]">
      
      {/* SIDEBAR FIJO */}
      {!esLogin && (
        <aside className="w-64 bg-[#1f4d3a] text-white flex flex-col fixed h-full shadow-2xl z-50">
          <div className="p-8">
            <h1 className="text-2xl font-bold text-[#c8a96a] tracking-tight">KLINMAN</h1>
            <p className="text-[10px] text-white/50 uppercase tracking-[0.2em] mt-1 font-bold">Panel Administrative</p>
          </div>

          <nav className="flex-1 px-4 space-y-2 overflow-y-auto">
            {menuItems.map((item) => {
              const isActive = item.href === '/admin' 
                ? pathname === '/admin' 
                : pathname.startsWith(item.href);

              return (
                <Link
                  key={item.id}
                  href={item.href}
                  className={`flex items-center gap-4 px-4 py-4 rounded-2xl transition-all font-bold text-sm ${
                    isActive 
                    ? "bg-white/10 text-[#c8a96a] shadow-inner translate-x-1" 
                    : "text-white/60 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <div className={isActive ? "text-[#c8a96a]" : "text-inherit"}>
                    {item.icon}
                  </div>
                  {item.label}
                </Link>
              );
            })}

            {/* AVISO VISUAL SI NO TIENE ACCESOS */}
            {menuItems.length === 0 && usuarioSesion && (
              <div className="p-4 mx-2 bg-black/20 rounded-2xl border border-white/5 text-center">
                <p className="text-[10px] font-black text-[#c8a96a] uppercase tracking-wider">Sin accesos activos</p>
                <p className="text-[9px] text-white/40 mt-1 normal-case font-normal">Pide al administrador activar tus módulos en la matriz.</p>
              </div>
            )}
          </nav>

          {/* FOOTER ADAPTADO CON EL BOTÓN CONECTADO */}
          <div className="p-8 border-t border-white/5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#c8a96a] flex items-center justify-center text-[#1f4d3a] font-black border-2 border-white/10 uppercase">
                {usuarioSesion?.nombre?.substring(0, 2) || "AD"}
              </div>
              <div className="max-w-[120px]">
                <p className="text-xs font-bold text-white truncate uppercase">{usuarioSesion?.nombre || 'Cargando...'}</p>
                
                {/* CORRECCIÓN FINAL: Añadido el tipo botón y el onClick relacional */}
                <button 
                  type="button"
                  onClick={handleLogout}
                  className="text-[10px] text-[#c8a96a] uppercase font-black hover:text-white transition-colors block text-left cursor-pointer"
                >
                  Cerrar Sesión
                </button>

              </div>
            </div>
          </div>
        </aside>
      )}

      {/* CONTENIDO DINÁMICO */}
      <main className={`flex-1 min-h-screen ${esLogin ? 'ml-0' : 'ml-64'}`}>
        {children}
      </main>
    </div>
  );
}