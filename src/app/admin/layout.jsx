'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  Squares2X2Icon, ClipboardDocumentListIcon, UsersIcon, 
  UserGroupIcon, ChartBarIcon, Cog6ToothIcon, 
  Bars3Icon, XMarkIcon 
} from "@heroicons/react/24/outline";

export default function AdminLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const [usuarioSesion, setUsuarioSesion] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const obtenerSesion = async () => {
      try {
        const res = await fetch('/api/session');
        const data = await res.json();
        if (data.user) setUsuarioSesion(data.user);
      } catch (error) {
        console.error("Error al obtener sesión:", error);
      }
    };
    obtenerSesion();
  }, []);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push("/");
    router.refresh();
  };

  const esLogin = pathname === '/admin/login' || pathname === '/login';

  const menuItemsCompletos = [
    { id: 'dashboard', label: 'Dashboard', icon: <Squares2X2Icon className="w-6 h-6" />, href: '/admin' },
    { id: 'solicitudes', label: 'Solicitudes', icon: <ClipboardDocumentListIcon className="w-6 h-6" />, href: '/admin/solicitudes' },
    { id: 'modificar_permisos', label: 'Usuarios', icon: <UserGroupIcon className="w-6 h-6" />, href: '/admin/usuarios' }, 
    { id: 'clientes', label: 'Clientes', icon: <UsersIcon className="w-6 h-6" />, href: '/admin/clientes' },
    { id: 'reportes', label: 'Reportes', icon: <ChartBarIcon className="w-6 h-6" />, href: '/admin/reportes' },
    { id: 'configuracion', label: 'Configuración', icon: <Cog6ToothIcon className="w-6 h-6" />, href: '/admin/configuracion' },
  ];

  const menuItems = menuItemsCompletos.filter(item => {
    if (item.id === 'dashboard') return true;
    return usuarioSesion?.permisos?.some(p => p.toLowerCase().trim() === item.id.toLowerCase());
  });

  return (
    <div className="min-h-screen bg-[#f8f5ef] flex w-full">
      {!esLogin && (
        <>
          {/* Overlay para móvil */}
          {sidebarOpen && (
            <div 
              className="fixed inset-0 z-[80] bg-black/50 lg:hidden" 
              onClick={() => setSidebarOpen(false)} 
            />
          )}

          {/* Sidebar - Diseño original preservado */}
          <aside className={`
            fixed top-0 left-0 z-[90] h-screen w-64 bg-[#1f4d3a] text-white shadow-2xl 
            transform transition-transform duration-300 ease-in-out
            ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
            lg:translate-x-0 lg:sticky
          `}>
            <div className="p-8 flex justify-between items-center">
              <h1 className="text-2xl font-bold text-[#c8a96a]">KLINMAN</h1>
              <button onClick={() => setSidebarOpen(false)} className="lg:hidden">
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>

            <nav className="px-4 space-y-2">
              {menuItems.map((item) => {
                const isActive = item.href === '/admin' ? pathname === '/admin' : pathname.startsWith(item.href);
                return (
                  <Link key={item.id} href={item.href} onClick={() => setSidebarOpen(false)} 
                    className={`flex items-center gap-4 px-4 py-4 rounded-xl font-bold text-sm transition-colors ${isActive ? "bg-white/10 text-[#c8a96a]" : "text-white/60 hover:bg-white/5"}`}>
                    {item.icon} {item.label}
                  </Link>
                );
              })}
            </nav>

            {/* Bloque de usuario original */}
            <div className="absolute bottom-8 left-8 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#c8a96a] flex items-center justify-center font-black text-[#1f4d3a]">
                {usuarioSesion?.nombre?.charAt(0) || "U"}
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-bold text-white uppercase">{usuarioSesion?.nombre}</span>
                <button onClick={handleLogout} className="text-[10px] text-[#c8a96a] uppercase font-black tracking-widest text-left">
                  Cerrar Sesión
                </button>
              </div>
            </div>
          </aside>
        </>
      )}

      {/* Main Content */}
      <main className="flex-1 w-full min-h-screen overflow-x-hidden">
        {!esLogin && (
          <div className="lg:hidden p-4">
            <button onClick={() => setSidebarOpen(true)} className="p-2 bg-[#1f4d3a] text-white rounded-lg shadow-lg">
              <Bars3Icon className="w-6 h-6" />
            </button>
          </div>
        )}
        <div className="p-4 md:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}