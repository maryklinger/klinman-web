'use client';
import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Squares2X2Icon, 
  ClipboardDocumentListIcon, 
  UsersIcon, 
  ChartBarIcon, 
  Cog6ToothIcon 
} from "@heroicons/react/24/outline";

export default function AdminLayout({ children }) {
  const pathname = usePathname();

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <Squares2X2Icon className="w-6 h-6" />, href: '/admin' },
    { id: 'solicitudes', label: 'Solicitudes', icon: <ClipboardDocumentListIcon className="w-6 h-6" />, href: '/admin/solicitudes' },
    { id: 'clientes', label: 'Clientes', icon: <UsersIcon className="w-6 h-6" />, href: '/admin/clientes' },
    { id: 'reportes', label: 'Reportes', icon: <ChartBarIcon className="w-6 h-6" />, href: '/admin/reportes' },
    { id: 'configuracion', label: 'Configuración', icon: <Cog6ToothIcon className="w-6 h-6" />, href: '/admin/configuracion' },
  ];

  return (
    <div className="flex min-h-screen bg-[#f8f5ef]">
      {/* SIDEBAR FIJO */}
      <aside className="w-64 bg-[#1f4d3a] text-white flex flex-col fixed h-full shadow-2xl z-50">
        <div className="p-8">
          <h1 className="text-2xl font-bold text-[#c8a96a] tracking-tight">KLINMAN</h1>
          <p className="text-[10px] text-white/50 uppercase tracking-[0.2em] mt-1 font-bold">Panel Administrativo</p>
        </div>

        <nav className="flex-1 px-4 space-y-2">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.id}
                href={item.href}
                className={`flex items-center gap-4 px-4 py-4 rounded-2xl transition-all font-bold text-sm ${
                  isActive 
                  ? "bg-white/10 text-[#c8a96a] shadow-inner" 
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
        </nav>

        <div className="p-8 border-t border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#c8a96a] flex items-center justify-center text-[#1f4d3a] font-black border-2 border-white/10">
              AD
            </div>
            <div>
              <p className="text-xs font-bold text-white">Admin Klinman</p>
              <button className="text-[10px] text-[#c8a96a] uppercase font-black hover:text-white transition-colors">Cerrar Sesión</button>
            </div>
          </div>
        </div>
      </aside>

      {/* CONTENIDO DINÁMICO */}
      <main className="flex-1 ml-64 min-h-screen">
        {children}
      </main>
    </div>
  );
}