import React, { useState } from 'react';
import { useEvents } from '../../../hooks/useEvents';
import EditEventModal from '../../../modals/EditEventModal';
import DeleteEventModal from '../../../modals/DeleteEventModal';
import { Event } from '../../../types/Types';
import { AiFillDelete, AiTwotoneEdit, AiTwotonePlusSquare } from 'react-icons/ai';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ClipLoader from 'react-spinners/ClipLoader';

const EventosPage: React.FC = () => {
  const { events, loading, error, handleAddEvent, handleEditEvent, handleDeleteEvent } = useEvents();
  const [showEditModal, setShowEditModal] = useState<boolean>(false);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [deletingEventId, setDeletingEventId] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage] = useState<number>(5); // Número de eventos por página

  const handleOpenEditModal = (event?: Event) => {
    setEditingEvent(event || null);
    setShowEditModal(true);
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setEditingEvent(null);
  };

  const handleSaveEvent = (event: Event) => {
    if (editingEvent) {
      handleEditEvent(editingEvent.id, event);
      toast.success('Evento editado con éxito!');
    } else {
      handleAddEvent(event);
      toast.success('Evento creado con éxito!');
    }
    handleCloseEditModal();
  };

  const handleOpenDeleteModal = (id: number) => {
    setDeletingEventId(id);
    setShowDeleteModal(true);
  };

  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
    setDeletingEventId(null);
  };

  const handleConfirmDelete = () => {
    if (deletingEventId !== null) {
      handleDeleteEvent(deletingEventId);
      toast.error('Evento eliminado');
      handleCloseDeleteModal();
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <ClipLoader color="#3b82f6" size={100} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4" role="alert">
          <p className="font-bold">Error</p>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  // Ordenar eventos del más reciente al más antiguo
  const sortedEvents = [...events].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  // Cálculo de eventos para la página actual
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentEvents = sortedEvents.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(sortedEvents.length / itemsPerPage);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold mb-6 text-center">Gestión de Eventos</h1>

      <div className="flex justify-end mb-6">
        <button
          className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
          onClick={() => handleOpenEditModal()}
        >
          <AiTwotonePlusSquare size={30} />
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="table-auto w-full bg-white text-gray-800 rounded-lg shadow-md">
          <thead>
            <tr className="bg-gray-200">
              <th className="px-4 py-2">Título</th>
              <th className="px-4 py-2">Descripción</th>
              <th className="px-4 py-2">Fecha</th>
              <th className="px-4 py-2">Imagen</th>
              <th className="px-4 py-2">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {currentEvents.map((event, index) => (
              <tr key={event.id} className={`border-t ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}>
                <td className="border px-4 py-2">{event.title}</td>
                <td className="border px-4 py-2">{event.description}</td>
                <td className="border px-4 py-2">{new Date(event.date).toLocaleDateString()}</td>
                <td className="border px-4 py-2">
                  <img src={event.url_Image} alt={event.title} className="h-16 w-16 object-cover mx-auto rounded-lg" />
                </td>
                <td className="border px-4 py-2 flex justify-center">
                  <button
                    className="bg-yellow-500 hover:bg-yellow-600 text-white px-2 py-1 rounded mr-2"
                    onClick={() => handleOpenEditModal(event)}
                  >
                    <AiTwotoneEdit size={24} />
                  </button>
                  <button
                    className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded"
                    onClick={() => handleOpenDeleteModal(event.id)}
                  >
                    <AiFillDelete size={24} />
                  </button>
                </td>
              </tr>
            ))}
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

      {/* Modal para Agregar/Editar Evento */}
      <EditEventModal
        show={showEditModal}
        event={editingEvent}
        onClose={handleCloseEditModal}
        onSave={handleSaveEvent}
      />

      {/* Modal para Confirmación de Eliminación */}
      <DeleteEventModal
        show={showDeleteModal}
        onClose={handleCloseDeleteModal}
        onConfirm={handleConfirmDelete}
      />

      {/* Contenedor para Toasts */}
      <ToastContainer position="bottom-right" autoClose={3000} hideProgressBar={false} closeOnClick pauseOnFocusLoss draggable pauseOnHover />
    </div>
  );
};

export default EventosPage;