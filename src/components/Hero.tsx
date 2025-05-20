import React, { useEffect, useState } from 'react';

const Hero: React.FC = () => {
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    // Pre-carga la imagen antes de renderizarla como fondo
    const img = new Image();
    img.src = "https://i.ibb.co/1TLW24f/ctp-m.webp";
    img.onload = () => setImageLoaded(true);
  }, []);

  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* Placeholder mientras la imagen carga */}
      {!imageLoaded && (
        <div
          className="absolute top-0 left-0 w-full h-full bg-gray-900"
          aria-hidden="true"
        ></div>
      )}

      {/* Imagen de fondo, mostrada sin efecto de transición */}
      {imageLoaded && (
        <div
          className="absolute top-0 left-0 w-full h-full bg-cover bg-center"
          style={{
            backgroundImage: `url("https://i.ibb.co/sJqhM07s/ctp-m.webp")`,
          }}
          aria-hidden="true"
        ></div>
      )}

      {/* Capa de degradado */}
      <div className="absolute inset-0 bg-gradient-to-b from-darkBlue/70 via-darkBlue/50 to-darkBlue/70"></div>

      {/* Contenido del Hero */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-6 md:px-12">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-white font-playfair tracking-wide">
          Colegio Técnico Profesional
        </h1>
        <h2 className="mt-2 text-3xl md:text-4xl lg:text-5xl font-semibold text-white">
          La Mansión
        </h2>
        <p className="mt-4 text-base md:text-lg text-gray-200 font-light max-w-xl px-4">
          En el CTP la Mansión trabajamos para ser mejores cada día.
        </p>
        <div className="mt-8 h-1 w-1/2 bg-gradient-to-r from-[#34436B] to-[#1D2238] rounded-full"></div>
      </div>
    </div>
  );
};

export default Hero;
