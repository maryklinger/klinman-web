import sql from "mssql";
import AdminSidebar from "@/components/AdminSidebar";
import StatusBadge from "@/components/StatusBadge";
import EstadoSelect from "@/components/EstadoSelect";


async function getSolicitudes() {

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
      .query(`
        SELECT 
          id,
          ticket,
          nombre,
          empresa,
          telefono,
          email,
          servicio,
          mensaje,
          estado,
          fecha_creacion
        FROM solicitudes
        ORDER BY fecha_creacion DESC
      `);

    return result.recordset;

  } catch (error) {

    console.error(error);
    return [];

  }
}

export default async function AdminPage() {

  const solicitudes = await getSolicitudes();

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
              hover:shadow-md
              transition
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

                {
                  solicitudes.filter(
                    s => s.estado?.trim().toLowerCase() === "pendiente"
                  ).length
                }

              </h2>

            </div>

            {/* EN REVISIÓN */}
            <div className="
              bg-white
              rounded-3xl
              p-7
              shadow-sm
              border
              border-[#ece7dc]
              hover:shadow-md
              transition
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

                {
                  solicitudes.filter(
                   s => s.estado?.trim().toLowerCase() === "en revisión"
                  ).length
                }

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
              hover:shadow-md
              transition
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

                {
                  solicitudes.filter(
                   s => s.estado?.trim().toLowerCase() === "finalizado"
                  ).length
                }

              </h2>

            </div>

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

            {/* HEADER TABLA */}
            <div className="
              px-8
              py-6
              border-b
              border-[#ece7dc]
              flex
              items-center
              justify-between
            ">

              <div>

                <h2 className="
                  text-2xl
                  font-semibold
                  text-[#1f4d3a]
                ">
                  Solicitudes
                </h2>

                <p className="
                  text-sm
                  text-gray-500
                  mt-1
                ">
                  Gestión operacional Klinman
                </p>

              </div>

            </div>

            {/* TABLA */}
            <div className="overflow-x-auto">

              <table className="w-full">

                <thead className="bg-[#1f4d3a] text-white">

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

                  </tr>

                </thead>

                <tbody>

                  {solicitudes.map((s) => (

                    <tr
                      key={s.id}
                      className="
                        border-b
                        border-[#f1ede4]
                        hover:bg-[#faf8f3]
                        transition
                      "
                    >

                       <td className="p-5 font-semibold text-[#c8a96a]">
                        {s.ticket}
                       </td>

                      <td className="p-5 font-medium text-gray-800">
                        {s.nombre}
                      </td>

                      <td className="p-5 text-gray-600">
                        {s.empresa}
                      </td>

                      <td className="p-5 text-gray-600">
                        {s.servicio}
                      </td>

                      <td className="p-5">
                        <div className="flex items-center gap-3">

                            <StatusBadge estado={s.estado} />

                            <EstadoSelect
                                solicitudId={s.id}
                                estadoActual={s.estado}
                            />

                        </div>
                      </td>

                      <td className="p-5 text-gray-500">

                        {new Date(
                          s.fecha_creacion
                        ).toLocaleDateString()}

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