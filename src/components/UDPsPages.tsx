import React, { useEffect, useState } from 'react';
import { UDP } from '../types/Types';
import { getUDPs } from '../services/udpService';
import Navbar from './Navbar';
import Footer from './Footer';
import 'aos/dist/aos.css'; // Librería de animaciones AOS
import AOS from 'aos'; // Inicialización de AOS
import { FaUser, FaPhone, FaEnvelope } from 'react-icons/fa'; // Iconos de react-icons

const UDPsPage: React.FC = () => {
  const [udps, setUdps] = useState<UDP[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Estados para el modal
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedUDP] = useState<UDP | null>(null);

  // Obtener las UDPs al cargar la página
  useEffect(() => {
    const fetchUDPs = async () => {
      try {
        const data = await getUDPs();
        setUdps(data);
        setLoading(false);
      } catch (error) {
        setError('Error al obtener las UDPs');
        setLoading(false);
      }
    };
    fetchUDPs();
  }, []);

  // Inicializar AOS para animaciones
  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto px-5 py-24">
        {/* Skeletons para el estado de carga */}
        {[1, 2, 3].map((skeletonIndex) => (
          <div
            key={skeletonIndex}
            className="flex flex-col md:flex-row items-center justify-between mb-16 p-8 bg-gray-100 rounded-lg animate-pulse"
          >
            <div className="md:w-1/2 w-full h-96 bg-gray-300 rounded-lg"></div>
            <div className="md:w-1/2 w-full p-8 space-y-4">
              <div className="h-8 w-3/4 bg-gray-300 rounded-md"></div>
              <div className="h-6 w-full bg-gray-300 rounded-md"></div>
              <div className="h-6 w-5/6 bg-gray-300 rounded-md"></div>
              <div className="h-6 w-2/3 bg-gray-300 rounded-md"></div>
              <div className="h-10 w-1/3 bg-green-400 rounded-lg"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) return <p>{error}</p>;

  return (
    <>
      <Navbar />
      {/* Agregamos un padding-top para evitar que el contenido quede detrás del navbar */}
      <section className="text-gray-700 body-font bg-gray-50 py-24 pt-24">
        <div className="container mx-auto px-5">
          {/* Título */}
          <h2 className="relative text-5xl font-bold text-center mb-12 text-transparent bg-clip-text bg-gradient-to-r bg-[#34436B]">
            Nuestras UDPs
            <span className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-1/2 h-1 bg-gradient-to-r from-[#13152A] via-[#4A6FA5] to-[#B0C7E4] mx-auto mt-1 rounded-full"></span>
            </h2>

          {udps.map((udp, index) => (
            <div
              key={udp.id_UDP}
              data-aos="fade-up" // Animación AOS
              className={`flex flex-col ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                } items-center justify-between mb-16 p-8 bg-white rounded-lg`}
            >
              {/* Imagen de la UDP (puedes reemplazar con una imagen real) */}
              <div className="md:w-1/2 w-full h-80">
                <img
                  className="w-full h-full object-cover rounded-lg"
                  src="https://via.placeholder.com/600x400" // Imagen de placeholder
                  alt={udp.title}
                />
              </div>

              {/* Contenido textual */}
              <div className="md:w-1/2 w-full p-8">
                <h3 className="text-3xl font-bold text-gray-800 mb-4">
                  {udp.title}
                </h3>
                <p className="text-lg text-gray-600 leading-relaxed mb-6 text-justify">
                  {udp.description}
                </p>

                {/* Apartado de "Contáctanos" */}
                <div className="bg-gray-100 p-6 rounded-lg">
                  <h4 className="text-xl font-semibold text-gray-800 mb-4">Contáctanos</h4>
                  <strong className='text-gray-950 bold'>Encargado</strong>
                  <div className="flex items-center space-x-2 mb-2">
                    <FaUser className="text-gray-600" />
                    <p className="text-gray-600">
                      <span className="font-medium">Nombre:</span> {udp.userName} {udp.userLastName} {udp.userLastName2}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2 mb-2">
                    <FaPhone className="text-gray-600" />
                    <p className="text-gray-600">
                      <span className="font-medium">Teléfono:</span> {udp.userphoneNumber}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <FaEnvelope className="text-gray-600" />
                    <p className="text-gray-600 break-words max-w-full">
                      <span className="font-medium">Email:</span> {udp.useremail}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Modal para mostrar detalles de la UDP */}
      {modalOpen && selectedUDP && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 cursor-pointer"
          onClick={() => setModalOpen(false)}
        >
          <div
            className="relative bg-white rounded-lg max-w-2xl w-full mx-4 p-6 cursor-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Botón de cerrar con una "X" */}
            <button
              title="Close"
              className="absolute top-4 right-4 text-gray-600 hover:text-gray-800"
              onClick={() => setModalOpen(false)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
            {/* Contenido del modal */}
            <h3 className="text-2xl font-bold text-gray-800 mb-4">
              {selectedUDP.title}
            </h3>
            <p className="text-lg text-gray-600 leading-relaxed mb-6 text-justify">
              {selectedUDP.description}
            </p>
            {/* Apartado de "Contáctanos" en el modal */}
            <div className="bg-gray-100 p-6 rounded-lg">
              <h4 className="text-xl font-semibold text-gray-800 mb-4">Contáctanos</h4>
              <div className="flex items-center space-x-2 mb-2">
                <FaUser className="text-gray-600" />
                <p className="text-gray-600">
                  <span className="font-medium">Nombre:</span> {selectedUDP.userName} {selectedUDP.userLastName} {selectedUDP.userLastName2}
                </p>
              </div>
              <div className="flex items-center space-x-2 mb-2">
                <FaPhone className="text-gray-600" />
                <p className="text-gray-600">
                  <span className="font-medium">Teléfono:</span> {selectedUDP.userphoneNumber}
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <FaEnvelope className="text-gray-600" />
                <p className="text-gray-600 break-words max-w-full">
                  <span className="font-medium">Email:</span> {selectedUDP.useremail}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
};

export default UDPsPage;