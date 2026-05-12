"use client";

import { useState } from "react";

export default function NotasInternas({
  solicitudId,
  notasIniciales
}) {

  const [notas, setNotas] = useState(
    notasIniciales || ""
  );

  const [guardando, setGuardando] =
    useState(false);

  const [mensaje, setMensaje] =
    useState("");

  const [tipoMensaje, setTipoMensaje] =
    useState("");

  async function guardarNotas() {

    try {

      setGuardando(true);

      const res = await fetch(
        `/api/notas/${solicitudId}`,
        {
          method: "PATCH",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            notas,
          }),
        }
      );

      const data = await res.json();

      if (data.success) {

        setMensaje("Notas guardadas correctamente");
        setTipoMensaje("success");

      } else {

        setMensaje("No se pudieron guardar las notas");
        setTipoMensaje("error");
      }

    } catch (error) {

      console.error(error);

      setMensaje("Error de conexión con el servidor");
      setTipoMensaje("error");

    } finally {

      setGuardando(false);
    }
  }

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
        className="
          w-full
          min-h-[180px]
          border
          border-[#d8d2c7]
          rounded-2xl
          p-4
          outline-none
          bg-white
        "
        placeholder="
          Agregar seguimiento interno...
        "
      />

      <button
        onClick={guardarNotas}
        disabled={guardando}
        className="
          mt-4
          bg-[#1f4d3a]
          text-white
          px-6
          py-3
          rounded-2xl
          hover:bg-[#16382b]
          transition
        "
      >

        {
          guardando
            ? "Guardando..."
            : "Guardar notas"
        }

      </button>
      {
        mensaje && (

            <div
            className={`
                mt-4
                px-4
                py-3
                rounded-2xl
                text-sm
                font-medium

                ${
                tipoMensaje === "success"
                    ? `
                    bg-green-100
                    text-green-700
                    border
                    border-green-200
                    `
                    : `
                    bg-red-100
                    text-red-700
                    border
                    border-red-200
                    `
                }
            `}
            >
            {mensaje}
            </div>

        )
        }



    </div>
  );
}