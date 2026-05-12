export default function AdminSidebar() {

  return (

    <aside className="w-[260px] min-h-screen bg-[#1f4d3a] text-white p-6 flex flex-col">

      <div className="mb-12">

        <h1 className="text-3xl font-bold tracking-widest text-[#c8a96a]">
          KLINMAN
        </h1>

        <p className="text-sm text-gray-300 mt-2">
          Panel Administrativo
        </p>

      </div>

      <nav className="flex flex-col gap-3">

        <a
          href="/admin"
          className="px-4 py-3 rounded-xl hover:bg-[#2b6b53] transition"
        >
          Dashboard
        </a>

        <a
          href="/admin"
          className="px-4 py-3 rounded-xl hover:bg-[#2b6b53] transition"
        >
          Solicitudes
        </a>

        <a
          href="/admin/clientes"
          className="px-4 py-3 rounded-xl hover:bg-[#2b6b53] transition"
        >
          Clientes
        </a>

        <a
          href="/admin/reportes"
          className="px-4 py-3 rounded-xl hover:bg-[#2b6b53] transition"
        >
          Reportes
        </a>

        <a
          href="/admin/configuracion"
          className="px-4 py-3 rounded-xl hover:bg-[#2b6b53] transition"
        >
          Configuración
        </a>

      </nav>

    </aside>
  );
}