'use client';

import { useState } from "react";
import toast from "react-hot-toast";

export default function SolicitudNotas({
  solicitudId,
  notasIniciales,
  estadoActual
}) {

  const [notas, setNotas] = useState(
    notasIniciales || ""
  );

  const [loading, setLoading] = useState(false);

  const guardarNotas = async () => {

    try {

      setLoading(true);

      // Importante: Tu base de datos usa nvarchar(max) para notas
      const res = await fetch(
        `/api/solicitudes/${solicitudId}`,
        {
          method: "PATCH",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            estado: estadoActual,
            notas,
          }),
        }
      );

      const result = await res.json();

      if (result.success) {

        toast.success(
          "Notas guardadas correctamente"
        );

      } else {

        toast.error(
          "No se pudieron guardar las notas"
        );

      }

    } catch (error) {

      console.error(error);

      toast.error(
        "Error de conexión con el servidor"
      );

    } finally {

      setLoading(false);

    }
  };

  return (

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
        Notas internas
      </h2>

      <textarea
        value={notas}
        onChange={(e) =>
          setNotas(e.target.value)
        }
        placeholder="Agregar notas internas..."
        className="
          w-full
          border
          border-[#d8d2c7]
          rounded-2xl
          p-4
          outline-none
          focus:border-[#c8a96a]
        "
        rows={6}
      />

      <button
        onClick={guardarNotas}
        disabled={loading}
        className="
          mt-4
          bg-[#1f4d3a]
          text-white
          px-5
          py-3
          rounded-xl
          hover:bg-[#16382b]
          transition
          disabled:opacity-50
        "
      >

        {
          loading
            ? "Guardando..."
            : "Guardar notas"
        }

      </button>

    </div>
  );
}