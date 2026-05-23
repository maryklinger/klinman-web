import Link from "next/link";
import { WrenchIcon, ArrowLeftStartOnRectangleIcon } from "@heroicons/react/24/outline";

export default function OperadorLayout({ children }) {
  return (
    <div className="min-h-screen bg-[#faf8f3] font-sans antialiased text-[#1f4d3a] flex flex-col">
      {/* Navbar Superior más cómodo para móviles */}
      <header className="bg-[#1f4d3a] text-white px-6 py-4 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-2">
          <WrenchIcon className="w-5 h-5 text-[#c8a96a]" />
          <div>
            <h1 className="text-sm font-bold tracking-tight">Klinman Terreno</h1>
            <p className="text-[9px] text-emerald-300 uppercase tracking-wider">Perfil Operario</p>
          </div>
        </div>
        
        <Link href="/admin/login" className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-all">
          <ArrowLeftStartOnRectangleIcon className="w-4 h-4" />
        </Link>
      </header>

      {/* Área de Trabajo */}
      <main className="flex-1 p-4 md:p-8 max-w-3xl mx-auto w-full">
        {children}
      </main>
    </div>
  );
}