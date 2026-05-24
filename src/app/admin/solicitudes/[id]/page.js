import sql from "mssql";
import Link from "next/link";
import StatusBadge from "../../../../components/StatusBadge.jsx";
import EstadoSelect from "../../../../components/EstadoSelect.jsx";
import SolicitudNotas from "../../../../components/SolicitudNotas.jsx";
import { 
  ClipboardDocumentCheckIcon, 
  PaperClipIcon, 
  ClockIcon, 
  ArrowLeftIcon 
} from "@heroicons/react/24/outline";

async function getSolicitud(id) {
  const config = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    server: process.env.DB_SERVER,
    database: process.env.DB_DATABASE,
    options: { encrypt: true, trustServerCertificate: false },
  };

  try {
    const pool = await sql.connect(config);
    const result = await pool
      .request()
      .input("id", sql.Int, id)
      .query("SELECT * FROM solicitudes WHERE id = @id");
    return result.recordset[0];
  } catch (error) {
    console.error(error);
    return null;
  }
}

export default async function SolicitudDetalle({ params }) {
  const { id } = await params;
  const solicitud = await getSolicitud(id);

  if (!solicitud) {
    return <div className="p-10 text-[#1f4d3a] font-bold">Solicitud no encontrada</div>;
  }

  return (
    <div className="max-w-6xl mx-auto p-6 md:p-10">
      
      {/* NAVEGACIÓN SUPERIOR (Tu estilo original) */}
      <div className="flex justify-between items-center mb-8">
        <Link
          href="/admin/solicitudes"
          className="flex items-center gap-2 text-[#1f4d3a] font-semibold hover:text-[#c8a96a] transition group"
        >
          <ArrowLeftIcon className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          Volver a Solicitudes
        </Link>
        <button className="bg-white border border-[#d8d2c7] text-[#1f4d3a] px-4 py-2 rounded-xl text-sm font-bold hover:bg-gray-50 transition">
          Exportar Ficha
        </button>
      </div>

      {/* HEADER DE SOLICITUD (El bloque verde que te gustaba) */}
      <div className="bg-[#1f4d3a] rounded-t-[2rem] p-8 md:p-10 text-white shadow-lg border-b border-[#c8a96a]/30">
        <div className="flex flex-col md:flex-row justify-between gap-6">
          <div>
            <span className="bg-[#c8a96a] text-[#1f4d3a] px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-4 inline-block">
              Ficha del Ticket • {solicitud.codigo_ticket || `KLIN-${solicitud.id.toString().padStart(4, '0')}`}
            </span>
            <h1 className="text-3xl md:text-4xl font-bold mb-2 tracking-tight">{solicitud.nombre}</h1>
            <p className="text-white/70 text-lg font-medium">{solicitud.empresa || "Cliente Particular"}</p>
          </div>
          <div className="flex flex-col items-end gap-3">
            <StatusBadge estado={solicitud.estado} />
            <p className="text-xs text-white/50 italic">
              Recibido el {new Date(solicitud.fecha_creacion).toLocaleDateString("es-CL", { dateStyle: 'long' })}
            </p>
          </div>
        </div>
      </div>

      {/* CUERPO DE LA VISTA (Tu Grid Original) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
        
        <div className="lg:col-span-2 space-y-8">
          {/* MENSAJE ORIGINAL */}
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-[#ece7dc]">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-[#faf8f3] rounded-lg text-[#1f4d3a]">
                <ClipboardDocumentCheckIcon className="w-6 h-6" />
              </div>
              <h2 className="text-xl font-bold text-[#1f4d3a]">Requerimiento del Cliente</h2>
            </div>
            <p className="text-gray-700 leading-relaxed bg-[#faf8f3] p-6 rounded-2xl border border-[#f1ede4] whitespace-pre-line font-medium">
              {solicitud.mensaje || "El cliente no adjuntó un mensaje detallado."}
            </p>
          </div>

          {/* BITÁCORA OPERATIVA */}
          <div className="bg-white rounded-3xl shadow-sm border border-[#ece7dc] overflow-hidden">
            <div className="border-b border-[#ece7dc] px-8 py-4 bg-[#faf8f3] flex justify-between items-center">
              <span className="text-[#1f4d3a] font-bold text-sm uppercase tracking-wider">Bitácora Operativa</span>
              <EstadoSelect solicitudId={solicitud.id} estadoActual={solicitud.estado} />
            </div>
            <div className="p-8">
              <SolicitudNotas
                solicitudId={solicitud.id}
                notasIniciales={solicitud.notas}
                estadoActual={solicitud.estado}
              />
            </div>
          </div>
        </div>

        {/* COLUMNA LATERAL (Minimalista) */}
        <div className="space-y-8">
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-[#ece7dc]">
            <h3 className="text-[#1f4d3a] font-bold mb-4 flex items-center gap-2">
              <ClockIcon className="w-5 h-5 text-[#c8a96a]" />
              Datos de Contacto
            </h3>
            <div className="space-y-4 text-sm font-medium">
              <div className="pb-3 border-b border-[#f1ede4]">
                <p className="text-gray-400 text-[10px] uppercase font-bold tracking-wider">Teléfono</p>
                <p className="text-[#1f4d3a] font-semibold mt-1">{solicitud.telefono}</p>
              </div>
              <div className="pb-3 border-b border-[#f1ede4]">
                <p className="text-gray-400 text-[10px] uppercase font-bold tracking-wider">Email</p>
                <p className="text-[#1f4d3a] font-semibold mt-1 truncate">{solicitud.email}</p>
              </div>
              <div>
                <p className="text-gray-400 text-[10px] uppercase font-bold tracking-wider">Servicio solicitado</p>
                <p className="text-[#c8a96a] font-bold mt-1 uppercase">{solicitud.servicio}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 shadow-sm border border-[#ece7dc]">
            <h3 className="text-[#1f4d3a] font-bold mb-4 flex items-center gap-2">
              <PaperClipIcon className="w-5 h-5 text-[#c8a96a]" />
              Documentación
            </h3>
            <div className="text-center py-8 border-2 border-dashed border-[#d8d2c7] rounded-2xl hover:bg-[#faf8f3] transition cursor-pointer group">
              <PaperClipIcon className="w-8 h-8 text-gray-300 mx-auto group-hover:text-[#c8a96a] transition" />
              <p className="text-xs text-gray-400 mt-2 font-medium">No hay archivos adjuntos</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}