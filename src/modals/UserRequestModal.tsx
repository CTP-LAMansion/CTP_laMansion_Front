import React, { useState, useEffect } from 'react';
import { fetchUserLabRequests, fetchUserRoomRequests, fetchUserOrders } from '../services/UserRequestService';
import { LabRequest, RequestStatus } from '../types/LaboratoryRequestType';
import { Order, OrderDetail } from '../types/OrderTypes';
import { RoomRequest } from '../types/RoomRequestType';


interface UserRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string | undefined;
}

const UserRequestModal: React.FC<UserRequestModalProps> = ({ isOpen, onClose, userId }) => {
  const [laboratoryRequests, setLaboratoryRequests] = useState<LabRequest[]>([]);
  const [roomRequests, setRoomRequests] = useState<RoomRequest[]>([]);
  const [orderRequests, setOrderRequests] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && userId) {
      const fetchRequests = async () => {
        setLoading(true);
        setError(null);
        try {
          const labData = await fetchUserLabRequests(userId);
          setLaboratoryRequests(labData);
         
          const roomData = await fetchUserRoomRequests(userId);
          setRoomRequests(roomData);

          const orderData = await fetchUserOrders(userId);
          setOrderRequests(orderData);
        } catch (error) {
          console.error("Error fetching requests:", error);
          setError("Error al obtener las solicitudes.");
        } finally {
          setLoading(false);
        }
      };
      fetchRequests();
    }
  }, [isOpen, userId]);

  const renderRequestStatus = (status?: RequestStatus) => {
    let statusColor = "text-gray-600"; // Default color for unknown status
    let statusText = "Desconocido";

    switch (status) {
      case RequestStatus.Pending:
        statusColor = "text-yellow-500 font-semibold";
        statusText = "Pendiente";
        break;
      case RequestStatus.Approved:
        statusColor = "text-green-500 font-semibold";
        statusText = "Aprobada";
        break;
      case RequestStatus.Rejected:
        statusColor = "text-red-500 font-semibold";
        statusText = "Rechazada";
        break;
    }

    return <span className={statusColor}>{statusText}</span>;
  };

  const handleOutsideClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  useEffect(() => {
    const handleEscapeKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    document.addEventListener('keydown', handleEscapeKey);
    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={handleOutsideClick}
    >
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-3xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          ✖️
        </button>
        
        <h2 className="text-2xl font-bold mb-6 text-blue-800 border-b border-gray-300 pb-2">Solicitudes del Usuario</h2>

        {loading ? (
          <p className="text-gray-500">Cargando solicitudes...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <div className="space-y-6 overflow-y-auto max-h-[70vh]">
            {/* Solicitudes de Laboratorio */}
            <div>
              <h3 className="text-xl font-semibold mb-4 text-blue-700">Solicitudes de Laboratorio</h3>
              {laboratoryRequests.length > 0 ? (
                <ul className="space-y-4">
                  {laboratoryRequests.map((req) => (
                    <li key={req.id_LaboratoryRequest} className="p-4 bg-gray-100 rounded-lg shadow-sm flex flex-col space-y-2">
                      <div><strong>ID:</strong> {req.id_LaboratoryRequest}</div>
                      <div><strong>Curso:</strong> {req.course}</div>
                      <div><strong>Descripción de la actividad:</strong> {req.activityDescription}</div>
                      <div><strong>Estado:</strong> {renderRequestStatus(req.status)}</div>
                      <div><strong>Asistentes:</strong> {req.numberOfAttendees}</div>
                      <div><strong>Fechas:</strong> {req.startDate} a {req.endDate}</div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500">No hay solicitudes de laboratorio.</p>
              )}
            </div>

            {/* Solicitudes de Salas */}
            <div>
              <h3 className="text-xl font-semibold mb-4 text-blue-700">Solicitudes de Salas</h3>
              {roomRequests.length > 0 ? (
                <ul className="space-y-4">
                  {roomRequests.map((req) => (
                    <li key={req.id_RoomRequest} className="p-4 bg-gray-100 rounded-lg shadow-sm flex flex-col space-y-2">
                      <div><strong>ID:</strong> {req.id_RoomRequest}</div>
                      <div><strong>Curso:</strong> {req.course}</div>
                      <div><strong>Descripción de la actividad:</strong> {req.activityDescription}</div>
                      <div><strong>Estado:</strong> {renderRequestStatus(req.status)}</div>
                      <div><strong>Asistentes:</strong> {req.numberOfAttendees}</div>
                      <div><strong>Fechas:</strong> {req.startDate} a {req.endDate}</div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500">No hay solicitudes de salas.</p>
              )}
            </div>

            {/* Solicitudes de Órdenes */}
            <div>
              <h3 className="text-xl font-semibold mb-4 text-blue-700">Solicitudes de Órdenes</h3>
              {orderRequests.length > 0 ? (
                <ul className="space-y-4">
                  {orderRequests.map((order) => (
                    <li key={order.orderId} className="p-4 bg-gray-100 rounded-lg shadow-sm flex flex-col space-y-2">
                      <div><strong>ID Orden:</strong> {order.orderId}</div>
                      <div><strong>Fecha:</strong> {order.orderDate}</div>
                      <div><strong>Área:</strong> {order.requesterArea}</div>
                      <div><strong>Receptor:</strong> {order.receiver}</div>
                      <div><strong>Estado:</strong> {renderRequestStatus(order.status)}</div>
                      <h4 className="mt-2 font-semibold">Detalles del Pedido:</h4>
                      <ul className="ml-4 list-disc space-y-1">
                        {order.orderDetails.map((detail: OrderDetail, index) => (
                          <li key={index}>
                            <strong>Producto:</strong> {detail.product.name}, <strong>Cantidad:</strong> {detail.quantity}, <strong>Unidad:</strong> {detail.unitOfMeasureId}, <strong>Recibido:</strong> {detail.received ? "Sí" : "No"}
                          </li>
                        ))}
                      </ul>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500">No hay solicitudes de órdenes.</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserRequestModal;
