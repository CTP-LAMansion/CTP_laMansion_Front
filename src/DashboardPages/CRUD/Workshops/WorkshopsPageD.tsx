import React, { useState } from 'react';
import { useWorkshops } from '../../../hooks/useWorkshops';
import EditWorkshopModal from '../../../modals/EditWorkshopModal';
import DeleteWorkshopModal from '../../../modals/DeleteEventModal';
import { Workshop } from '../../../types/Types';
import { AiFillDelete, AiTwotoneEdit, AiTwotonePlusSquare } from 'react-icons/ai';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ClipLoader from 'react-spinners/ClipLoader';

const WorkshopsPage: React.FC = () => {
  const {
    workshops,
    specialities,
    loading,
    error,
    handleAddWorkshop,
    handleEditWorkshop,
    handleDeleteWorkshop,
  } = useWorkshops();

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage] = useState<number>(5); // Número de talleres por página
  const [showEditModal, setShowEditModal] = useState<boolean>(false);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [editingWorkshop, setEditingWorkshop] = useState<Workshop | null>(null);
  const [deletingWorkshopId, setDeletingWorkshopId] = useState<number | null>(null);

  const handleOpenEditModal = (workshop?: Workshop) => {
    setEditingWorkshop(workshop || null);
    setShowEditModal(true);
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setEditingWorkshop(null);
  };

  const handleSaveWorkshop = (workshop: Omit<Workshop, 'id'>) => {
    if (editingWorkshop) {
      handleEditWorkshop(editingWorkshop.id, workshop);
      toast.success('Taller editado con éxito!');
    } else {
      handleAddWorkshop(workshop);
      toast.success('Taller creado con éxito!');
    }
    handleCloseEditModal();
  };

  const handleOpenDeleteModal = (id: number) => {
    setDeletingWorkshopId(id);
    setShowDeleteModal(true);
  };

  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
    setDeletingWorkshopId(null);
  };

  const handleConfirmDelete = () => {
    if (deletingWorkshopId !== null) {
      handleDeleteWorkshop(deletingWorkshopId);
      toast.error('Taller eliminado');
      handleCloseDeleteModal();
    }
  };

  if (loading) return <div className="flex justify-center items-center h-screen"> <ClipLoader color="#3b82f6" size={100} /></div>
  if (error) return <p>{error}</p>;

  // Cálculo de talleres para la página actual
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentWorkshops = workshops.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(workshops.length / itemsPerPage);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold mb-6 text-center">Gestión de Talleres</h1>

      <div className="flex justify-end mb-6">
        <button
          className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
          onClick={() => handleOpenEditModal()}
        >
          <AiTwotonePlusSquare size={30} />
        </button>
      </div>

      <table className="table-auto w-full bg-white rounded-lg shadow-md">
        <thead>
          <tr className="bg-gray-200">
            <th className="px-4 py-2">Título</th>
            <th className="px-4 py-2">Descripción</th>
            <th className="px-4 py-2">Especialidad</th>
            <th className="px-4 py-2">Imagen</th>
            <th className="px-4 py-2">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {currentWorkshops.map((workshop) => (
            <tr key={workshop.id}>
              <td className="border px-4 py-2">{workshop.title}</td>
              <td className="border px-4 py-2">{workshop.description}</td>
              <td className="border px-4 py-2">{workshop.especiality}</td>
              <td className="border px-4 py-2">
                <img
                  src={workshop.url_Image}
                  alt={workshop.title}
                  className="h-16 w-16 object-cover rounded-lg mx-auto"
                />
              </td>
              <td className="border px-4 py-2 flex justify-center">
                <button
                  className="bg-yellow-500 hover:bg-yellow-600 text-white px-2 py-1 rounded mr-2"
                  onClick={() => handleOpenEditModal(workshop)}
                >
                  <AiTwotoneEdit size={24} />
                </button>
                <button
                  className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded"
                  onClick={() => handleOpenDeleteModal(workshop.id)}
                >
                  <AiFillDelete size={24} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

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

      {/* Modal para crear/editar taller */}
      <EditWorkshopModal
        show={showEditModal}
        workshop={editingWorkshop}
        specialities={specialities}
        onClose={handleCloseEditModal}
        onSave={handleSaveWorkshop}
      />

      {/* Modal para confirmar eliminación */}
      <DeleteWorkshopModal
        show={showDeleteModal}
        onClose={handleCloseDeleteModal}
        onConfirm={handleConfirmDelete}
      />

      {/* Toast notifications */}
      <ToastContainer />
    </div>
  );
};

export default WorkshopsPage;
