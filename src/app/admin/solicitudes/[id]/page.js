import sql from "mssql";
import Link from "next/link";
import AdminSidebar from "@/components/AdminSidebar";
import StatusBadge from "@/components/StatusBadge";
import EstadoSelect from "@/components/EstadoSelect";
import SolicitudNotas from "@/components/SolicitudNotas";

async function getSolicitud(id) {

  const config = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    server: process.env.DB_SERVER,
    database: process.env.DB_DATABASE,

    options: {
      encrypt: true,
      trustServerCertificate: false,
    },
  };

  try {

    const pool = await sql.connect(config);

    const result = await pool
      .request()
      .input("id", sql.Int, id)
      .query(`
        SELECT *
        FROM solicitudes
        WHERE id = @id
      `);

    return result.recordset[0];

  } catch (error) {

    console.error(error);
    return null;

  }
}

export default async function SolicitudDetalle({
  params
}) {

  const { id } = await params;

  const solicitud = await getSolicitud(id);

  if (!solicitud) {

    return (
      <div className="p-10">
        Solicitud no encontrada
      </div>
    );
  }

  return (

    <main className="min-h-screen bg-[#f8f5ef] flex">

      {/* SIDEBAR */}
      <AdminSidebar />

      {/* CONTENIDO */}
      <section className="flex-1 p-10">

        <div className="max-w-5xl mx-auto">

          {/* VOLVER */}
          <Link
            href="/admin"
            className="
              text-[#1f4d3a]
              mb-8
              inline-block
              hover:text-[#c8a96a]
              transition
            "
          >
            ← Volver al dashboard
          </Link>

          {/* CARD */}
          <div className="
            bg-white
            rounded-3xl
            shadow-sm
            border
            border-[#ece7dc]
            p-10
          ">

            {/* HEADER */}
            <div className="mb-10">

              <p className="
                text-[#c8a96a]
                font-semibold
                text-sm
              ">
                {solicitud.ticket}
              </p>

              <h1 className="
                text-4xl
                font-bold
                text-[#1f4d3a]
                mt-2
              ">
                {solicitud.nombre}
              </h1>

              <p className="text-gray-500 mt-2">
                {solicitud.empresa}
              </p>

            </div>

            {/* GRID */}
            <div className="
              grid
              md:grid-cols-2
              gap-8
            ">

              {/* CONTACTO */}
              <div className="
                bg-[#faf8f3]
                rounded-2xl
                p-6
              ">

                <h2 className="
                  text-xl
                  font-semibold
                  text-[#1f4d3a]
                  mb-5
                ">
                  Información de contacto
                </h2>

                <div className="space-y-4">

                  <div>

                    <p className="text-sm text-gray-500">
                      Teléfono
                    </p>

                    <p className="font-medium">
                      {solicitud.telefono}
                    </p>

                  </div>

                  <div>

                    <p className="text-sm text-gray-500">
                      Email
                    </p>

                    <p className="font-medium">
                      {solicitud.email}
                    </p>

                  </div>

                </div>

              </div>

              {/* SOLICITUD */}
              <div className="
                bg-[#faf8f3]
                rounded-2xl
                p-6
              ">

                <h2 className="
                  text-xl
                  font-semibold
                  text-[#1f4d3a]
                  mb-5
                ">
                  Detalle solicitud
                </h2>

                <div className="space-y-4">

                  <div>

                    <p className="text-sm text-gray-500">
                      Servicio
                    </p>

                    <p className="font-medium">
                      {solicitud.servicio}
                    </p>

                  </div>

                  <div>

                    <p className="text-sm text-gray-500">
                      Estado
                    </p>

                    <div className="flex items-center gap-3 mt-2">

                      <StatusBadge estado={solicitud.estado} />

                      <EstadoSelect
                        solicitudId={solicitud.id}
                        estadoActual={solicitud.estado}
                      />

                    </div>

                  </div>

                  <div>

                    <p className="text-sm text-gray-500">
                      Fecha
                    </p>

                    <p className="font-medium">
                      {
                        new Date(
                          solicitud.fecha_creacion
                        ).toLocaleDateString("es-CL")
                      }
                    </p>

                  </div>

                </div>

              </div>

            </div>

            {/* MENSAJE */}
            <div className="
              mt-8
              bg-[#faf8f3]
              rounded-2xl
              p-6
            ">

              <h2 className="
                text-xl
                font-semibold
                text-[#1f4d3a]
                mb-5
              ">
                Mensaje del cliente
              </h2>

              <p className="
                text-gray-700
                leading-relaxed
                whitespace-pre-line
              ">
                {solicitud.mensaje || "Sin mensaje"}
              </p>

            </div>

            {/* NOTAS INTERNAS */}
            <SolicitudNotas
              solicitudId={solicitud.id}
              notasIniciales={solicitud.notas}
              estadoActual={solicitud.estado}
            />

          </div>

        </div>

      </section>

    </main>
  );
}