import Navbar from './Navbar';
import Footer from './Footer';
import { useSpecialities } from '../hooks/useSpecialities';
import 'aos/dist/aos.css';
import { useEffect, useState } from 'react';
import AOS from 'aos';

// Interfaz del tipo Speciality
interface Speciality {
  id: number; // Match the type from the imported Speciality type
  title: string;
  description: string;
  url_Image?: string;
  url_Details?: string;
}

const SpecialitySections = () => {
  const { specialities, loading, error } = useSpecialities();

  // Estado para manejar el modal
  const [modalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState<string | null>(null);

  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto px-5 py-24">
        {/* Skeleton para carga */}
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

  if (error) return <p className="text-red-500 text-center">{error}</p>;

  const handleOpenModal = (content: string) => {
    setModalContent(content);
    setModalOpen(true);
  };

  return (
    <>
      <Navbar />
      <section className="text-gray-700 body-font bg-gray-50 py-24 pt-24">
        <div className="container mx-auto px-5">
          <h2 className="relative text-5xl font-bold text-center mb-12 text-transparent bg-clip-text bg-gradient-to-r from-[#34436B] to-[#B0C7E4]">
            Nuestras Especialidades
            <span className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-1/2 h-1 bg-gradient-to-r from-[#13152A] via-[#4A6FA5] to-[#B0C7E4] mx-auto mt-1 rounded-full"></span>
          </h2>

          {specialities.map((speciality: Speciality, index: number) => (
            <div
              key={speciality.id}
              data-aos="fade-up"
              className={`flex flex-col ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                } items-center justify-between mb-16 p-8 bg-white rounded-lg`}
            >
              {/* Imagen de la especialidad - solo si existe */}
              {speciality.url_Image && (
                <div className="md:w-1/2 w-full h-80">
                  <img
                    className="w-full h-full object-cover rounded-lg"
                    src={speciality.url_Image}
                    alt={speciality.title}
                  />
                </div>
              )}

              {/* Contenido textual - ancho dinámico según si hay imagen */}
              <div className={`${speciality.url_Image ? 'md:w-1/2' : 'md:w-full'} w-full p-8`}>
                <h3 className="text-3xl font-bold text-gray-800 mb-4">
                  {speciality.title}
                </h3>
                <p className="text-lg text-gray-600 leading-relaxed mb-6 text-justify">
                  {speciality.description}
                </p>
                {speciality.url_Details && (
                  <button
                    onClick={() => handleOpenModal(speciality.url_Details as string)}
                    className="inline-block bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition duration-300"
                  >
                    Ver más detalles
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Modal para mostrar el contenido */}
      {modalOpen && modalContent && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 cursor-pointer"
          onClick={() => setModalOpen(false)}
        >
          <div
            className="relative bg-white rounded-lg max-w-4xl w-full mx-4 max-h-[90vh] overflow-auto cursor-auto p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              title="Cerrar"
              aria-label="Cerrar modal"
              className="absolute top-4 right-4 text-gray-600 hover:text-gray-800 z-10"
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

            {/* Contenido dinámico basado en el tipo de URL */}
            {modalContent.match(/\.(jpeg|jpg|gif|png|webp)$/) ? (
              <img
                src={modalContent}
                alt="Detalle de la especialidad"
                className="w-full h-auto rounded-lg"
              />
            ) : (
              <iframe 
                src={modalContent} 
                className="w-full h-[70vh] border-0"
                title="Detalles de la especialidad"
                allowFullScreen
              />
            )}
          </div>
        </div>
      )}

      <Footer />
    </>
  );
};

export default SpecialitySections;