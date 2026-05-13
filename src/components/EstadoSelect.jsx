"use client";

import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

import {
  actualizarEstado
} from "../app/admin/actions";

export default function EstadoSelect({
  solicitudId,
  estadoActual
}) {

  const router = useRouter();

  async function cambiarEstado(e) {

    const nuevoEstado = e.target.value;

    try {

      const result = await actualizarEstado(
        solicitudId,
        nuevoEstado
      );

      if (result.success) {

        toast.success(
          "Estado actualizado correctamente",
          {
            style: {
              border: "1px solid #166534",
              padding: "16px",
              color: "#ffffff",
            },
            iconTheme: {
              primary: "#166534",
              secondary: "#ffffff",
            },
          }
        );

        router.refresh();

      } else {

        toast.error(
          result.error || "No se pudo actualizar el estado",
          {
            style: {
              border: "1px solid #991b1b",
              padding: "16px",
              color: "#991b1b",
            },
            iconTheme: {
              primary: "#991b1b",
              secondary: "#ffffff",
            },
          }
        );

      }

    } catch (error) {

      console.error(error);

      toast.error(
        "Error de conexión con el servidor",
        {
          style: {
            border: "1px solid #991b1b",
            padding: "16px",
            color: "#991b1b",
          },
          iconTheme: {
            primary: "#991b1b",
            secondary: "#ffffff",
          },
        }
      );

    }

  }

  return (

    <select
      defaultValue={estadoActual}
      onChange={cambiarEstado}
      className="
        border
        border-[#d8d2c7]
        bg-white
        rounded-xl
        px-3
        py-2
        text-sm
        outline-none
        focus:border-[#c8a96a]
      "
    >

      <option value="pendiente">
        Pendiente
      </option>

      <option value="en revisión">
        En revisión
      </option>

      <option value="finalizado">
        Finalizado
      </option>

    </select>

  );
}