"use client";

import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { actualizarPrioridad } from "../app/admin/actions"; 

export default function PrioridadSelect({ solicitudId, prioridadActual }) {
  const router = useRouter();

  async function cambiarPrioridad(e) {
    const nuevaPrioridad = e.target.value;

    try {
      const result = await actualizarPrioridad(solicitudId, nuevaPrioridad);

      if (result.success) {
        toast.success("Prioridad actualizada correctamente", {
          style: {
            background: "#1f4d3a", // El verde oscuro de tu header y cards
            color: "#ffffff",      // Texto blanco para que sea legible
            border: "1px solid #c8a96a", // Borde dorado Klinman
            padding: "16px",
            borderRadius: "12px",
          },
          iconTheme: {
            primary: "#ffffff",
            secondary: "#1f4d3a",
          },
        });

        router.refresh();
      } else {
        toast.error(result.error || "No se pudo actualizar la prioridad", {
          style: {
            background: "#991b1b",
            color: "#ffffff",
            padding: "16px",
            borderRadius: "12px",
          },
        });
      }
    } catch (error) {
      console.error(error);
      toast.error("Error de conexión con el servidor", {
        style: {
          background: "#991b1b",
          color: "#ffffff",
          padding: "16px",
        },
      });
    }
  }

  return (
    <select
      defaultValue={prioridadActual}
      onChange={cambiarPrioridad}
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
        cursor-pointer
        hover:bg-[#faf8f3]
        transition-colors
      "
    >
      <option value="Alta">Alta</option>
      <option value="Media">Media</option>
      <option value="Baja">Baja</option>
    </select>
  );
}