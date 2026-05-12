'use client';

import toast, { Toaster } from 'react-hot-toast';

export default function Home() {

  const handleSubmit = async (e) => {

    e.preventDefault();

    const form = e.target;

    const data = {
      nombre: form.nombre.value,
      empresa: form.empresa.value,
      telefono: form.telefono.value,
      email: form.email.value,
      servicio: form.servicio.value,
      mensaje: form.mensaje.value || "",
    };

    try {

      const res = await fetch('/api/contacto', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (result.success) {

        toast.success(
          "Solicitud enviada correctamente. Klinman se pondrá en contacto contigo.",
          {
            duration: 5000,
            style: {
              background: '#1f4d3a',
              color: '#ffffff',
              border: '1px solid #c8a96a',
              padding: '16px',
              borderRadius: '14px',
            },
          }
        );

        form.reset();

      } else {

        toast.error(
          result.error || "No fue posible enviar la solicitud.",
          {
            duration: 5000,
            style: {
              background: '#7f1d1d',
              color: '#ffffff',
              border: '1px solid #ef4444',
              padding: '16px',
              borderRadius: '14px',
            },
          }
        );

        console.error(result.error);

      }

    } catch (error) {

      console.error(error);

      toast.error(
        "Error de conexión con el servidor. Intenta nuevamente.",
        {
          duration: 5000,
          style: {
            background: '#7f1d1d',
            color: '#ffffff',
            border: '1px solid #ef4444',
            padding: '16px',
            borderRadius: '14px',
          },
        }
      );

    }

  };

  return (

    <main className="bg-white text-gray-800">

      {/* TOASTER */}
      <Toaster position="top-right" />

      {/* NAVBAR */}
      <nav className="flex items-center justify-between px-10 py-6 bg-white sticky top-0 z-50">

        <a href="#inicio" className="flex items-center gap-3">

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

        </a>

        <ul className="hidden md:flex gap-8 text-sm font-semibold text-black">

          {[
            { name: "INICIO", id: "inicio" },
            { name: "SERVICIOS", id: "servicios" },
            { name: "NOSOTROS", id: "nosotros" },
            { name: "VALORES", id: "valores" },
          ].map((item) => (

            <li key={item.id}>

              <a
                href={`#${item.id}`}
                className="relative group hover:text-[#c8a96a] transition"
              >

                {item.name}

                <span className="
                  absolute
                  left-0
                  -bottom-1
                  w-0
                  h-[2px]
                  bg-[#c8a96a]
                  transition-all
                  duration-300
                  group-hover:w-full
                "></span>

              </a>

            </li>

          ))}

        </ul>

        <a href="#contacto">

          <button className="
            bg-[#1f4d3a]
            text-white
            px-5
            py-2
            rounded
            border
            border-[#c8a96a]
            hover:bg-[#16382b]
            transition
          ">
            CONTACTO
          </button>

        </a>

      </nav>

      {/* HERO */}
      <section id="inicio" className="relative w-full h-[500px]">

        <img
          src="/fondo_covert.jpg"
          className="absolute w-full h-full object-cover"
        />

        <div className="absolute w-full h-full bg-black/60"></div>

        <div className="
          relative
          z-10
          flex
          flex-col
          items-center
          justify-center
          h-full
          text-center
          text-white
          px-6
        ">

          <h1 className="text-4xl md:text-6xl font-semibold">
            TRES DÉCADAS ELEVANDO EL ESTÁNDAR DE LIMPIEZA
          </h1>

          <p className="mt-4 text-lg">
            Cuidamos sus espacios como activos de valor.
          </p>

          <a href="#contacto">

            <button className="
              mt-6
              border
              border-white
              px-6
              py-3
              hover:bg-white
              hover:text-black
              transition
            ">
              SOLICITAR ASESORÍA
            </button>

          </a>

        </div>

      </section>

      {/* SERVICIOS */}
      <section id="servicios" className="py-24 px-6 bg-[#f8f5ef]">

        <div className="max-w-6xl mx-auto">

          <h2 className="text-3xl font-semibold mb-12">
            Nuestros Servicios
          </h2>

          <div className="grid md:grid-cols-3 gap-8">

            {[
              {
                titulo: "Limpieza Corporativa",
                desc: "Espacios impecables con estándares profesionales.",
                img: "/limpieza_corporativa.jpg",
              },
              {
                titulo: "Mantenimiento Técnico",
                desc: "Tratamientos especializados para superficies.",
                img: "/mantenimiento_Tecnico.jpg",
              },
              {
                titulo: "Servicios Especializados",
                desc: "Soluciones a medida para cada cliente.",
                img: "/servicios_especializados.jpg",
              },
            ].map((s, i) => (

              <div
                key={i}
                className="
                  group
                  border
                  rounded-xl
                  overflow-hidden
                  bg-white
                  hover:shadow-lg
                  transition
                "
              >

                <img
                  src={s.img}
                  className="
                    w-full
                    h-[250px]
                    object-cover
                    group-hover:scale-105
                    transition
                    duration-500
                  "
                />

                <div className="p-6">

                  <h3 className="text-lg font-semibold mb-2">
                    {s.titulo}
                  </h3>

                  <p className="text-gray-600 text-sm mb-6">
                    {s.desc}
                  </p>

                  <a href="#contacto">

                    <button className="
                      text-sm
                      border
                      px-4
                      py-2
                      rounded-full
                      hover:bg-black
                      hover:text-white
                      transition
                    ">
                      Solicitar →
                    </button>

                  </a>

                </div>

              </div>

            ))}

          </div>

        </div>

      </section>

      {/* NOSOTROS */}
      <section id="nosotros" className="py-24 px-6 text-center">

        <h2 className="text-3xl font-semibold mb-6">
          Nosotros
        </h2>

        <p className="max-w-2xl mx-auto text-gray-600">
          Klinman es su socio estratégico en limpieza técnica y mantenimiento corporativo.
        </p>

      </section>

      {/* VALORES */}
      <section id="valores" className="py-24 px-6 bg-[#f9f9f9] text-center">

        <h2 className="text-3xl font-semibold mb-12">
          Valores
        </h2>

        <div className="
          grid
          grid-cols-2
          md:grid-cols-4
          gap-8
          max-w-4xl
          mx-auto
        ">

          {[
            "EXPERIENCIA",
            "COMPROMISO",
            "SINERGIA",
            "RESPETO",
          ].map((v, i) => (

            <div
              key={i}
              className="
                p-6
                rounded-xl
                hover:bg-white
                transition
              "
            >
              {v}
            </div>

          ))}

        </div>

      </section>

      {/* FORMULARIO */}
      <section
        id="contacto"
        className="py-24 px-6 bg-white"
      >

        <div className="max-w-4xl mx-auto">

          <h2 className="
            text-3xl
            font-semibold
            mb-10
            text-center
          ">
            Formulario de Contacto
          </h2>

          <form
            onSubmit={handleSubmit}
            className="space-y-6"
          >

            <div className="
              grid
              grid-cols-1
              md:grid-cols-2
              gap-6
            ">

              <input
                name="nombre"
                placeholder="Nombre"
                className="
                  border-b
                  p-3
                  outline-none
                  focus:border-[#c8a96a]
                "
                required
              />

              <input
                name="empresa"
                placeholder="Empresa"
                className="
                  border-b
                  p-3
                  outline-none
                  focus:border-[#c8a96a]
                "
                required
              />

              <input
                name="telefono"
                placeholder="Teléfono"
                className="
                  border-b
                  p-3
                  outline-none
                  focus:border-[#c8a96a]
                "
                required
              />

              <input
                name="email"
                type="email"
                placeholder="Email"
                className="
                  border-b
                  p-3
                  outline-none
                  focus:border-[#c8a96a]
                "
                required
              />

            </div>

            <select
              name="servicio"
              className="
                w-full
                border-b
                p-3
                outline-none
                focus:border-[#c8a96a]
              "
              required
            >

              <option value="">
                Tipo de Interés
              </option>

              <option value="Limpieza">
                Limpieza
              </option>

              <option value="Mantenimiento">
                Mantenimiento
              </option>

            </select>

            <textarea
              name="mensaje"
              placeholder="Mensaje (opcional)"
              className="
                w-full
                border
                p-4
                rounded-2xl
                outline-none
                focus:border-[#c8a96a]
              "
              rows={5}
            />

            <button
              type="submit"
              className="
                mt-4
                bg-[#1f4d3a]
                text-white
                px-8
                py-3
                rounded-full
                border
                border-[#c8a96a]
                hover:bg-[#16382b]
                transition
              "
            >
              SOLICITAR CONTACTO
            </button>

          </form>

        </div>

      </section>

      {/* FOOTER */}
      <footer className="bg-[#f8f5ef] border-t py-8 px-6">

        <div className="
          max-w-6xl
          mx-auto
          flex
          flex-col
          md:flex-row
          items-center
          justify-between
          gap-6
        ">

          <div className="flex items-center gap-3">

            <img
              src="/klinman_logo.png"
              className="w-10"
            />

            <span className="
              text-xl
              font-semibold
              text-[#c8a96a]
            ">
              KLINMAN
            </span>

          </div>

          <div className="
            text-sm
            text-gray-700
            text-center
          ">
            Morandé 776, Santiago
          </div>

          <div className="flex gap-4">

            <a href="#">
              LinkedIn
            </a>

            <a href="#">
              Facebook
            </a>

            <a href="mailto:correo@gmail.com">
              Correo
            </a>

            <a href="https://wa.me/56900000000">
              WhatsApp
            </a>

          </div>

        </div>

      </footer>

    </main>
  );
}