import React, { useState } from 'react';
import { FaSearch, FaRuler } from 'react-icons/fa';
import { AiTwotonePlusSquare, AiTwotoneEdit, AiFillDelete } from 'react-icons/ai';
import useUnitOfMeasure from '../../../hooks/useUnitOfMeasure';
import { UnitOfMeasure } from '../../../types/OrderTypes';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import DeleteEventModal from '../../../modals/DeleteEventModal';
import UnitOfMeasureForm from './UnitOfMeasureForm';
import ClipLoader from 'react-spinners/ClipLoader';

const UnitOfMeasurePage: React.FC = () => {
  const { 
    unitOfMeasures, 
    loading, 
    error, 
    handleAddUnitOfMeasure, 
    handleUpdateUnitOfMeasure, 
    handleDeleteUnitOfMeasure 
  } = useUnitOfMeasure();
  
  // Estados para el manejo de modales y paginación
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editingUnit, setEditingUnit] = useState<UnitOfMeasure | null>(null);
  const [deletingUnitId, setDeletingUnitId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(8);
  
  // Filtrado de unidades de medida según búsqueda - solo por nombre
  const filteredUnits = unitOfMeasures.filter(unit => 
    unit.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Lógica para paginación
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentUnits = filteredUnits.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredUnits.length / itemsPerPage);

  // Funciones para manejo de modales
  const handleOpenEditModal = (unit?: UnitOfMeasure) => {
    setEditingUnit(unit || null);
    setShowEditModal(true);
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setEditingUnit(null);
  };

  const handleOpenDeleteModal = (id: number) => {
    setDeletingUnitId(id);
    setShowDeleteModal(true);
  };

  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
    setDeletingUnitId(null);
  };

  // Funciones para operaciones CRUD
  const handleSaveUnit = async (unitData: Omit<UnitOfMeasure, 'unitOfMeasureId'>) => {
    try {
      if (editingUnit) {
        await handleUpdateUnitOfMeasure(editingUnit.unitOfMeasureId, unitData);
        toast.success('Unidad de medida actualizada correctamente');
      } else {
        await handleAddUnitOfMeasure(unitData);
        toast.success('Unidad de medida creada correctamente');
      }
      handleCloseEditModal();
    } catch (err) {
      toast.error('Error al guardar la unidad de medida');
      console.error(err);
    }
  };

  const handleConfirmDelete = async () => {
    if (deletingUnitId !== null) {
      try {
        await handleDeleteUnitOfMeasure(deletingUnitId);
        toast.success('Unidad de medida eliminada correctamente');
        handleCloseDeleteModal();
      } catch (err) {
        toast.error('Error al eliminar la unidad de medida');
        console.error(err);
      }
    }
  };

  // Cambiar de página
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);
  
  // Cambiar elementos por página
  const handleItemsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newItemsPerPage = parseInt(e.target.value);
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1); // Resetear a la primera página cuando cambia el número de elementos
  };

  // Mostrar loader mientras carga los datos
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <ClipLoader color="#3b82f6" size={100} />
      </div>
    );
  }

  // Mostrar mensaje de error si ocurre alguno
  if (error) {
    return (
      <div className="text-center p-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
          <p>Error: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <ToastContainer position="top-right" autoClose={3000} />
      
      <h1 className="text-3xl font-bold mb-6 text-center">Gestión de Unidades de Medida</h1>
      
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        {/* Grupo de buscador y selector */}
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          {/* Buscador */}
          <div className="relative w-full md:w-64">
            <input
              type="text"
              placeholder="Buscar unidades de medida..."
              className="w-full px-4 py-2 pr-10 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <FaSearch className="absolute right-3 top-3 text-gray-400" />
          </div>
          
          {/* Selector de elementos por página */}
          <div className="flex items-center">
            <label htmlFor="itemsPerPage" className="mr-2 text-gray-600 whitespace-nowrap">Mostrar:</label>
            <select
              id="itemsPerPage"
              aria-label="Número de elementos por página"
              value={itemsPerPage}
              onChange={handleItemsPerPageChange}
              className="border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value={4}>4</option>
              <option value={8}>8</option>
              <option value={12}>12</option>
              <option value={16}>16</option>
            </select>
          </div>
        </div>
        
        {/* Botón para añadir - ESTANDARIZADO */}
        <button
          onClick={() => handleOpenEditModal()}
          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md"
        >
          <AiTwotonePlusSquare size={30} />
        </button>
      </div>

      {/* Grid de Cards */}
      {currentUnits.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
          {currentUnits.map(unit => (
            <div 
              key={unit.unitOfMeasureId} 
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center">
                    <div className="bg-blue-100 p-3 rounded-full">
                      <FaRuler className="text-blue-600" size={20} />
                    </div>
                    <div className="ml-4">
                      <h3 className="text-xl font-semibold text-gray-800">{unit.name}</h3>
                    </div>
                  </div>
                  <span className="text-gray-500 text-xs">#{unit.unitOfMeasureId}</span>
                </div>
                
                {/* Botones de acción - ESTANDARIZADOS */}
                <div className="flex justify-end space-x-2 mt-4 pt-3 border-t border-gray-100">
                  <button
                    className="bg-yellow-500 hover:bg-yellow-600 text-white px-2 py-1 rounded"
                    onClick={() => handleOpenEditModal(unit)}
                  >
                    <AiTwotoneEdit size={24} />
                  </button>
                  <button
                    className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded"
                    onClick={() => handleOpenDeleteModal(unit.unitOfMeasureId)}
                  >
                    <AiFillDelete size={24} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center bg-gray-50 rounded-lg p-8 shadow-inner">
          <FaRuler className="mx-auto text-gray-400 mb-3" size={40} />
          <p className="text-gray-500 text-lg mb-2">No hay unidades de medida disponibles</p>
          <p className="text-gray-400 text-sm">
            {searchTerm ? 'No se encontraron resultados para la búsqueda' : 'Comienza agregando una nueva unidad de medida'}
          </p>
        </div>
      )}

      {/* Paginación */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-6">
          <nav className="inline-flex">
            <button
              onClick={() => currentPage > 1 && paginate(currentPage - 1)}
              disabled={currentPage === 1}
              className={`px-3 py-2 mx-1 rounded-md ${
                currentPage === 1
                  ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                  : 'bg-gray-300 text-gray-700 hover:bg-gray-400'
              }`}
            >
              &laquo;
            </button>
            
            {Array.from({ length: totalPages }, (_, index) => (
              <button
                key={index + 1}
                onClick={() => paginate(index + 1)}
                className={`px-4 py-2 mx-1 rounded-md ${
                  currentPage === index + 1
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-300 text-gray-700 hover:bg-gray-400'
                }`}
              >
                {index + 1}
              </button>
            ))}
            
            <button
              onClick={() => currentPage < totalPages && paginate(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`px-3 py-2 mx-1 rounded-md ${
                currentPage === totalPages
                  ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                  : 'bg-gray-300 text-gray-700 hover:bg-gray-400'
              }`}
            >
              &raquo;
            </button>
          </nav>
        </div>
      )}

      {/* Modal para editar/crear */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h2 className="text-xl font-bold mb-4">
              {editingUnit ? 'Editar Unidad de Medida' : 'Nueva Unidad de Medida'}
            </h2>
            <UnitOfMeasureForm
              unitOfMeasure={editingUnit}
              onSave={handleSaveUnit}
              onCancel={handleCloseEditModal}
            />
          </div>
        </div>
      )}

      {/* Modal para eliminar */}
      <DeleteEventModal 
        show={showDeleteModal}
        onClose={handleCloseDeleteModal}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
};

export default UnitOfMeasurePage;