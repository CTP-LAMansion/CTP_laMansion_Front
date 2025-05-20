import React from 'react';

const NotFound: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-200 text-darkBlue px-4">
      {/* Logo */}
      <img
        src="https://i.ibb.co/DDgrWtG7/CTPmnsn.webp"
        alt="Logo Institucional"
        className="w-40 h-40 md:w-60 md:h-60 mb-8"
      />

      {/* Mensaje principal */}
      <h1 className="text-4xl md:text-6xl font-bold mb-4 animate-bounce">404</h1>
      <h2 className="text-2xl md:text-3xl font-semibold mb-6 text-gray-900">
        Página no encontrada
      </h2>
      <p className="text-lg md:text-xl text-center max-w-lg mb-8">
        Lo sentimos, pero la página que estás buscando no existe.
      </p>

      {/* Botón de regreso */}
      <a
        href="/"
        className="px-6 py-3 bg-white text-blue-900 font-semibold rounded-lg shadow-lg hover:bg-gray-100 hover:shadow-xl transition duration-300"
      >
        Volver al Inicio
      </a>
    </div>
  );
};

export default NotFound;
