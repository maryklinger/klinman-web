"use client";

import { useRouter } from "next/navigation";

export default function EstadoSelect({
  solicitudId,
  estadoActual,
}) {

  const router = useRouter();

  async function cambiarEstado(nuevoEstado) {

    try {

      console.log("Actualizando:", solicitudId);

      const res = await fetch(
        `/api/solicitudes/${solicitudId}`,
        {
          method: "PATCH",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            estado: nuevoEstado,
          }),
        }
      );

      const data = await res.json();

      console.log(data);

      if (data.success) {

        router.refresh();

      } else {

        alert("Error al actualizar");

      }

    } catch (error) {

      console.error(error);

      alert("Error del servidor");

    }
  }

  return (

    <select
      value={estadoActual}
      onChange={(e) =>
        cambiarEstado(e.target.value)
      }
        className="border border-[#d8d2c7] bg-white rounded-xl px-3 py-2 text-sm outline-none"
        >

      <option value="Pendiente">
        Pendiente
      </option>

      <option value="En revisión">
        En revisión
      </option>

      <option value="Finalizado">
        Finalizado
      </option>

      <option value="Cancelado">
        Cancelado
      </option>

    </select>

  );
}