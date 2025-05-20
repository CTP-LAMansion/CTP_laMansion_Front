import { useState, useCallback, useEffect, useRef } from 'react';
import useGallery from '../hooks/useGalleries';
import { Gallery as GalleryType } from '../types/Types';

const GallerySkeleton = () => {
  return (
    <div className="my-10 w-full px-4">
      <h2 className="text-4xl font-extrabold text-center text-[#34436B] mb-2 relative">
        ¡Explora Nuestra Galería del Colegio!
        <div className="w-3/4 h-1 bg-gradient-to-r from-[#13152A] via-[#4A6FA5] to-[#B0C7E4] mx-auto mt-1 rounded-full"></div>
      </h2>

      <div className="flex flex-col gap-8">
        <div className="flex overflow-x-hidden space-x-4 p-4 animate-pulse">
          {Array.from({ length: 5 }).map((_, index) => (
            <div
              key={index}
              className="flex-none w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/5 h-64 sm:h-72 md:h-80 bg-gray-300 rounded-lg"
            ></div>
          ))}
        </div>
      </div>
    </div>
  );
};

export function Gallery() {
  const { galleries, loading: apiLoading, error } = useGallery();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Referencias para controlar las animaciones
  const galleryContainerRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Duplicar las imágenes 5 veces para asegurar un efecto infinito más fluido
  const duplicatedGalleries = [...galleries, ...galleries, ...galleries, ...galleries, ...galleries];

  // Combinar carga de API con simulación de carga
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (!apiLoading) {
        setLoading(false);
      }
    }, 1000);

    return () => clearTimeout(timeout);
  }, [apiLoading]);
  
  // Efecto para el carrusel infinito
  useEffect(() => {
    if (!loading && !apiLoading && containerRef.current && galleries.length > 0) {
      // Comienza con todas las imágenes ya desplazadas a la mitad para poder ir en cualquier dirección
      const container = containerRef.current;
      const scrollWidth = container.scrollWidth;
      const initialPosition = (scrollWidth / duplicatedGalleries.length) * galleries.length;
      container.scrollLeft = initialPosition;
      
      // Esta función se asegura de que cuando lleguemos cerca del final, saltemos al centro sin que se note
      const checkInfiniteScroll = () => {
        const container = containerRef.current;
        if (!container) return;
        
        if (container.scrollLeft < scrollWidth * 0.2) {
          // Si está cerca del principio, salta al medio sin animación
          container.style.scrollBehavior = 'auto';
          container.scrollLeft += scrollWidth * 0.4;
          container.style.scrollBehavior = 'smooth';
        } 
        else if (container.scrollLeft > scrollWidth * 0.8) {
          // Si está cerca del final, salta al medio sin animación
          container.style.scrollBehavior = 'auto';
          container.scrollLeft -= scrollWidth * 0.4;
          container.style.scrollBehavior = 'smooth';
        }
      };
      
      // Verificar periódicamente la posición del scroll
      const intervalId = setInterval(checkInfiniteScroll, 1000);
      return () => clearInterval(intervalId);
    }
  }, [loading, apiLoading, galleries.length, duplicatedGalleries.length]);

  // Open modal with selected image
  const openModal = useCallback((imageSrc: string) => {
    setSelectedImage(imageSrc);
    setIsModalOpen(true);
  }, []);

  // Close modal handler
  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    setSelectedImage(null);
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isModalOpen) {
        closeModal();
      }
    };

    if (isModalOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isModalOpen, closeModal]);

  if (loading || apiLoading) {
    return <GallerySkeleton />;
  }

  if (error) {
    return (
      <div className="my-10 w-full px-4 text-center">
        <h2 className="text-4xl font-extrabold text-[#34436B] mb-4">
          ¡Oops!
        </h2>
        <p className="text-lg text-gray-700">
          No pudimos cargar las imágenes de la galería. Por favor, intenta nuevamente más tarde.
        </p>
      </div>
    );
  }

  if (galleries.length === 0) {
    return (
      <div className="my-10 w-full px-4 text-center">
        <h2 className="text-4xl font-extrabold text-[#34436B] mb-4">
          ¡Galería del Colegio!
        </h2>
        <p className="text-lg text-gray-700">
          Aún no hay imágenes disponibles en nuestra galería.
        </p>
      </div>
    );
  }

  return (
    <div className="my-10 w-full px-4">
      <h2 className="text-4xl font-extrabold text-center text-[#34436B] mb-10 relative">
        ¡Explora Nuestra Galería del Colegio!
        <span className="absolute left-1/2 transform -translate-x-1/2 -bottom-3 h-1 w-4/5 bg-gradient-to-r from-[#13152A] via-[#4A6FA5] to-[#B0C7E4] rounded-md"></span>
      </h2>

      <div
        ref={galleryContainerRef}
        className="flex flex-col gap-8 gallery-container"
      >
        {/* Fila única - Se mueve hacia la izquierda */}
        <div 
          className="relative overflow-hidden py-10 px-4" 
          ref={containerRef}
        >
          <div
            className="flex gallery-row-left"
            style={{
              width: `${duplicatedGalleries.length * 300}px`,
            }}
          >
            {duplicatedGalleries.map((image: GalleryType, index) => (
              <div
                key={`gallery-${index}`}
                className="flex-none w-72 sm:w-80 mx-2 cursor-pointer relative group transform transition-all duration-500 hover:scale-110"
                onClick={() => openModal(image.url_Image)}
              >
                <div className="overflow-hidden rounded-lg shadow-md group-hover:shadow-xl group-hover:shadow-darkBlue/40 transition-all duration-500 group-hover:z-10">
                  <img
                    src={image.url_Image}
                    alt={`Imagen de galería ${index + 1}`}
                    className="object-cover w-full h-64 sm:h-72 md:h-80 rounded-lg transition-all duration-500 ease-in-out group-hover:brightness-110"
                    loading="lazy"
                  />
                </div>
                {/* Sutil efecto de brillo/highlight en hover */}
                <div className="absolute inset-0 bg-gradient-to-b from-[#4A6FA5]/10 via-transparent to-darkBlue/30 opacity-0 group-hover:opacity-100 rounded-lg transition-all duration-500 z-0 group-hover:z-10"></div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Nuevo botón animado */}
      <div className="flex justify-center mt-14 mb-12">
        <button
          type="button"
          className="relative bottom-0 flex justify-center items-center gap-2 border border-[#13152A] rounded-xl text-[#FFF] font-black bg-[#13152A] uppercase px-8 py-4 z-10 overflow-hidden ease-in-out duration-700 group hover:text-[#13152A] hover:bg-[#FFF] active:scale-95 active:duration-0 focus:bg-[#FFF] focus:text-[#13152A] isolation-auto before:absolute before:w-full before:transition-all before:duration-700 before:hover:w-full before:-left-full before:hover:left-0 before:rounded-full before:bg-[#FFF] before:-z-10 before:aspect-square before:hover:scale-150 before:hover:duration-700"
          onClick={() => window.location.href = "/gallery"}
        >
          <span className="truncate ease-in-out duration-300 group-active:-translate-x-96 group-focus:translate-x-96">
            Ver Más Fotos
          </span>

          <div className="absolute flex flex-row justify-center items-center gap-2 -translate-x-96 ease-in-out duration-300 group-active:translate-x-0 group-focus:translate-x-0">
            <div className="animate-spin size-4 border-2 border-[#13152A] border-t-transparent rounded-full"></div>
            Explorando...
          </div>

          <svg
            className="fill-[#FFF] group-hover:fill-[#13152A] group-hover:-translate-x-0 group-active:translate-x-96 group-active:duration-0 group-focus:translate-x-96 group-focus:fill-[#13152A] ease-in-out duration-700"
            stroke="currentColor"
            fill="currentColor"
            strokeWidth="0"
            viewBox="0 0 512 512"
            height="16"
            width="16"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="m476.59 227.05-.16-.07L49.35 49.84A23.56 23.56 0 0 0 27.14 52 24.65 24.65 0 0 0 16 72.59v113.29a24 24 0 0 0 19.52 23.57l232.93 43.07a4 4 0 0 1 0 7.86L35.53 303.45A24 24 0 0 0 16 327v113.31A23.57 23.57 0 0 0 26.59 460a23.94 23.94 0 0 0 13.22 4 24.55 24.55 0 0 0 9.52-1.93L476.4 285.94l.19-.09a32 32 0 0 0 0-58.8z"></path>
          </svg>
        </button>
      </div>


      {/* Modal de imagen */}
      {isModalOpen && selectedImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
          onClick={closeModal}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="relative bg-white p-4 rounded-lg max-w-3xl w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-2 right-2 text-black bg-white rounded-full p-1"
              onClick={closeModal}
              aria-label="Close modal"
            >
              &times;
            </button>
            <img
              src={selectedImage}
              alt="Imagen ampliada"
              className="max-w-full max-h-[80vh] rounded-lg mx-auto"
            />
          </div>
        </div>
      )}

      {/* Añadir estilos internos para una mejor gestión de las animaciones */}
      <style>{`
        .gallery-container:hover .gallery-row-left {
          animation-play-state: paused;
        }
        
        .gallery-row-left {
          animation: scrollLeft 80s linear infinite;
          transition: animation-play-state 1.5s ease;
        }
        
        @keyframes scrollLeft {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(calc(-100% / 5)); /* Desplaza una quinta parte del total */
          }
        }
        
        /* Sobrescribir z-index para asegurar que la imagen hover esté al frente */
        .group:hover {
          z-index: 20;
          position: relative;
        }
        
        /* Para compatibilidad con Tailwind */
        .size-4 {
          width: 1rem;
          height: 1rem;
        }
      `}</style>
    </div>
  );
}