'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function AdminSidebar() {
  const pathname = usePathname();

  const menuItems = [
    { label: 'Dashboard', href: '/admin' },
    { label: 'Solicitudes', href: '/admin/solicitudes' }, // Corregido para separar del Dash
    { label: 'Clientes', href: '/admin/clientes' },
    { label: 'Reportes', href: '/admin/reportes' },
    { label: 'Configuración', href: '/admin/configuracion' },
  ];

  return (
    <aside className="w-[260px] min-h-screen bg-[#1f4d3a] text-white p-8 flex flex-col fixed shadow-2xl z-50">
      {/* BRANDING */}
      <div className="mb-14">
        <h1 className="text-2xl font-bold tracking-[0.15em] text-[#c8a96a]">
          KLINMAN
        </h1>
        <p className="text-[10px] uppercase tracking-[0.2em] text-white/40 mt-1 font-bold">
          Panel Administrativo
        </p>
      </div>

      {/* NAVEGACIÓN */}
      <nav className="flex flex-col gap-2">
        {menuItems.map((item) => {
          const isActive = item.href === '/admin' 
            ? pathname === '/admin' 
            : pathname.startsWith(item.href);

          return (
            <Link
              key={item.label}
              href={item.href}
              className={`px-4 py-3 rounded-xl text-sm transition-all duration-300 font-medium ${
                isActive 
                ? "bg-white/10 text-[#c8a96a] translate-x-1" 
                : "text-white/60 hover:text-white hover:bg-white/5"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* PERFIL DE USUARIO (Como en tus capturas) */}
      <div className="mt-auto pt-10 border-t border-white/5">
        <div className="flex items-center gap-3">
          {/* Avatar circular estilo minimal */}
          <div className="w-10 h-10 rounded-full bg-[#c8a96a] flex items-center justify-center text-[#1f4d3a] font-black text-xs shadow-inner">
            AD
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-bold text-white tracking-tight">Admin Klinman</span>
            <button className="text-[9px] font-black uppercase tracking-widest text-[#c8a96a] hover:text-white transition-colors text-left mt-0.5">
              Cerrar Sesión
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}