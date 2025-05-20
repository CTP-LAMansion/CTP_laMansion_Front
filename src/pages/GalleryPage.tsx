import { useState, useCallback, useEffect, useRef } from 'react';
import useGallery from '../hooks/useGalleries';
import useCategories from '../hooks/useCategories';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Gallery as GalleryType } from '../types/Types';
import Masonry from 'react-masonry-css';
import AOS from 'aos';
import 'aos/dist/aos.css';

const GalleryPage = () => {
  // Estados para la galería
  const [, setSelectedCategory] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedImageTitle, setSelectedImageTitle] = useState<string>('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);
  
  // Refs para el scrolling horizontal de categorías
  const categoriesContainerRef = useRef<HTMLDivElement>(null);

  // Obtenemos datos de galería y categorías
  const { galleries, loading: loadingGalleries, fetchGalleries, fetchGalleriesByCategory } = useGallery();
  const { categories, loading: loadingCategories,  } = useCategories();
  
  // Inicializar AOS para animaciones
  useEffect(() => {
    AOS.init({ duration: 800, once: true });
    window.scrollTo(0, 0);
  }, []);

  // Verificar si mostrar flechas de navegación
  useEffect(() => {
    const checkScroll = () => {
      const container = categoriesContainerRef.current;
      if (!container) return;
      
      // Mostrar flecha izquierda solo si hay scroll hacia la izquierda
      setShowLeftArrow(container.scrollLeft > 20);
      
      // Mostrar flecha derecha solo si hay más contenido para scrollear
      setShowRightArrow(
        container.scrollLeft < container.scrollWidth - container.clientWidth - 20
      );
    };
    
    const container = categoriesContainerRef.current;
    if (container) {
      container.addEventListener('scroll', checkScroll);
      // Verificar inicialmente
      checkScroll();
      
      return () => container.removeEventListener('scroll', checkScroll);
    }
  }, [categories, loadingCategories]);

  // Filtrar categorías según el término de búsqueda
  const filteredCategories = categories.filter(category => 
    category.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Función para desplazar el contenedor de categorías horizontalmente
  const scrollCategories = (direction: 'left' | 'right') => {
    const container = categoriesContainerRef.current;
    if (container) {
      const scrollAmount = container.clientWidth * 0.8;
      if (direction === 'left') {
        container.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
      } else {
        container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      }
    }
  };

  // Soporte para navegación táctil/mouse
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setStartX(e.pageX - (categoriesContainerRef.current?.offsetLeft || 0));
    setScrollLeft(categoriesContainerRef.current?.scrollLeft || 0);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    setStartX(e.touches[0].pageX - (categoriesContainerRef.current?.offsetLeft || 0));
    setScrollLeft(categoriesContainerRef.current?.scrollLeft || 0);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - (categoriesContainerRef.current?.offsetLeft || 0);
    const walk = (x - startX) * 1.5; // Velocidad de scroll
    if (categoriesContainerRef.current)
      categoriesContainerRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    const x = e.touches[0].pageX - (categoriesContainerRef.current?.offsetLeft || 0);
    const walk = (x - startX) * 1.5;
    if (categoriesContainerRef.current)
      categoriesContainerRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleMouseUpOrLeave = () => {
    setIsDragging(false);
  };

  // Filtrar galerías por categoría
  const handleCategoryFilter = useCallback((categoryId: number | null) => {
    setSelectedCategory(categoryId);
    if (categoryId === null) {
      fetchGalleries();
      setActiveFilter('all');
    } else {
      fetchGalleriesByCategory(categoryId);
      setActiveFilter(categoryId.toString());
    }
    setIsCategoryModalOpen(false);
  }, [fetchGalleries, fetchGalleriesByCategory]);

  // Abrir modal con imagen seleccionada
  const openModal = useCallback((image: GalleryType) => {
    setSelectedImage(image.url_Image);
    setSelectedImageTitle(image.title);
    setIsModalOpen(true);
  }, []);

  // Cerrar modal
  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    setSelectedImage(null);
  }, []);

  // Configurar evento de teclado para cerrar modal con ESC
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (isModalOpen) {
          closeModal();
        }
        if (isCategoryModalOpen) {
          setIsCategoryModalOpen(false);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isModalOpen, closeModal, isCategoryModalOpen]);

  // Componente de carga
  const LoadingSkeleton = () => (
    <div className="container mx-auto px-4 py-16">
      <div className="flex justify-center mb-10">
        <div className="flex space-x-4 overflow-x-auto pb-4 animate-pulse">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-10 w-32 bg-gray-300 rounded-full"></div>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
          <div key={i} className="w-full h-64 bg-gray-300 rounded-lg animate-pulse"></div>
        ))}
      </div>
    </div>
  );

  // Breakpoints para el masonry
  const breakpointColumnsObj = {
    default: 4,
    1280: 3,
    1024: 3,
    768: 2,
    640: 1
  };

  return (
    <>
      <Navbar />
      <div className="bg-gray-50 min-h-screen pt-24">
        <div className="container mx-auto px-4 py-8">
          <h1 className="relative text-5xl font-bold text-center mb-12 text-transparent bg-clip-text bg-gradient-to-r bg-[#34436B]">
            Galería Institucional
            <span className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-1/2 h-1 bg-gradient-to-r from-[#13152A] via-[#4A6FA5] to-[#B0C7E4] mx-auto mt-1 rounded-full"></span>
          </h1>
          <p className="text-center text-gray-600 mb-10 max-w-3xl mx-auto">
            Explora los momentos más destacados de nuestra institución educativa a través de imágenes que capturan nuestra esencia.
          </p>

          {/* Filtros de categoría con carrusel mejorado y búsqueda destacada */}
          {loadingCategories ? (
            <div className="flex justify-center mb-10">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 animate-pulse">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="h-10 bg-gray-300 rounded-full"></div>
                ))}
              </div>
            </div>
          ) : (
            <div className="mb-10 relative px-6 md:px-12">
              {/* Botón de búsqueda destacado en posición superior */}
              <div className="flex justify-center mb-4">
                <button
                  onClick={() => setIsCategoryModalOpen(true)}
                  className="px-5 py-2.5 rounded-full font-medium transition-all duration-300 bg-[#13152A] text-white shadow-md hover:bg-[#34436B] flex items-center justify-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <span className="font-medium">Buscar Categorías</span>
                </button>
              </div>

              {/* Contenedor del carrusel con DOS FILAS y soporte para arrastre */}
              <div className="relative">
                {/* Flechas de navegación - perfectamente centradas entre las dos filas */}
                {showLeftArrow && (
                  <button 
                    onClick={() => scrollCategories('left')}
                    className="absolute left-0 top-[47px] transform -translate-y-1/2 bg-white rounded-full shadow-md p-2 z-20 hover:bg-gray-100 md:flex hidden"
                    aria-label="Ver categorías anteriores"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#34436B]" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </button>
                )}

                {showRightArrow && (
                  <button 
                    onClick={() => scrollCategories('right')}
                    className="absolute right-0 top-[47px] transform -translate-y-1/2 bg-white rounded-full shadow-md p-2 z-20 hover:bg-gray-100 md:flex hidden"
                    aria-label="Ver más categorías"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#34436B]" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                  </button>
                )}

                <div 
                  ref={categoriesContainerRef} 
                  className="overflow-x-auto scrollbar-hide pb-2"
                  style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                  onMouseDown={handleMouseDown}
                  onMouseMove={handleMouseMove}
                  onMouseUp={handleMouseUpOrLeave}
                  onMouseLeave={handleMouseUpOrLeave}
                  onTouchStart={handleTouchStart}
                  onTouchMove={handleTouchMove}
                  onTouchEnd={handleMouseUpOrLeave}
                >
                  {/* Organizador de dos filas */}
                  <div className="grid grid-rows-2 gap-y-2 auto-cols-max">
                    <div className="flex items-center space-x-2 min-w-max py-1">
                      <button
                        onClick={() => handleCategoryFilter(null)}
                        className={`px-4 py-2 rounded-full font-medium transition-all duration-300 whitespace-nowrap ${
                          activeFilter === 'all'
                            ? 'bg-[#13152A] text-white shadow-lg'
                            : 'bg-white text-gray-700 hover:bg-gray-100 shadow'
                        }`}
                      >
                        Todas
                      </button>
                      
                      {/* Primera mitad de categorías */}
                      {categories.slice(0, Math.ceil(categories.length / 2)).map((cat) => (
                        <button
                          key={cat.id_Category}
                          onClick={() => handleCategoryFilter(cat.id_Category)}
                          className={`px-4 py-2 rounded-full font-medium transition-all duration-300 whitespace-nowrap ${
                            activeFilter === cat.id_Category.toString()
                              ? 'bg-[#13152A] text-white shadow-lg'
                              : 'bg-white text-gray-700 hover:bg-gray-100 shadow'
                          }`}
                        >
                          {cat.name}
                        </button>
                      ))}
                    </div>
                    
                    {/* Segunda fila con el resto de categorías */}
                    <div className="flex items-center space-x-2 min-w-max py-1">
                      {/* Segunda mitad de categorías */}
                      {categories.slice(Math.ceil(categories.length / 2)).map((cat) => (
                        <button
                          key={cat.id_Category}
                          onClick={() => handleCategoryFilter(cat.id_Category)}
                          className={`px-4 py-2 rounded-full font-medium transition-all duration-300 whitespace-nowrap ${
                            activeFilter === cat.id_Category.toString()
                              ? 'bg-[#13152A] text-white shadow-lg'
                              : 'bg-white text-gray-700 hover:bg-gray-100 shadow'
                          }`}
                        >
                          {cat.name}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
                
                {/* Indicador visual de que hay más categorías */}
                {showRightArrow && (
                  <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-r from-transparent to-gray-50 pointer-events-none z-10"></div>
                )}
              </div>
            </div>
          )}

          {/* Galería principal */}
          {loadingGalleries ? (
            <LoadingSkeleton />
          ) : galleries.length === 0 ? (
            <div className="text-center py-16">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h14a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2z"
                />
              </svg>
              <h3 className="mt-2 text-xl font-medium text-gray-900">No hay imágenes disponibles</h3>
              <p className="mt-1 text-gray-500">
                No se encontraron imágenes en esta categoría.
              </p>
            </div>
          ) : (
            <Masonry
              breakpointCols={breakpointColumnsObj}
              className="flex w-auto -ml-4 -mr-4"
              columnClassName="pl-4 pr-4 mb-4"
            >
              {galleries.map((image, index) => (
                <div
                  key={`${image.id_Gallery}-${index}`}
                  className="mb-4"
                  data-aos="fade-up"
                  data-aos-delay={`${index % 5 * 100}`}
                >
                  <div
                    className="group relative overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer"
                    onClick={() => openModal(image)}
                  >
                    <img
                      src={image.url_Image}
                      alt={image.title}
                      className="w-full object-cover transform transition-transform duration-500 group-hover:scale-110"
                    />
                    {/* Hover condicional basado en si está filtrado por categoría o no */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                      <h3 className="text-white font-semibold text-lg">{image.title}</h3>
                      {/* Solo mostrar la categoría cuando se está mostrando "Todas" */}
                      {activeFilter === 'all' && image.category && (
                        <p className="text-gray-200 text-sm">{image.category.name}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </Masonry>
          )}
        </div>
      </div>

      {/* Modal de imagen */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center"
          onClick={closeModal}
        >
          <div 
            className="max-w-5xl w-full max-h-[90vh] relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={closeModal}
              className="absolute top-0 right-0 -mt-12 -mr-4 md:mr-0 text-white hover:text-gray-300 z-50"
              aria-label="Cerrar"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <div className="bg-transparent rounded-lg overflow-hidden">
              <div className="flex flex-col items-center">
                {selectedImage && (
                  <img 
                    src={selectedImage} 
                    alt={selectedImageTitle}
                    className="max-h-[75vh] object-contain mx-auto rounded shadow-lg"
                  />
                )}
                <div className="w-full text-center py-4">
                  <h2 className="text-xl md:text-2xl font-bold text-white">{selectedImageTitle}</h2>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de categorías mejorado */}
      {isCategoryModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-black bg-opacity-75 flex items-center justify-center"
          onClick={() => setIsCategoryModalOpen(false)}
        >
          <div
            className="bg-white rounded-xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-[#34436B]">Todas las categorías</h3>
              <button 
                onClick={() => setIsCategoryModalOpen(false)}
                className="text-gray-500 hover:text-gray-700"
                aria-label="Cerrar"
              >
                ✖
              </button>
            </div>

            {/* Buscador de categorías */}
            <div className="mb-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Buscar categoría..."
                  className="w-full py-2 px-4 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[#4A6FA5] pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <svg className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>

            {/* Rejilla de categorías */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <button
                onClick={() => handleCategoryFilter(null)}
                className={`px-4 py-2 rounded-md font-medium text-sm transition-all duration-300 ${
                  activeFilter === 'all'
                    ? 'bg-[#13152A] text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Todas
              </button>
              {filteredCategories.map((cat) => (
                <button
                  key={cat.id_Category}
                  onClick={() => handleCategoryFilter(cat.id_Category)}
                  className={`px-4 py-2 rounded-md font-medium text-sm transition-all duration-300 ${
                    activeFilter === cat.id_Category.toString()
                      ? 'bg-[#13152A] text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>

            {filteredCategories.length === 0 && (
              <p className="text-center text-gray-500 my-6">No se encontraron categorías con ese término.</p>
            )}
          </div>
        </div>
      )}

      <Footer />
      
      {/* Estilos para ocultar la barra de desplazamiento pero mantener la funcionalidad */}
      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </>
  );
};

export default GalleryPage;