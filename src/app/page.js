export default function Home() {
  return (
    <main className="bg-white text-gray-800">

      {/* NAVBAR */}
      <nav className="flex items-center justify-between px-10 py-4 bg-[#f8f5ef] border-b border-[#c8a96a]">

          {/* LOGO */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full overflow-hidden">
              <img 
                src="/klinman_logo.png" 
                alt="logo" 
                className="w-full h-full object-cover"
              />
            </div>

            <h1 className="text-xl font-bold tracking-widest text-[#c8a96a]">
              KLINMAN

            </h1>
          </div>

          
  

          {/* MENÚ */}
          <ul className="hidden md:flex gap-8 text-sm font-semibold text-black">
  
          <li className="relative group cursor-pointer hover:text-[#c8a96a] transition-colors duration-300">
            INICIO
            <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-[#c8a96a] transition-all duration-300 group-hover:w-full"></span>
          </li>

          <li className="relative group cursor-pointer hover:text-[#c8a96a] transition-colors duration-300">
            SERVICIOS
            <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-[#c8a96a] transition-all duration-300 group-hover:w-full"></span>
          </li>

          <li className="relative group cursor-pointer hover:text-[#c8a96a] transition-colors duration-300">
            SOBRE NOSOTROS
            <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-[#c8a96a] transition-all duration-300 group-hover:w-full"></span>
          </li>

          <li className="relative group cursor-pointer hover:text-[#c8a96a] transition-colors duration-300">
            VALORES
            <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-[#c8a96a] transition-all duration-300 group-hover:w-full"></span>
          </li>

        </ul>

          {/* BOTÓN */}
          <button className="bg-[#1f4d3a] text-white px-5 py-2 rounded shadow-md border border-[#c8a96a] hover:bg-[#16382b] transition">
            CONTACTO
          </button>

      </nav>


      {/* HERO */}
      <section className="h-[400px] bg-cover bg-center flex flex-col justify-center items-center text-white"
           style={{ backgroundImage: "url('/limpieza.jpg')" }}>
        <h2 className="text-3xl font-bold mb-4">
          Servicio profesional de limpieza
        </h2>
        <p className="mb-4">Calidad y confianza para tu empresa</p>
        <button className="bg-green-600 text-white px-6 py-2 rounded">
          Solicitar asesoría
        </button>
      </section>

      {/* SERVICIOS */}
      <section className="p-10 text-center">
        <h2 className="text-2xl font-bold mb-6">Servicios</h2>
        <div className="grid grid-cols-3 gap-6">
          <div className="p-5 shadow rounded">Limpieza oficinas</div>
          <div className="p-5 shadow rounded">Limpieza industrial</div>
          <div className="p-5 shadow rounded">Sanitización</div>
        </div>
      </section>

      {/* FORMULARIO */}
      <section className="p-10 bg-gray-100">
        <h2 className="text-2xl font-bold mb-6 text-center">
          Solicita tu asesoría
        </h2>

        <form className="max-w-md mx-auto flex flex-col gap-4">
          <input placeholder="Nombre" className="p-2 border rounded" />
          <input placeholder="Empresa" className="p-2 border rounded" />
          <input placeholder="Teléfono" className="p-2 border rounded" />
          <input placeholder="Email" className="p-2 border rounded" />

          <select className="p-2 border rounded">
            <option>Tipo de servicio</option>
            <option>Oficinas</option>
            <option>Industrial</option>
          </select>

          <button className="bg-green-600 text-white p-2 rounded">
            Enviar
          </button>
        </form>
      </section>

    </main>
  );
}