import React, { useState, useEffect } from 'react';
import { AiTwotonePlusSquare, AiFillDelete, AiFillEdit } from 'react-icons/ai';
import { FaImages, FaTags, FaSearch } from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import useGallery from '../../../hooks/useGalleries';
import useCategories from '../../../hooks/useCategories';
import { Gallery, Category } from '../../../types/Types';

// Importamos los modales desde su carpeta separada
import EditGalleryModal from '../../../modals/galleryModals/EditGalleryModal';
import EditCategoryModal from '../../../modals/galleryModals/EditCategoryModal';
import DeleteConfirmationModal from '../../../modals/galleryModals/DeleteConfirmationModal';

const GalleryPage: React.FC = () => {
  // Estados para gestionar la interfaz
  const [activeTab, setActiveTab] = useState<'images' | 'categories'>('images');
  const [searchTerm, setSearchTerm] = useState('');
  const [showGalleryModal, setShowGalleryModal] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [editingGallery, setEditingGallery] = useState<Gallery | null>(null);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<number | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{ id: number, type: 'gallery' | 'category' } | null>(null);
  const [deleteAssociatedImages, setDeleteAssociatedImages] = useState(false);
  // Estado para almacenar las galerías con sus categorías completas
  const [enhancedGalleries, setEnhancedGalleries] = useState<Gallery[]>([]);

  // Estados para paginación de categorías
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  // Hooks para datos de galería y categorías
  const { 
    galleries, loading: loadingGalleries, error: galleryError,
    fetchGalleries, createGallery, modifyGallery, removeGallery, 
    fetchGalleriesByCategory
  } = useGallery();

  const {
    categories, loading: loadingCategories, error: categoryError,
    fetchCategories, createCategory, modifyCategory, removeCategory
  } = useCategories();

  // Efecto para cargar datos iniciales
  useEffect(() => {
    fetchGalleries();
    fetchCategories();
  }, []);

  // Combinar datos de galerías y categorías para mostrar la información completa
  useEffect(() => {
    if (galleries.length > 0 && categories.length > 0) {
      const galleryWithCategories = galleries.map(gallery => {
        // Si ya tiene información completa de categoría, la mantenemos
        if (gallery.category && typeof gallery.category === 'object') {
          return gallery;
        }
        
        // Si solo tiene el ID de categoría, buscamos la categoría completa
        if (gallery.categoryId) {
          const category = categories.find(cat => cat.id_Category === gallery.categoryId);
          return {
            ...gallery,
            category: category || null
          };
        }
        
        return gallery;
      });
      
      setEnhancedGalleries(galleryWithCategories);
    } else {
      setEnhancedGalleries(galleries);
    }
  }, [galleries, categories]);

  // Filtrado por categoría
  useEffect(() => {
    if (selectedCategoryFilter !== null) {
      fetchGalleriesByCategory(selectedCategoryFilter);
    } else {
      fetchGalleries();
    }
  }, [selectedCategoryFilter]);

  // Filtrado por texto de búsqueda
  const filteredGalleries = enhancedGalleries.filter(gallery =>
    gallery.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calcular el número de imágenes por categoría
  const getCategoryImageCount = (categoryId: number) => {
    return galleries.filter(gallery => gallery.categoryId === categoryId).length;
  };

  // Paginación de categorías
  const indexOfLastCategory = currentPage * itemsPerPage;
  const indexOfFirstCategory = indexOfLastCategory - itemsPerPage;
  const currentCategories = filteredCategories.slice(indexOfFirstCategory, indexOfLastCategory);
  const totalPages = Math.ceil(filteredCategories.length / itemsPerPage);

  // Manejadores para galerías
  const handleOpenGalleryModal = (gallery?: Gallery) => {
    setEditingGallery(gallery || null);
    setShowGalleryModal(true);
  };

  // Simplificamos el manejador para cerrar directamente
  const handleCloseGalleryModal = () => {
    setShowGalleryModal(false);
    setEditingGallery(null);
  };

  const handleSaveGallery = async (gallery: Gallery) => {
    try {
      if (editingGallery) {
        await modifyGallery(editingGallery.id_Gallery, gallery);
        toast.success('Imagen actualizada correctamente');
      } else {
        await createGallery(gallery);
        toast.success('Imagen agregada correctamente');
      }
      setShowGalleryModal(false);
      setEditingGallery(null);
      fetchGalleries();
    } catch (error) {
      toast.error('Error al guardar la imagen');
      console.error(error);
    }
  };

  // Manejadores para categorías
  const handleOpenCategoryModal = (category?: Category) => {
    setEditingCategory(category || null);
    setShowCategoryModal(true);
  };

  // Simplificamos el manejador para cerrar directamente
  const handleCloseCategoryModal = () => {
    setShowCategoryModal(false);
    setEditingCategory(null);
  };

  const handleSaveCategory = async (category: Category) => {
    try {
      if (editingCategory) {
        await modifyCategory(editingCategory.id_Category, category);
        toast.success('Categoría actualizada correctamente');
      } else {
        await createCategory(category);
        toast.success('Categoría agregada correctamente');
      }
      setShowCategoryModal(false);
      setEditingCategory(null);
      fetchCategories();
    } catch (error) {
      toast.error('Error al guardar la categoría');
      console.error(error);
    }
  };

  // Modal de confirmación de eliminación
  const handleOpenDeleteModal = (id: number, type: 'gallery' | 'category') => {
    setItemToDelete({ id, type });
    setDeleteAssociatedImages(false);
    setShowDeleteModal(true);
  };

  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
    setItemToDelete(null);
    setDeleteAssociatedImages(false);
  };

  const handleConfirmDelete = async () => {
    if (!itemToDelete) return;

    try {
      if (itemToDelete.type === 'gallery') {
        await removeGallery(itemToDelete.id);
        toast.success('Imagen eliminada correctamente');
        fetchGalleries();
      } else {
        // Si es una categoría y se ha seleccionado eliminar imágenes asociadas
        await removeCategory(itemToDelete.id, deleteAssociatedImages);
        
        if (deleteAssociatedImages) {
          toast.success('Categoría e imágenes asociadas eliminadas correctamente');
        } else {
          toast.success('Categoría eliminada correctamente');
        }
        
        fetchCategories();
        fetchGalleries();
      }
      handleCloseDeleteModal();
    } catch (error) {
      toast.error(`Error al eliminar ${itemToDelete.type === 'gallery' ? 'la imagen' : 'la categoría'}`);
      console.error(error);
    }
  };

  // Función para cambiar de página
  const paginate = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  // Función para obtener el nombre de la categoría
  const getCategoryName = (gallery: Gallery) => {
    if (gallery.category && gallery.category.name) {
      return gallery.category.name;
    }
    
    if (gallery.categoryId) {
      const category = categories.find(cat => cat.id_Category === gallery.categoryId);
      return category ? category.name : 'Sin categoría';
    }
    
    return 'Sin categoría';
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Cabecera con título */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <h1 className=" text-3xl font-bold mb-6 ">
            Gestión de Galería
          </h1>
          
          {/* Buscador */}
          <div className="relative w-full md:w-auto">
            <input
              type="text"
              placeholder="Buscar..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 rounded-lg border border-gray-300 w-full md:w-64 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <FaSearch className="absolute left-3 top-3 text-gray-400" />
          </div>
        </div>

        {/* Tabs de navegación */}
        <div className="flex border-b border-gray-300 mb-8">
          <button
            className={`flex items-center px-6 py-3 font-medium text-sm ${
              activeTab === 'images'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('images')}
          >
            <FaImages className="mr-2" /> Imágenes
          </button>
          <button
            className={`flex items-center px-6 py-3 font-medium text-sm ${
              activeTab === 'categories'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('categories')}
          >
            <FaTags className="mr-2" /> Categorías
          </button>
        </div>

        {/* Contenido principal */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          {/* Sección de Imágenes */}
          {activeTab === 'images' && (
            <div>
              <div className="flex flex-col md:flex-row justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4 md:mb-0">Imágenes de la Galería</h2>
                
                <div className="flex space-x-4 w-full md:w-auto">
                  {/* Filtro de categorías */}
                  <label htmlFor="categoryFilter" className="sr-only">Filtrar por categoría</label>
                  <select 
                    id="categoryFilter"
                    className="border border-gray-300 rounded-md px-3 py-2 bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={selectedCategoryFilter || ''}
                    onChange={(e) => setSelectedCategoryFilter(e.target.value ? Number(e.target.value) : null)}
                  >
                    <option value="">Todas las categorías</option>
                    {categories.map((category) => (
                      <option key={category.id_Category} value={category.id_Category}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                  
                  {/* Botón para agregar imagen */}
                  <button
                    className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
                    onClick={() => handleOpenGalleryModal()}
                  >
                    <AiTwotonePlusSquare size={30} />
                  </button>
                </div>
              </div>

              {/* Estado de carga */}
              {loadingGalleries ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div key={i} className="bg-gray-200 rounded-lg h-64 animate-pulse"></div>
                  ))}
                </div>
              ) : galleryError ? (
                <div className="text-center py-10">
                  <p className="text-red-500">Error al cargar las imágenes</p>
                </div>
              ) : filteredGalleries.length === 0 ? (
                <div className="text-center py-10">
                  <p className="text-gray-500">No se encontraron imágenes</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {filteredGalleries.map((gallery) => (
                    <div 
                      key={gallery.id_Gallery}
                      className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                    >
                      <div className="relative h-48 overflow-hidden">
                        <img
                          src={gallery.url_Image}
                          alt={gallery.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 hover:opacity-100 flex items-center justify-center space-x-3 transition-opacity duration-300">
                        <button
                            type="button"
                            title="Editar imagen"
                            className="bg-yellow-500 p-2 rounded-full text-white hover:bg-yellow-600"
                            onClick={(e) => {
                            e.stopPropagation();
                            handleOpenGalleryModal(gallery);
                            }}
                        >
                            <AiFillEdit size={18} />
                        </button>
                        <button
                            type="button"
                            title="Eliminar imagen"
                            className="bg-red-500 p-2 rounded-full text-white hover:bg-red-600"
                            onClick={(e) => {
                            e.stopPropagation();
                            handleOpenDeleteModal(gallery.id_Gallery, 'gallery');
                            }}
                        >
                            <AiFillDelete size={18} />
                        </button>
                        </div>
                      </div>
                      <div className="p-4">
                        <h3 className="font-medium text-gray-800 truncate">{gallery.title}</h3>
                        {/* Usar la función getCategoryName para mostrar siempre la categoría */}
                        <p className="text-sm text-gray-500 mt-1">
                          {getCategoryName(gallery)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Sección de Categorías */}
          {activeTab === 'categories' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-800">Categorías</h2>
                    <button
                      className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
                      onClick={() => handleOpenCategoryModal()}
                    >
                      <AiTwotonePlusSquare size={30} />
                    </button>
              </div>

              {/* Lista de categorías */}
              {loadingCategories ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-16 bg-gray-200 rounded-lg animate-pulse"></div>
                  ))}
                </div>
              ) : categoryError ? (
                <div className="text-center py-10">
                  <p className="text-red-500">Error al cargar las categorías</p>
                </div>
              ) : filteredCategories.length === 0 ? (
                <div className="text-center py-10">
                  <p className="text-gray-500">No se encontraron categorías</p>
                </div>
              ) : (
                <>
                  <div className="overflow-x-auto">
                    <table className="min-w-full bg-white">
                      <thead className="bg-gray-50 text-gray-600 uppercase text-sm leading-normal">
                        <tr>
                         
                          <th className="py-3 px-6 text-left">Nombre</th>
                          <th className="py-3 px-6 text-center">Cantidad de imágenes</th>
                          <th className="py-3 px-6 text-center">Acciones</th>
                        </tr>
                      </thead>
                      <tbody className="text-gray-600 text-sm">
                        {currentCategories.map((category) => (
                          <tr key={category.id_Category} className="border-b border-gray-200 hover:bg-gray-50">
  
                            <td className="py-3 px-6 text-left">
                              {category.name}
                            </td>
                            <td className="py-3 px-6 text-center">
                              {/* Usar la función getCategoryImageCount para mostrar el conteo correcto */}
                              {getCategoryImageCount(category.id_Category)}
                            </td>
                            <td className="py-3 px-6 text-center">
                                <div className="flex item-center justify-center gap-2">
                                <button
                                    type="button"
                                    title="Editar categoría"
                                    className="bg-yellow-500 hover:bg-yellow-600 text-white p-2 rounded-full transition-colors"
                                    onClick={() => handleOpenCategoryModal(category)}
                                >
                                    <AiFillEdit size={16} />
                                </button>
                                <button
                                    type="button"
                                    title="Eliminar categoría"
                                    className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-full transition-colors"
                                    onClick={() => handleOpenDeleteModal(category.id_Category, 'category')}
                                >
                                    <AiFillDelete size={16} />
                                </button>
                                </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Paginación */}
                  {totalPages > 1 && (
                    <div className="flex justify-center mt-6">
                      <nav className="inline-flex rounded-md shadow-sm">
                        <button
                          onClick={() => currentPage > 1 && paginate(currentPage - 1)}
                          disabled={currentPage === 1}
                          className={`px-3 py-2 rounded-l-md border ${
                            currentPage === 1
                              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                              : 'bg-white text-gray-700 hover:bg-gray-50'
                          } border-gray-300`}
                        >
                          &laquo;
                        </button>
                        {[...Array(totalPages)].map((_, index) => (
                          <button
                            key={index + 1}
                            onClick={() => paginate(index + 1)}
                            className={`px-4 py-2 border-t border-b ${
                              currentPage === index + 1
                                ? 'bg-blue-500 text-white border-blue-500'
                                : 'bg-white text-gray-700 hover:bg-gray-50 border-gray-300'
                            }`}
                          >
                            {index + 1}
                          </button>
                        ))}
                        <button
                          onClick={() => currentPage < totalPages && paginate(currentPage + 1)}
                          disabled={currentPage === totalPages}
                          className={`px-3 py-2 rounded-r-md border ${
                            currentPage === totalPages
                              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                              : 'bg-white text-gray-700 hover:bg-gray-50'
                          } border-gray-300`}
                        >
                          &raquo;
                        </button>
                      </nav>
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Modales utilizando los componentes importados */}
      <EditGalleryModal
        isOpen={showGalleryModal}
        gallery={editingGallery}
        onSave={handleSaveGallery}
        onClose={handleCloseGalleryModal}
      />

      <EditCategoryModal
        isOpen={showCategoryModal}
        category={editingCategory}
        onSave={handleSaveCategory}
        onClose={handleCloseCategoryModal}
      />

      <DeleteConfirmationModal
        isOpen={showDeleteModal}
        itemType={itemToDelete?.type || 'gallery'}
        showDeleteOptions={itemToDelete?.type === 'category'}
        deleteAssociatedImages={deleteAssociatedImages}
        setDeleteAssociatedImages={setDeleteAssociatedImages}
        onConfirm={handleConfirmDelete}
        onCancel={handleCloseDeleteModal}
      />

      <ToastContainer position="bottom-right" autoClose={3000} />
    </div>
  );
};

export default GalleryPage;