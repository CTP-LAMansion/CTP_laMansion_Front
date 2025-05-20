import React, { useState } from 'react';
import { useUDPs } from '../../../hooks/useUDP';
import EditUDPModal from '../../../modals/EditUDPModal';
import { AiFillDelete, AiTwotoneEdit, AiTwotonePlusSquare } from 'react-icons/ai';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { UDP } from '../../../types/Types';
import ClipLoader from 'react-spinners/ClipLoader';

const UDPsPage: React.FC = () => {
  const { udps, loading, error, handleAddUDP, handleEditUDP, handleDeleteUDP } = useUDPs();
  const [showEditModal, setShowEditModal] = useState<boolean>(false);
  const [editingUDP, setEditingUDP] = useState<UDP | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage] = useState<number>(5); // Número de UDPs por página

  const handleOpenEditModal = (udp?: UDP) => {
    setEditingUDP(udp || null);
    setShowEditModal(true);
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setEditingUDP(null);
  };

  const handleSaveUDP = async (udpData: Omit<UDP, 'id_UDP'>) => {
    if (editingUDP) {
      await handleEditUDP(editingUDP.id_UDP, udpData);
      toast.success('UDP editado con éxito!');
    } else {
      await handleAddUDP(udpData);
      toast.success('UDP creado con éxito!');
    }
    handleCloseEditModal();
  };

  const handleConfirmDelete = async (id: number) => {
    await handleDeleteUDP(id);
    toast.error('UDP eliminado');
  };

  if (loading) return <div className="flex justify-center items-center h-screen"> <ClipLoader color="#3b82f6" size={100} /></div>
  if (error) return <p>{error}</p>;

  // Cálculo de UDPs para la página actual
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentUDPs = udps.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(udps.length / itemsPerPage);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <ToastContainer />
      <h1 className="text-3xl font-bold mb-6 text-center">Gestión de UDPs</h1>
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
              <th className="px-4 py-2">Título</th>
              <th className="px-4 py-2">Descripción</th>
              <th className="px-4 py-2">Área</th>
              <th className="px-4 py-2">Balance</th>
              <th className="px-4 py-2">Usuario</th>
              <th className="px-4 py-2">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {currentUDPs.map(udp => (
              <tr key={udp.id_UDP}>
                <td className="border px-4 py-2">{udp.title}</td>
                <td className="border px-4 py-2">{udp.description}</td>
                <td className="border px-4 py-2">{udp.area}</td>
                <td className="border px-4 py-2">{udp.balance}</td>
                <td className="border px-4 py-2">{`${udp.userName} ${udp.userLastName} ${udp.userLastName2}`}</td>
                <td className="border px-4 py-2 flex justify-center">
                  <button
                    className="bg-yellow-500 hover:bg-yellow-600 text-white px-2 py-1 rounded mr-2"
                    onClick={() => handleOpenEditModal(udp)}
                  >
                    <AiTwotoneEdit size={24} />
                  </button>
                  <button
                    className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded"
                    onClick={() => handleConfirmDelete(udp.id_UDP)}
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

      <EditUDPModal
        show={showEditModal}
        udp={editingUDP}
        onClose={handleCloseEditModal}
        onSave={handleSaveUDP}
      />
    </div>
  );
};

export default UDPsPage;