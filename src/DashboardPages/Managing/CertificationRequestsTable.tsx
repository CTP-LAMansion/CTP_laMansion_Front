import React, { useState } from 'react';
import { CertificationRequest } from '../../types/Types';
import useCertificationRequests from '../../hooks/useCertificationRequests';
import Modal from '../../modals/ModalRequest';
import CertificationRequestResponseModal from '../../modals/CertificationRequestResponseModal';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { IoMdCheckmarkCircleOutline } from "react-icons/io";
import { CgCloseO, CgMoreO } from "react-icons/cg";
import ClipLoader from 'react-spinners/ClipLoader';

const CertificationRequestsTable: React.FC = () => {
  const {
    requests,
    loading,
    error,
    handleRejectRequest,
    handleApproveRequest,
    setDeliveryDeadline,
    getCertificationName
  } = useCertificationRequests();

  const [selectedRequest, setSelectedRequest] = useState<CertificationRequest | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState<boolean>(false);
  const [deliveryDays, setDeliveryDays] = useState<number>(0);
  const [isDeliveryDaysSaved, setIsDeliveryDaysSaved] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage] = useState<number>(5);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [isResponseModalOpen, setIsResponseModalOpen] = useState<boolean>(false);
  const [responseAction, setResponseAction] = useState<'approve' | 'reject' | null>(null);

  const openDeliveryModal = (request: CertificationRequest) => {
    setSelectedRequest(request);
    setDeliveryDays(0);
    setIsDeliveryDaysSaved(false);
    setIsModalOpen(true);
  };

  const openDetailModal = (request: CertificationRequest) => {
    setSelectedRequest(request);
    setIsDetailModalOpen(true);
  };

  const openResponseModal = (request: CertificationRequest, action: 'approve' | 'reject') => {
    setSelectedRequest(request);
    setResponseAction(action);
    setIsResponseModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setIsDetailModalOpen(false);
    setIsResponseModalOpen(false);
    setSelectedRequest(null);
  };

  const handleSaveDeliveryDays = async () => {
    if (selectedRequest && deliveryDays > 0) {
      try {
        await setDeliveryDeadline(selectedRequest.id, deliveryDays);
        setIsDeliveryDaysSaved(true);
        toast.success('Días límite guardados correctamente.');
      } catch {
        toast.error('Error al guardar los días límite.');
      }
    } else {
      toast.error('Por favor, ingrese un número válido de días de entrega.');
    }
  };

  const handleApprove = async () => {
    if (selectedRequest && isDeliveryDaysSaved) {
      setResponseAction('approve');
      setIsResponseModalOpen(true);
    } else {
      toast.error('Por favor, guarde primero los días límite.');
    }
  };

  const handleResponseConfirm = async (message: string) => {
    if (!selectedRequest || !responseAction) return;
    
    try {
      if (responseAction === 'approve') {
        await handleApproveRequest(selectedRequest.id, message);
        toast.success('Solicitud aprobada exitosamente.');
      } else {
        await handleRejectRequest(selectedRequest.id, message);
        toast.success('Solicitud rechazada exitosamente.');
      }
      closeModal();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Ha ocurrido un error');
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
    toast.error(`Error: ${error}`);
  }

  const getStatusColor = (status: number) => {
    switch (status) {
      case 0:
        return 'text-yellow-500';
      case 1:
        return 'text-green-500';
      case 2:
        return 'text-red-500';
      default:
        return '';
    }
  };

  const getStatusText = (status: number) => {
    switch (status) {
      case 0:
        return 'Pendiente';
      case 1:
        return 'Aprobado';
      case 2:
        return 'Rechazado';
      default:
        return 'Desconocido';
    }
  };

  // Sort requests by requestDate (most recent to oldest)
  const sortedRequests = [...requests].sort((a, b) => 
    new Date(b.requestDate).getTime() - new Date(a.requestDate).getTime()
  );

  // Filter requests based on selected status
  const filteredRequests = filterStatus === 'all'
    ? sortedRequests
    : sortedRequests.filter(request => 
        (filterStatus === '0' && request.status === 0) ||
        (filterStatus === '1' && request.status === 1) ||
        (filterStatus === '2' && request.status === 2)
      );

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentRequests = filteredRequests.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredRequests.length / itemsPerPage);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <div className="container mx-auto px-4 py-8">
      <ToastContainer />
      <h1 className="text-3xl font-bold mb-8 text-center">Solicitudes de Certificación</h1>

      {/* Filter Dropdown */}
      <div className="mb-6 flex justify-end">
        <div className="w-48">
          <label htmlFor="statusFilter" className="block text-sm font-medium text-gray-700 mb-1">
            Filtrar por estado:
          </label>
          <select
            id="statusFilter"
            value={filterStatus}
            onChange={(e) => {
              setFilterStatus(e.target.value);
              setCurrentPage(1);
            }}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          >
            <option value="all">Todas</option>
            <option value="0">Pendiente</option>
            <option value="1">Aprobado</option>
            <option value="2">Rechazado</option>
          </select>
        </div>
      </div>

      {/* Table Wrapper with Fixed Height and Scroll */}
      <div className="overflow-y-auto" style={{ maxHeight: '400px' }}>
        <table className="min-w-full bg-white border border-gray-200 shadow-md table-fixed">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b w-1/3">Nombre del Estudiante</th>
              <th className="py-2 px-4 border-b w-1/6">Estado</th>
              <th className="py-2 px-4 border-b w-1/3">Tipo de Certificación</th>
              <th className="py-2 px-4 border-b w-1/6">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {currentRequests.map((request) => (
              <tr key={request.id} className="text-center">
                <td className="py-2 px-4 border-b truncate">{request.studentName}</td>
                <td className={`py-2 px-4 border-b ${getStatusColor(request.status)}`}>
                  {getStatusText(request.status)}
                </td>
                <td className="py-2 px-4 border-b truncate">
                  {getCertificationName(request.certificationNameId)}
                </td>
                <td className="py-2 px-4 border-b">
                  <div className="flex justify-center gap-2">
                    {request.status === 0 && (
                      <>
                        <button
                          className="bg-green-500 text-white px-3 py-1 rounded-full hover:bg-green-600"
                          onClick={() => openDeliveryModal(request)}
                        >
                          <IoMdCheckmarkCircleOutline size={20} />
                        </button>
                        <button
                          className="bg-red-500 text-white px-3 py-1 rounded-full hover:bg-red-600"
                          onClick={() => openResponseModal(request, 'reject')}
                        >
                          <CgCloseO size={20} />
                        </button>
                      </>
                    )}
                    <button
                      className="bg-gray-500 text-white px-3 py-1 rounded-full hover:bg-gray-600"
                      onClick={() => openDetailModal(request)}
                    >
                      <CgMoreO size={20} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {/* Fill remaining rows to maintain table height */}
            {currentRequests.length < itemsPerPage &&
              Array.from({ length: itemsPerPage - currentRequests.length }).map((_, index) => (
                <tr key={`empty-${index}`} className="text-center">
                  <td className="py-2 px-4 border-b"> </td>
                  <td className="py-2 px-4 border-b"> </td>
                  <td className="py-2 px-4 border-b"> </td>
                  <td className="py-2 px-4 border-b"> </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
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

      {/* Delivery Modal */}
      {isModalOpen && selectedRequest && (
        <Modal onClose={closeModal}>
          <h2 className="text-xl font-bold mb-4">Gestionar Solicitud</h2>
          <p><strong>Nombre del Estudiante:</strong> {selectedRequest.studentName}</p>
          <p><strong>ID del Estudiante:</strong> {selectedRequest.studentIdentification}</p>

          <div className="mt-4">
            <label className="block font-semibold mb-2">Días de entrega:</label>
            <input
              type="number"
              className="border p-2 rounded w-full"
              value={deliveryDays}
              onChange={(e) => setDeliveryDays(Number(e.target.value))}
              placeholder="Ingresa los días de entrega"
              disabled={isDeliveryDaysSaved}
            />
          </div>

          {!isDeliveryDaysSaved && (
            <button
              onClick={handleSaveDeliveryDays}
              className="bg-blue-500 text-white px-4 py-2 mt-4 rounded hover:bg-blue-600"
            >
              Guardar Días Límite
            </button>
          )}

          {isDeliveryDaysSaved && (
            <div className="flex justify-end space-x-4 mt-6">
              <button
                onClick={handleApprove}
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
              >
                Aprobar Solicitud
              </button>
            </div>
          )}
        </Modal>
      )}

      {/* Detail Modal */}
      {isDetailModalOpen && selectedRequest && (
        <Modal onClose={closeModal}>
          <div className="relative bg-white rounded-lg shadow-lg p-6 max-w-lg w-full">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Detalles de la Solicitud</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-semibold text-gray-600">Nombre del Estudiante:</p>
                <p className="text-gray-800 break-words">{(selectedRequest.studentName+" "+  selectedRequest.studentLastName1+" "+  selectedRequest.studentLastName2)}</p>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-600">ID del Estudiante:</p>
                <p className="text-gray-800 break-words">{selectedRequest.studentIdentification}</p>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-600 ">Email:</p>
                <p className="text-gray-800 break-words">{selectedRequest.email}</p>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-600">Teléfono:</p>
                <p className="text-gray-800 break-words">{selectedRequest.phoneNumber}</p>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-600">Fecha de Solicitud:</p>
                <p className="text-gray-800 break-words">{new Date(selectedRequest.requestDate).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-600">Fecha de Respuesta:</p>
                <p className="text-gray-800 break-words">{selectedRequest.responseDate ? new Date(selectedRequest.responseDate).toLocaleDateString() : 'Sin respuesta'}</p>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-600">Estado:</p>
                <p className={`text-gray-800 ${getStatusColor(selectedRequest.status)}`}>{getStatusText(selectedRequest.status)}</p>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-600">Nombre del Encargado:</p>
                <p className="text-gray-800 break-words">{(selectedRequest.guardianName+" "+  selectedRequest.guardianLastName1+" "+  selectedRequest.guardianLastName2)}</p>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-600">Tipo de Certificación:</p>
                <p className="text-gray-800">{getCertificationName(selectedRequest.certificationNameId)}</p>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-600">Método de envío 0= Digital 1= Físico:</p>
                <p className="text-gray-800 break-words">{selectedRequest.deliveryMethod}</p>
              </div>
            </div>
            <div className="mt-6 flex justify-end">
            </div>
          </div>
        </Modal>
      )}

      {/* Modal de Respuesta (Aprobar/Rechazar) */}
      <CertificationRequestResponseModal
        isOpen={isResponseModalOpen}
        title={responseAction === 'approve' ? 'Aprobar Solicitud' : 'Rechazar Solicitud'}
        action={responseAction || 'reject'}
        onConfirm={handleResponseConfirm}
        onCancel={closeModal}
        requestName={selectedRequest ? `${selectedRequest.studentName} (${selectedRequest.studentIdentification})` : ''}
        isMessageRequired={responseAction === 'reject'}
      />
    </div>
  );
};

export default CertificationRequestsTable;