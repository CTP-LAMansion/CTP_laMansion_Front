import React, { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { RequestStatus, LabRequest } from '../../types/LaboratoryRequestType';
import { useLabsAndRequests } from '../../hooks/useLabs';
import LabRequestDetailsModal from '../../modals/LabRequestDetailsModal';
import LabHistoryModal from '../../modals/LabHistoryModal';

const ManageLabRequests: React.FC = () => {
  const {
    labRequests,
    labs,
    loading,
    error,
    handleApproveLabRequest,
    handleRejectLabRequest,
    fetchLabRequestsData,
  } = useLabsAndRequests();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRequest, setSelectedRequest] = useState<LabRequest | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);

  const notifySuccess = (message: string) => toast.success(message);
  const notifyError = (message: string) => toast.error(message);

  const handleRequestAction = async (action: () => Promise<void>, successMessage: string) => {
    try {
      await action();
      notifySuccess(successMessage);
      await fetchLabRequestsData();
      closeModal();
    } catch (error) {
      notifyError(`Error: ${error instanceof Error ? error.message : 'Ocurrió un error'}`);
    }
  };
  const approveRequest = (id: number, message?: string) =>
    handleRequestAction(
      () => handleApproveLabRequest(id, message),
      'Solicitud aprobada exitosamente'
    );

  const rejectRequest = (id: number, message: string) =>
    handleRequestAction(
      () => handleRejectLabRequest(id, message),
      'Solicitud rechazada exitosamente'
    );

  const openModal = (request: LabRequest) => {
    const lab = labs.find(l => l.id_Laboratory === request.laboratoryId);

    if (!lab && labs.length === 0) {
      notifyError('Error cargando información del laboratorio');
      return;
    }

    setSelectedRequest({
      ...request,
      labName: lab?.name || 'Laboratorio no encontrado',
      labIsActive: lab?.isActive || false,
      labCapacity: lab?.capacity || 0
    });

    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedRequest(null);
  };

  // 📅 Hoy sin hora
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // 📋 Filtrar solicitudes pendientes y con fecha de inicio >= hoy
  const filteredRequests = labRequests
    .filter(request => request.status === RequestStatus.Pending)
    .filter(request => {
      const requestDate = new Date(request.startDate);
      requestDate.setHours(0, 0, 0, 0);
      return requestDate >= today;
    })
    .filter(request =>
      `${request.managerName} ${request.managerLastName} ${request.managerLastName2}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    );

  const sortedRequests = filteredRequests.sort((a, b) => {
    const dateA = new Date(a.startDate).getTime();
    const dateB = new Date(b.startDate).getTime();
    return dateB - dateA;
  });

  return (
    <div className="max-w-7xl mx-auto p-4 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-semibold mb-4">Gestión de Solicitudes de Laboratorio</h2>

      <div className="mb-4">
        <input
          type="text"
          className="border px-4 py-2 w-full rounded"
          placeholder="Buscar por gestor..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <div className="flex justify-end mb-4">
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          onClick={() => setIsHistoryModalOpen(true)}
        >
          Ver Historial de Solicitudes
        </button>
      </div>
      {loading && <p className="text-gray-600">Cargando solicitudes...</p>}
      {error && <p className="text-red-600">{error}</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {sortedRequests.length === 0 ? (
          <p className="text-gray-600">No hay solicitudes disponibles</p>
        ) : (
          sortedRequests.map((request) => (
            <div
              key={request.id_LaboratoryRequest}
              className="p-4 border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow"
            >
              <h3 className="text-lg font-semibold">
                {request.managerName} {request.managerLastName} {request.managerLastName2}
              </h3>
              <p className="text-gray-600 mt-2">
                Laboratorio: {labs.find(l => l.id_Laboratory === request.laboratoryId)?.name || 'Desconocido'}
              </p>

              <button
                className="mt-4 w-full bg-blue-50 text-blue-700 px-4 py-2 rounded-lg border border-blue-100 hover:bg-blue-100 transition-colors"
                onClick={() => openModal(request)}
              >
                Ver detalles
              </button>
            </div>
          ))
        )}
      </div>

      {selectedRequest && (
        <LabRequestDetailsModal
          isOpen={isModalOpen}
          onClose={closeModal}
          request={selectedRequest}
          onApprove={approveRequest}
          onReject={rejectRequest}
        />
      )}

      <LabHistoryModal
        isOpen={isHistoryModalOpen}
        onClose={() => setIsHistoryModalOpen(false)}
        labRequests={labRequests}
      />

      <ToastContainer position="bottom-right" autoClose={3000} />
    </div>
  );
};

export default ManageLabRequests;
