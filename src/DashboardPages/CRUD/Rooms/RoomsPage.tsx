import React, { useState } from 'react';
import { useRoomsAndRequests } from '../../../hooks/useRooms';
import EditRoomModal from '../../../modals/EditRoomModal';
import DeleteEventModal from '../../../modals/DeleteEventModal';
import { Room } from '../../../types/Types';
import { AiFillDelete, AiTwotoneEdit, AiTwotonePlusSquare } from 'react-icons/ai';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const RoomsPage: React.FC = () => {
  const { rooms, loading, error, handleAddRoom, handleEditRoom, handleDeleteRoom } = useRoomsAndRequests();
  const [showEditModal, setShowEditModal] = useState<boolean>(false);
  const [editingRoom, setEditingRoom] = useState<Room | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [deletingRoomId, setDeletingRoomId] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage] = useState<number>(5); // Número de salas por página

  // Abrir modal de edición
  const handleOpenEditModal = (room?: Room) => {
    setEditingRoom(room || null);
    setShowEditModal(true);
  };

  // Cerrar modal de edición
  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setEditingRoom(null);
  };

  // Guardar sala (agregar o editar)
  const handleSaveRoom = async (room: Room): Promise<void> => {
    if (editingRoom) {
      await handleEditRoom(editingRoom.id_Room, room); // Suponiendo que esta función devuelve una promesa
      toast.success('Sala editada correctamente');
    } else {
      await handleAddRoom(room); // Suponiendo que esta función devuelve una promesa
      toast.success('Sala agregada correctamente');
    }
    handleCloseEditModal();
  };

  // Abrir modal de eliminación
  const handleOpenDeleteModal = (id: number) => {
    setDeletingRoomId(id);
    setShowDeleteModal(true);
  };

  // Cerrar modal de eliminación
  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
    setDeletingRoomId(null);
  };

  // Confirmación de eliminación
  const handleConfirmDelete = () => {
    if (deletingRoomId !== null) {
      handleDeleteRoom(deletingRoomId);
      toast.success('Sala eliminada correctamente');
      handleCloseDeleteModal();
    }
  };

  // Cálculo de salas para la página actual
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentRooms = rooms.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(rooms.length / itemsPerPage);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold mb-6 text-center">Gestión de Salas</h1>

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
                <td colSpan={5} className="px-4 py-2 text-center">Cargando...</td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan={5} className="px-4 py-2 text-center text-red-500">Error: {error}</td>
              </tr>
            ) : rooms.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-2 text-center">No hay salas disponibles.</td>
              </tr>
            ) : (
              currentRooms.map((room) => (
                <tr key={room.id_Room} className="border-t">
                  <td className="border px-4 py-2">{room.name}</td>
                  <td className="border px-4 py-2">{room.description}</td>
                  <td className="border px-4 py-2">{room.capacity}</td>
                  <td className="border px-4 py-2">
                    <img
                      src={room.url_Image}
                      alt={room.name}
                      className="h-16 w-16 object-cover mx-auto rounded-lg"
                    />
                  </td>
                  <td className="border px-4 py-2 flex justify-center">
                    <button
                      className="bg-yellow-500 hover:bg-yellow-600 text-white px-2 py-1 rounded mr-2"
                      onClick={() => handleOpenEditModal(room)}
                    >
                      <AiTwotoneEdit size={24} />
                    </button>
                    <button
                      className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded"
                      onClick={() => handleOpenDeleteModal(room.id_Room)}
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

      {/* Modal de edición */}
      <EditRoomModal
        show={showEditModal}
        room={editingRoom}
        onClose={handleCloseEditModal}
        onSave={handleSaveRoom}
      />

      {/* Modal de confirmación de eliminación */}
      <DeleteEventModal
        show={showDeleteModal}
        onClose={handleCloseDeleteModal}
        onConfirm={handleConfirmDelete}
      />

      <ToastContainer position="bottom-right" autoClose={3000} hideProgressBar={false} closeOnClick pauseOnFocusLoss draggable pauseOnHover />
    </div>
  );
};

export default RoomsPage;