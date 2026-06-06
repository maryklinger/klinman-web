"use client";
import { useState } from 'react';
import { StarIcon } from "@heroicons/react/24/solid";

export default function PaginaCalificacion({ params }) {
  const [calificacion, setCalificacion] = useState(0);
  const [comentario, setComentario] = useState("");

  const enviarFeedback = async () => {
    const res = await fetch('/api/feedback', {
      method: 'POST',
      body: JSON.stringify({ ticket_id: params.id, calificacion, comentario })
    });
    if (res.ok) alert("¡Gracias por su opinión!");
  };

  return (
    <div className="min-h-screen bg-[#f8f5ef] flex items-center justify-center p-6">
      <div className="bg-white p-12 rounded-[2rem] shadow-xl max-w-md w-full border border-[#ece7dc]">
        <h1 className="text-2xl font-black uppercase text-[#1f4d3a] mb-6">¿Qué tal estuvo el servicio?</h1>
        
        {/* Selector de estrellas */}
        <div className="flex gap-2 mb-8">
          {[1, 2, 3, 4, 5].map((s) => (
            <StarIcon 
              key={s} 
              className={`w-10 h-10 cursor-pointer ${s <= calificacion ? "text-[#c8a96a]" : "text-gray-200"}`}
              onClick={() => setCalificacion(s)}
            />
          ))}
        </div>

        <textarea 
          className="w-full bg-[#f8f5ef] p-4 rounded-xl mb-6 outline-none"
          placeholder="Cuéntanos tu experiencia..."
          onChange={(e) => setComentario(e.target.value)}
        />
        
        <button 
          onClick={enviarFeedback}
          className="w-full bg-[#1f4d3a] text-white py-4 rounded-2xl font-black uppercase"
        >
          Enviar Calificación
        </button>
      </div>
    </div>
  );
}