export default function AdminSidebar() {

  const links = [
    { name: "Dashboard", href: "/admin" },
    { name: "Solicitudes", href: "/admin" },
    { name: "Clientes", href: "/admin/clientes" },
    { name: "Reportes", href: "/admin/reportes" },
    { name: "Configuración", href: "/admin/configuracion" },
  ];

  return (

    <aside className="
      w-[260px]
      min-h-screen
      bg-[#1f4d3a]
      text-white
      p-6
      flex
      flex-col
    ">

      {/* LOGO */}
      <div className="mb-12">

        <h1 className="
          text-3xl
          font-bold
          tracking-widest
          text-[#c8a96a]
        ">
          KLINMAN
        </h1>

        <p className="text-sm text-gray-300 mt-2">
          Panel Administrativo
        </p>

      </div>

      {/* LINKS */}
      <nav className="flex flex-col gap-3">

        {links.map((link) => (

          <a
            key={link.name}
            href={link.href}
            className="
              px-4
              py-3
              rounded-xl
              hover:bg-[#2b6b53]
              transition
            "
          >
            {link.name}
          </a>

        ))}

      </nav>

      {/* FOOTER */}
      <div className="mt-auto pt-10 text-sm text-gray-400">
        Klinman © 2026
      </div>

    </aside>
  );
}