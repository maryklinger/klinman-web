'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  ClipboardList, 
  Users, 
  UserCircle, 
  BarChart3, 
  Settings,
  LogOut 
} from 'lucide-react';

export default function AdminSidebar() {
  const pathname = usePathname();

  const menuItems = [
    { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { label: 'Solicitudes', href: '/admin/solicitudes', icon: ClipboardList },
    { label: 'Usuarios', href: '/admin/usuarios', icon: Users }, // LA PIEZA QUE FALTABA
    { label: 'Clientes', href: '/admin/clientes', icon: UserCircle },
    { label: 'Reportes', href: '/admin/reportes', icon: BarChart3 },
    { label: 'Configuración', href: '/admin/configuracion', icon: Settings },
  ];

  return (
    <aside className="w-[280px] min-h-screen bg-[#1f4d3a] text-white p-10 flex flex-col fixed shadow-2xl z-50 border-r border-[#c8a96a]/10">
      
      <div className="mb-16">
        <h1 className="text-3xl font-black tracking-tighter text-[#c8a96a]">KLINMAN</h1>
        <p className="text-[10px] uppercase tracking-[0.3em] text-white/40 mt-1 font-black">
          Panel Administrativo
        </p>
      </div>

      <nav className="flex flex-col gap-2">
        {menuItems.map((item) => {
          const isActive = item.href === '/admin' 
            ? pathname === '/admin' 
            : pathname.startsWith(item.href);
          
          const Icon = item.icon;

          return (
            <Link
              key={item.label}
              href={item.href}
              className={`flex items-center gap-4 px-6 py-4 rounded-2xl text-[13px] transition-all duration-300 font-bold ${
                isActive 
                ? "bg-white/10 text-[#c8a96a] shadow-lg translate-x-2" 
                : "text-white/50 hover:text-white hover:bg-white/5"
              }`}
            >
              <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
              <span className="tracking-wide">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto pt-8 border-t border-white/10">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#c8a96a] flex items-center justify-center text-[#1f4d3a] font-black shadow-inner">
            AD
          </div>
          <div className="flex flex-col">
            <span className="text-[12px] font-black text-white uppercase tracking-tight">Admin Klinman</span>
            <button className="flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.2em] text-[#c8a96a] hover:text-white mt-1">
              <LogOut size={12} /> Cerrar Sesión
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}