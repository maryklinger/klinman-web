import Link from 'next/link';
import { 
  LayoutDashboard, 
  FileText, 
  Users, 
  BarChart3, 
  Settings,
  ShieldAlert 
} from 'lucide-react'; 

export default function SupervisorLayout({ children, user }) {
  // 1. Extraemos y normalizamos los strings de permisos que vienen de SQL Server
  const permisosUsuario = (user?.permisos || []).map(permiso => 
    permiso.toString().trim().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
  );

  // 2. Definición de la estructura idéntica de módulos de Klinman OS
  const menuItems = [
    {
      id: 'dashboard',
      claves: ['dash', 'acceso al dashboard', 'acceso_dash'],
      label: 'Dashboard',
      path: '/supervisor', // Su Home base
      icon: <LayoutDashboard className="w-5 h-5" />
    },
    {
      id: 'solicitudes',
      claves: ['cambiar estados', 'cambiar prioridad', 'control solicitudes', 'soli'],
      label: 'Solicitudes',
      path: '/solicitudes', // Apunta a tu carpeta raíz /solicitudes
      icon: <FileText className="w-5 h-5" />
    },
    {
      id: 'clientes',
      claves: ['ver cartera de clientes', 'ver_c', 'clientes'],
      label: 'Clientes',
      path: '/clientes',
      icon: <Users className="w-5 h-5" />
    },
    {
      id: 'reportes',
      claves: ['acceso a reportes', 'repo', 'reportes'],
      label: 'Reportes',
      path: '/reportes', // Apunta a tu carpeta raíz /reportes
      icon: <BarChart3 className="w-5 h-5" />
    },
    {
      id: 'configuracion',
      claves: ['acceso a configuracion', 'acceso a configuración', 'conf', 'configuracion'],
      label: 'Configuración',
      path: '/configuracion',
      icon: <Settings className="w-5 h-5" />
    }
  ];

  // 3. Filtrado estricto por la matriz de permisos
  const menuFiltrado = menuItems.filter(item => {
    return item.claves.some(clave => permisosUsuario.includes(clave.normalize("NFD").replace(/[\u0300-\u036f]/g, "")));
  });

  return (
    <div className="flex min-h-screen bg-[#FDFBF7] font-sans antialiased">
      {/* SIDEBAR IDENTICO AL PANEL ADMIN */}
      <aside className="w-64 bg-[#1E4631] text-white flex flex-col justify-between p-5 min-h-screen shrink-0 select-none">
        <div>
          {/* Brand/Logo idéntico a tu captura */}
          <div className="mb-8 px-2 pt-2">
            <h1 className="text-2xl font-bold tracking-wider text-[#C5A880] font-sans">KLINMAN</h1>
            <p className="text-[10px] text-[#8FA499] uppercase tracking-widest font-bold mt-0.5">Panel Supervisor</p>
          </div>

          {/* Menú de Navegación Dinámica */}
          <nav className="space-y-1.5">
            {menuFiltrado.map((item) => (
              <Link 
                key={item.id} 
                href={item.path}
                className="flex items-center space-x-3 px-4 py-3 rounded-xl text-[#DFE6E2] hover:bg-[#2C5E43] hover:text-white transition-all group font-medium text-sm"
              >
                <span className="text-[#8FA499] group-hover:text-[#C5A880] transition-colors">
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </Link>
            ))}
            
            {/* Si no tiene permisos, se le avisa elegantemente con la estética del sistema */}
            {menuFiltrado.length === 0 && (
              <div className="mt-4 px-4 py-3 bg-[#163525] border border-[#235239] rounded-xl flex items-start space-x-2">
                <ShieldAlert className="w-4 h-4 text-[#C5A880] shrink-0 mt-0.5" />
                <p className="text-xs text-[#8FA499] leading-relaxed">
                  Sin módulos asignados. Modifique los permisos en el panel Admin.
                </p>
              </div>
            )}
          </nav>
        </div>

        {/* Footer del Sidebar con Identidad del Colaborador */}
        <div className="border-t border-[#2C5E43] pt-4 pb-2 px-2">
          <p className="text-sm font-semibold truncate text-[#DFE6E2]">{user?.nombre || 'Fernanda Klinger'}</p>
          <button className="text-[11px] text-[#C5A880] font-bold uppercase tracking-wider mt-1 hover:text-white transition-colors block">
            Cerrar Sesión
          </button>
        </div>
      </aside>

      {/* CONTENIDO PRINCIPAL (Fondo crema claro exacto de Klinman) */}
      <main className="flex-1 p-10 bg-[#FDFBF7] overflow-y-auto">
        {children}
      </main>
    </div>
  );
}