import React, { useState } from 'react';
import { useLaboratories } from '../../../hooks/useLaboratories';
import EditLaboratoryModal from '../../../modals/EditLaboratoryModal';
import DeleteEventModal from '../../../modals/DeleteEventModal'; 
import { AiFillDelete, AiTwotoneEdit, AiTwotonePlusSquare } from 'react-icons/ai';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Laboratory } from '../../../types/Types';

const LaboratoriesPage: React.FC = () => {
  const { laboratories, loading, error, handleAddLaboratory, handleEditLaboratory, handleDeleteLaboratory } = useLaboratories();
  const [showEditModal, setShowEditModal] = useState<boolean>(false);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [editingLaboratory, setEditingLaboratory] = useState<Laboratory | null>(null);
  const [deletingLaboratoryId, setDeletingLaboratoryId] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage] = useState<number>(5); // Número de laboratorios por página

  const handleOpenEditModal = (laboratory?: Laboratory) => {
    setEditingLaboratory(laboratory || null);
    setShowEditModal(true);
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setEditingLaboratory(null);
  };

  const handleSaveLaboratory = (laboratory: Laboratory) => {
    if (editingLaboratory) {
      handleEditLaboratory(editingLaboratory.id_Laboratory, laboratory);
      toast.success('Laboratorio editado con éxito!');
    } else {
      handleAddLaboratory(laboratory);
      toast.success('Laboratorio creado con éxito!');
    }
    handleCloseEditModal();
  };

  const handleOpenDeleteModal = (id: number) => {
    setDeletingLaboratoryId(id);
    setShowDeleteModal(true);
  };

  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
    setDeletingLaboratoryId(null);
  };

  const handleConfirmDelete = () => {
    if (deletingLaboratoryId !== null) {
      handleDeleteLaboratory(deletingLaboratoryId);
      toast.error('Laboratorio eliminado');
      handleCloseDeleteModal();
    }
  };

  // Cálculo de laboratorios para la página actual
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentLaboratories = laboratories.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(laboratories.length / itemsPerPage);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold mb-6 text-center">Gestión de Laboratorios</h1>

      <div className="flex justify-end mb-6">
        <button
          className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
          onClick={() => handleOpenEditModal()}
        >
          <AiTwotonePlusSquare size={30} />
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="table-auto w-full bg-white rounded-lg shadow-md">
          <thead>
            <tr className="bg-gray-200">
              <th className="px-4 py-2">Nombre</th>
              <th className="px-4 py-2">Descripción</th>
              <th className="px-4 py-2">Capacidad</th>
              <th className="px-4 py-2">Imagen</th>
              <th className="px-4 py-2">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} className="px-4 py-2">Cargando...</td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan={5} className="px-4 py-2 text-red-500">Error: {error}</td>
              </tr>
            ) : laboratories.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-2">No hay laboratorios disponibles.</td>
              </tr>
            ) : (
              currentLaboratories.map((laboratory) => (
                <tr key={laboratory.id_Laboratory}>
                  <td className="border px-4 py-2">{laboratory.name}</td>
                  <td className="border px-4 py-2">{laboratory.description}</td>
                  <td className="border px-4 py-2">{laboratory.capacity}</td>
                  <td className="border px-4 py-2">
                    <img
                      src={laboratory.url_Image}
                      alt={laboratory.name}
                      className="h-16 w-16 object-cover rounded-lg mx-auto"
                    />
                  </td>
                  <td className="border px-4 py-2 flex justify-center">
                    <button
                      className="bg-yellow-500 hover:bg-yellow-600 text-white px-2 py-1 rounded mr-2"
                      onClick={() => handleOpenEditModal(laboratory)}
                    >
                      <AiTwotoneEdit size={24} />
                    </button>
                    <button
                      className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded"
                      onClick={() => handleOpenDeleteModal(laboratory.id_Laboratory)}
                    >
                      <AiFillDelete size={24} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Paginación */}
      <div className="flex justify-center mt-6">
        <nav className="inline-flex">
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
        </nav>
      </div>

      <EditLaboratoryModal
        show={showEditModal}
        laboratory={editingLaboratory}
        onClose={handleCloseEditModal}
        onSave={handleSaveLaboratory}
      />

      <DeleteEventModal
        show={showDeleteModal}
        onClose={handleCloseDeleteModal}
        onConfirm={handleConfirmDelete}
      />

      <ToastContainer />
    </div>
  );
};

export default LaboratoriesPage;