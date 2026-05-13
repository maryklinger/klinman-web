'use client';

import { 
  KeyIcon, 
  BoltIcon, 
  WrenchScrewdriverIcon, 
  ArrowRightIcon 
} from "@heroicons/react/24/outline";

export default function SelectProfile() {
  const perfiles = [
    {
      id: 'admin',
      titulo: 'Administrador',
      desc: 'Gestión estratégica, finanzas y control total de la plataforma.',
      // La llave representa el acceso maestro y la seguridad del sistema.
      icon: <KeyIcon className="w-8 h-8" />,
    },
    {
      id: 'supervisor',
      titulo: 'Supervisor de Terreno',
      desc: 'Validación de estándares de calidad y asignación de cuadrillas.',
      // El rayo representa la supervisión de servicios críticos y respuesta rápida.
      icon: <BoltIcon className="w-8 h-8" />,
    },
    {
      id: 'operador',
      titulo: 'Operador Técnico',
      desc: 'Registro de bitácora, protocolos y reportes de ejecución.',
      // Herramientas puras para la ejecución técnica en el activo.
      icon: <WrenchScrewdriverIcon className="w-8 h-8" />,
    }
  ];

  return (
    <main className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-white font-sans">
      {/* LADO IZQUIERDO: BRANDING INSTITUCIONAL */}
      <div className="bg-[#1f4d3a] flex flex-col justify-center items-center p-12 text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('/pattern.png')] bg-repeat"></div>
        <div className="relative z-10">
          <h1 className="text-white text-5xl font-bold mb-4 tracking-tight">Klinman</h1>
          <p className="text-[#c8a96a] text-lg tracking-[0.3em] uppercase font-light">
            Sistemas de Gestión de Activos
          </p>
          <div className="mt-12 text-white/40 text-sm font-medium">
            Seleccione su perfil técnico para continuar →
          </div>
        </div>
      </div>

      {/* LADO DERECHO: SELECTOR DE ACCESO */}
      <div className="flex flex-col justify-center p-8 md:p-20 bg-[#f8f5ef]">
        <div className="max-w-md mx-auto w-full">
          <h2 className="text-3xl font-bold text-[#1f4d3a] mb-2 text-center lg:text-left">¡Bienvenido!</h2>
          <p className="text-gray-500 mb-10 text-center lg:text-left">Por favor, seleccione su nivel de acceso operativo:</p>

          <div className="space-y-4">
            {perfiles.map((perfil) => (
              <button
                key={perfil.id}
                className="group w-full bg-white border border-[#ece7dc] p-6 rounded-[2rem] flex items-center gap-6 hover:border-[#c8a96a] hover:shadow-xl hover:shadow-green-900/5 transition-all text-left"
              >
                {/* Contenedor de Icono con el ADN de Klinman */}
                <div className="bg-[#faf8f3] text-[#1f4d3a] p-4 rounded-2xl group-hover:bg-[#1f4d3a] group-hover:text-[#c8a96a] transition-colors">
                  {perfil.icon}
                </div>
                
                <div className="flex-1">
                  <h3 className="font-bold text-[#1f4d3a] text-lg">{perfil.titulo}</h3>
                  <p className="text-sm text-gray-500 leading-snug">{perfil.desc}</p>
                </div>
                
                <ArrowRightIcon className="w-5 h-5 text-[#d8d2c7] group-hover:text-[#c8a96a] group-hover:translate-x-1 transition-all" />
              </button>
            ))}
          </div>

          <button className="w-full mt-12 text-gray-400 text-sm font-medium hover:text-[#1f4d3a] transition-colors uppercase tracking-widest">
            ¿Olvidó sus credenciales?
          </button>
        </div>
      </div>
    </main>
  );
}