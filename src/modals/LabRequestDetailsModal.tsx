import React, { useState } from 'react';
import { LabRequest, RequestStatus } from '../types/LaboratoryRequestType';
import LabRequestResponseModal from './LabRequestResponseModal';

interface LabRequestDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  request: LabRequest & { 
    labName?: string;
    labIsActive?: boolean;
    labCapacity?: number;
  };
  onApprove: (id: number, message?: string) => void;
  onReject: (id: number, message: string) => void;
}



const TableRow: React.FC<{ label: string; value: React.ReactNode }> = ({ label, value }) => (
  <tr className="border-b border-gray-200 hover:bg-gray-50">
    <td className="px-4 py-3 font-medium text-gray-600 align-top w-1/3">{label}</td>
    <td className="px-4 py-3 text-gray-800">{value || 'N/A'}</td>
  </tr>
);

const LabRequestDetailsModal: React.FC<LabRequestDetailsModalProps> = ({
  isOpen,
  onClose,
  request,
  onApprove,
  onReject,
}) => {
  const [isResponseModalOpen, setIsResponseModalOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState<'approve' | 'reject' | null>(null);

  const statusStyles = {
    [RequestStatus.Pending]: 'bg-yellow-500',
    [RequestStatus.Approved]: 'bg-green-500',
    [RequestStatus.Rejected]: 'bg-red-500',
  };

  const isPending = request.status === RequestStatus.Pending;

  const formatDate = (dateString: string) => 
    new Date(dateString).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });

  const handleConfirmAction = (message: string) => {
    if (!pendingAction) return;
    
    const id = request.id_LaboratoryRequest;
    if (pendingAction === 'approve') {
      onApprove(id, message);
    } else {
      onReject(id, message);
    }
    setIsResponseModalOpen(false);
    setPendingAction(null);
  };

  const handleCancelAction = () => {
    setIsResponseModalOpen(false);
    setPendingAction(null);
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50" onClick={onClose}>
        <div 
          className="bg-white p-6 rounded-xl shadow-xl max-w-3xl w-full mx-4 relative flex flex-col max-h-[80vh]"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Encabezado */}
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-2xl font-bold text-gray-800">Detalles de la Solicitud</h2>
            <button className="text-gray-500 hover:text-gray-700 transition-colors text-2xl" onClick={onClose}>
              &times;
            </button>
          </div>

          {/* Contenido con Scroll */}
          <div className="overflow-y-auto flex-grow px-2">
            <table className="w-full text-left text-sm text-gray-700">
              <tbody>
                {/* Información del Laboratorio */}
                <tr className="bg-gray-50">
                  <td colSpan={2} className="px-4 py-3 font-semibold text-gray-700 border-b-2 border-gray-200">
                    Información del Laboratorio
                  </td>
                </tr>
                <TableRow label="Nombre del Laboratorio" value={request.labName} />
                <TableRow 
                  label="Estado" 
                  value={
                    <span className={`inline-flex items-center gap-1 ${request.labIsActive ? 'text-green-600' : 'text-red-600'}`}>
                      {request.labIsActive ? '🟢 Activo' : '🔴 Inactivo'}
                    </span>
                  } 
                />
                <TableRow label="Capacidad de asistentes" value={request.labCapacity} />

                {/* Separador visual */}
                <tr><td className="h-4" colSpan={2}></td></tr>

                {/* Detalles de la Solicitud */}
                <tr className="bg-gray-50">
                  <td colSpan={2} className="px-4 py-3 font-semibold text-gray-700 border-b-2 border-gray-200">
                    Detalles de la Solicitud
                  </td>
                </tr>
                <TableRow label="ID Solicitud" value={request.id_LaboratoryRequest} />
                <TableRow label="Gestor" value={`${request.managerName} ${request.managerLastName} ${request.managerLastName2}`} />
                <TableRow label="Curso" value={request.course} />
                <TableRow label="Descripción Actividad" value={request.activityDescription} />
                <TableRow label="Asistentes" value={request.numberOfAttendees} />
                <TableRow label="Fecha" value={`${formatDate(request.startDate)} - ${formatDate(request.endDate)}`} />
                <TableRow label="Horario" value={`${request.startTime} - ${request.endTime}`} />
                <TableRow label="Necesidades Específicas" value={request.needs} />

                {/* Estado de la Solicitud */}
                <tr className="bg-gray-50">
                  <td colSpan={2} className="px-4 py-3 font-semibold text-gray-700 border-b-2 border-gray-200">
                    Estado de la Solicitud
                  </td>
                </tr>
                <tr className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-600 align-top w-1/3">Estado</td>
                  <td className="px-4 py-3 text-gray-800">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusStyles[request.status || RequestStatus.Pending]} text-white`}>
                      {request.status === RequestStatus.Approved
                        ? 'Aprobada'
                        : request.status === RequestStatus.Rejected
                        ? 'Rechazada'
                        : 'Pendiente'}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Botones Fijos */}
          {isPending && (
            <div className="sticky bottom-0 left-0 right-0 bg-white border-t border-gray-300 flex justify-end gap-3 p-3">
              <button
                className="px-4 py-2 bg-green-600 text-white text-sm font-semibold rounded-md hover:bg-green-700 transition-colors"
                onClick={() => {
                  setPendingAction('approve');
                  setIsResponseModalOpen(true);
                }}
              >
                Aprobar
              </button>
              <button
                className="px-4 py-2 bg-red-600 text-white text-sm font-semibold rounded-md hover:bg-red-700 transition-colors"
                onClick={() => {
                  setPendingAction('reject');
                  setIsResponseModalOpen(true);
                }}
              >
                Rechazar
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Modal de respuesta */}
      <LabRequestResponseModal
        isOpen={isResponseModalOpen}
        title={pendingAction === 'approve' ? 'Aprobar Solicitud' : 'Rechazar Solicitud'}
        action={pendingAction || 'reject'}
        onConfirm={handleConfirmAction}
        onCancel={handleCancelAction}
        requestName={request.labName || `Laboratorio #${request.laboratoryId}`}
        isMessageRequired={pendingAction === 'reject'}
      />
    </>
  );
};

export default LabRequestDetailsModal;