'use client';

import { useEffect, useState } from "react";

import AdminSidebar from "@/components/AdminSidebar";
import StatusBadge from "@/components/StatusBadge";
import EstadoSelect from "@/components/EstadoSelect";

export default function AdminPage() {

  const [solicitudes, setSolicitudes] = useState([]);

  const [busqueda, setBusqueda] = useState("");

  const [estadoFiltro, setEstadoFiltro] = useState("todos");

  const [loading, setLoading] = useState(true);

  // CARGAR SOLICITUDES
  useEffect(() => {

    async function cargarSolicitudes() {

      try {

        const res = await fetch("/api/solicitudes");

        const data = await res.json();

        if (data.success) {

          setSolicitudes(data.solicitudes);

        }

      } catch (error) {

        console.error(error);

      } finally {

        setLoading(false);

      }

    }

    cargarSolicitudes();

  }, []);

  // FILTROS
  const solicitudesFiltradas = solicitudes.filter((s) => {

    const texto = `
      ${s.ticket}
      ${s.nombre}
      ${s.empresa}
    `.toLowerCase();

    const coincideBusqueda =
      texto.includes(busqueda.toLowerCase());

    const coincideEstado =
      estadoFiltro === "todos"
        ? true
        : s.estado?.trim().toLowerCase() === estadoFiltro;

    return coincideBusqueda && coincideEstado;

  });

  // CONTADORES
  const pendientes = solicitudes.filter(
    (s) =>
      s.estado?.trim().toLowerCase() === "pendiente"
  ).length;

  const revision = solicitudes.filter(
    (s) =>
      s.estado?.trim().toLowerCase() === "en revisión"
  ).length;

  const finalizadas = solicitudes.filter(
    (s) =>
      s.estado?.trim().toLowerCase() === "finalizado"
  ).length;

  if (loading) {

    return (

      <main className="
        min-h-screen
        flex
        items-center
        justify-center
        bg-[#f8f5ef]
      ">

        <p className="text-gray-600">
          Cargando solicitudes...
        </p>

      </main>

    );

  }

  return (

    <main className="min-h-screen flex bg-[#f8f5ef]">

      {/* SIDEBAR */}
      <AdminSidebar />

      {/* CONTENIDO */}
      <section className="flex-1 p-10">

        <div className="max-w-7xl mx-auto">

          {/* HEADER */}
          <div className="flex items-center justify-between mb-10">

            <div>

              <h1 className="
                text-4xl
                font-bold
                text-[#1f4d3a]
              ">
                Panel Administrativo
              </h1>

              <p className="
                text-gray-600
                mt-2
              ">
                Gestión de solicitudes Klinman
              </p>

            </div>

          </div>

          {/* CARDS */}
          <div className="
            grid
            grid-cols-1
            md:grid-cols-3
            gap-6
            mb-10
          ">

            {/* PENDIENTES */}
            <div className="
              bg-white
              rounded-3xl
              p-7
              shadow-sm
              border
              border-[#ece7dc]
            ">

              <p className="
                text-sm
                text-[#8a6a2f]
                font-medium
              ">
                Solicitudes Pendientes
              </p>

              <h2 className="
                text-5xl
                font-bold
                text-[#c8a96a]
                mt-3
              ">
                {pendientes}
              </h2>

            </div>

            {/* EN REVISION */}
            <div className="
              bg-white
              rounded-3xl
              p-7
              shadow-sm
              border
              border-[#ece7dc]
            ">

              <p className="
                text-sm
                text-[#1f4d3a]
                font-medium
              ">
                En Revisión
              </p>

              <h2 className="
                text-5xl
                font-bold
                text-[#1f4d3a]
                mt-3
              ">
                {revision}
              </h2>

            </div>

            {/* FINALIZADAS */}
            <div className="
              bg-white
              rounded-3xl
              p-7
              shadow-sm
              border
              border-[#ece7dc]
            ">

              <p className="
                text-sm
                text-[#1f4d3a]
                font-medium
              ">
                Finalizadas
              </p>

              <h2 className="
                text-5xl
                font-bold
                text-[#1f4d3a]
                mt-3
              ">
                {finalizadas}
              </h2>

            </div>

          </div>

          {/* FILTROS */}
          <div className="
            flex
            flex-col
            md:flex-row
            gap-4
            mb-6
          ">

            {/* BUSCADOR */}
            <input
              type="text"
              placeholder="Buscar ticket, cliente o empresa..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="
                flex-1
                border
                border-[#d8d2c7]
                rounded-2xl
                px-4
                py-3
                outline-none
                focus:border-[#c8a96a]
                bg-white
              "
            />

            {/* FILTRO */}
            <select
              value={estadoFiltro}
              onChange={(e) => setEstadoFiltro(e.target.value)}
              className="
                border
                border-[#d8d2c7]
                rounded-2xl
                px-4
                py-3
                bg-white
                outline-none
                focus:border-[#c8a96a]
              "
            >

              <option value="todos">
                Todos los estados
              </option>

              <option value="pendiente">
                Pendientes
              </option>

              <option value="en revisión">
                En revisión
              </option>

              <option value="finalizado">
                Finalizadas
              </option>

            </select>

          </div>

          {/* TABLA */}
          <div className="
            bg-white
            rounded-3xl
            shadow-sm
            border
            border-[#ece7dc]
            overflow-hidden
          ">

            <div className="
              overflow-x-auto
              overflow-y-auto
              max-h-[600px]
            ">

              <table className="w-full">

                <thead className="
                  bg-[#1f4d3a]
                  text-white
                  sticky
                  top-0
                  z-10
                ">

                  <tr>

                    <th className="text-left p-5 font-medium">
                      Ticket
                    </th>

                    <th className="text-left p-5 font-medium">
                      Cliente
                    </th>

                    <th className="text-left p-5 font-medium">
                      Empresa
                    </th>

                    <th className="text-left p-5 font-medium">
                      Servicio
                    </th>

                    <th className="text-left p-5 font-medium">
                      Estado
                    </th>

                    <th className="text-left p-5 font-medium">
                      Fecha
                    </th>

                    <th className="text-left p-5 font-medium">
                      Acciones
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {solicitudesFiltradas.map((s) => (

                    <tr
                      key={s.id}
                      className="
                        border-b
                        border-[#f1ede4]
                        hover:bg-[#faf8f3]
                        transition
                      "
                    >

                      {/* TICKET */}
                      <td className="
                        p-5
                        font-semibold
                        text-[#c8a96a]
                      ">
                        {s.ticket}
                      </td>

                      {/* CLIENTE */}
                      <td className="
                        p-5
                        font-medium
                        text-gray-800
                      ">
                        {s.nombre}
                      </td>

                      {/* EMPRESA */}
                      <td className="
                        p-5
                        text-gray-600
                      ">
                        {s.empresa}
                      </td>

                      {/* SERVICIO */}
                      <td className="
                        p-5
                        text-gray-600
                      ">
                        {s.servicio}
                      </td>

                      {/* ESTADO */}
                      <td className="p-5">

                        <div className="
                          flex
                          items-center
                          gap-3
                        ">

                          <StatusBadge estado={s.estado} />

                          <EstadoSelect
                            solicitudId={s.id}
                            estadoActual={s.estado}
                          />

                        </div>

                      </td>

                      {/* FECHA */}
                      <td className="
                        p-5
                        text-gray-500
                      ">

                        {
                          new Date(
                            s.fecha_creacion
                          ).toLocaleDateString("es-CL")
                        }

                      </td>

                      {/* ACCIONES */}
                      <td className="p-5">

                        <a
                          href={`/admin/solicitudes/${s.id}`}
                          className="
                            bg-[#1f4d3a]
                            text-white
                            px-4
                            py-2
                            rounded-xl
                            text-sm
                            hover:bg-[#16382b]
                            transition
                          "
                        >
                          Ver detalle
                        </a>

                      </td>

                    </tr>

                  ))}

                </tbody>

              </table>

            </div>

          </div>

        </div>

      </section>

    </main>

  );

}