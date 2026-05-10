export default function StatusBadge({ estado }) {

  const styles = {

    Pendiente:
      "bg-[#f4ead7] text-[#8a6a2f]",

    "En revisión":
      "bg-[#dce8e2] text-[#1f4d3a]",

    Aprobado:
      "bg-[#dce8e2] text-[#1f4d3a]",

    Finalizado:
      "bg-[#1f4d3a] text-white",

    Cancelado:
      "bg-[#ececec] text-gray-600",
  };

  return (

    <span className={`
      px-3
      py-1
      rounded-full
      text-sm
      font-medium
      ${styles[estado] || "bg-gray-100 text-gray-700"}
    `}>

      {estado}

    </span>

  );
}