import React, { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useOrders } from '../../hooks/useOrders';
import { RequestStatus, Order } from '../../types/OrderTypes';
import ProductDetailsModal from '../../modals/ProductDetailsModal';
import HistoryModal from '../../modals/HistoryModal'; // Modal de historial
import OrderRequestResponseModal from '../../modals/OrderRequestResponseModal'; // Modal para respuestas

const ManageOrders: React.FC = () => {
  const { orders, loading, error, handleApproveOrder, handleRejectOrder } = useOrders(RequestStatus.Pending);
  
  const [searchTerm, setSearchTerm] = useState(''); // Barra de búsqueda
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);  // Estado para la orden seleccionada
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);  // Estado del modal de detalles
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState<boolean>(false);  // Estado del modal de historial
  const [isResponseModalOpen, setIsResponseModalOpen] = useState<boolean>(false); // Estado para el modal de respuesta
  const [pendingAction, setPendingAction] = useState<'approve' | 'reject' | null>(null); // Acción pendiente
  const notifySuccess = (message: string) => toast.success(message);
  const notifyError = (message: string) => toast.error(message);
  
  // Función para abrir el modal de respuesta para aprobar
  const openApproveModal = (order: Order) => {
    setSelectedOrder(order);
    setPendingAction('approve');
    setIsResponseModalOpen(true);
  };
  
  // Función para abrir el modal de respuesta para rechazar
  const openRejectModal = (order: Order) => {
    setSelectedOrder(order);
    setPendingAction('reject');
    setIsResponseModalOpen(true);
  };

  // Función para confirmar la acción con mensaje
  const handleConfirmAction = async (message: string) => {
    if (!selectedOrder || !pendingAction) return;
    
    try {
      if (pendingAction === 'approve') {
        await handleApproveOrder(selectedOrder.orderId, message);
        notifySuccess('Orden aprobada con éxito');
      } else {
        await handleRejectOrder(selectedOrder.orderId, message);
        notifySuccess('Orden rechazada con éxito');
      }
    } catch (error) {
      notifyError(`Error al ${pendingAction === 'approve' ? 'aprobar' : 'rechazar'} la orden`);
    } finally {
      setIsResponseModalOpen(false);
      setPendingAction(null);
      closeModal();
    }
  };
  
  // Función para cancelar la acción
  const handleCancelAction = () => {
    setIsResponseModalOpen(false);
    setPendingAction(null);
  };
  // Estas funciones son para la compatibilidad con ProductDetailsModal
  const approveOrder = async (id: number) => {
    openApproveModal({...selectedOrder!, orderId: id});
  };

  const rejectOrder = async (id: number) => {
    openRejectModal({...selectedOrder!, orderId: id});
  };

  // Abrir modal de detalles
  const openModal = (order: Order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedOrder(null);
  };

  // Abrir modal de historial
  const openHistoryModal = () => {
    setIsHistoryModalOpen(true);
  };

  const closeHistoryModal = () => {
    setIsHistoryModalOpen(false);
  };

  // Filtrar órdenes por nombre del receptor
  const filteredOrders = orders.filter(order =>
    order.receiver.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto p-4 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-semibold mb-4">Gestión de Órdenes de Pedido</h2>

      {/* Barra de búsqueda */}
      <div className="mb-4">
        <input
          type="text"
          className="border px-4 py-2 w-full rounded"
          placeholder="Buscar por nombre del receptor..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Botón de historial */}
      <div className="flex justify-end mb-4">
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          onClick={openHistoryModal}
        >
          Ver Historial de Solicitudes
        </button>
      </div>

      {/* Loading and Error states */}
      {loading && <p>Cargando órdenes...</p>}
      {error && <p className="text-red-600">{error}</p>}

      {/* Orders Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredOrders.length === 0 ? (
          <p>No hay órdenes disponibles</p>
        ) : (
          filteredOrders.map((order) => {
            return (
              <div key={order.orderId} className={`p-4 border border-gray-300 rounded-lg shadow-md`}>
                <h3 className="text-lg font-semibold mb-2">{order.receiver}</h3>                <p><strong>Fecha de Orden:</strong> {new Date(order.orderDate).toLocaleDateString()}</p>
                <p><strong>Área Solicitante:</strong> {order.requesterArea || 'No especificada'}</p>

                {/* Botón para ver detalles */}
                <button
                  className="mt-4 w-full bg-blue-100 text-blue-700 px-4 py-2 rounded border hover:bg-blue-200 hover:text-blue-800"
                  onClick={() => openModal(order)}
                >
                  Ver más información
                </button>
              </div>
            );
          })
        )}
      </div>      {/* Modal para mostrar los detalles del producto */}
      {selectedOrder && (
        <ProductDetailsModal
          isOpen={isModalOpen}
          onClose={closeModal}
          order={selectedOrder}
          onApprove={approveOrder}
          onReject={rejectOrder}
        />
      )}

      {/* Modal de respuesta (aprobación/rechazo) */}
      <OrderRequestResponseModal
        isOpen={isResponseModalOpen}
        title={pendingAction === 'approve' ? 'Aprobar Orden' : 'Rechazar Orden'}
        action={pendingAction || 'reject'}
        onConfirm={handleConfirmAction}
        onCancel={handleCancelAction}
        requestName={selectedOrder?.receiver ? `Orden para: ${selectedOrder.receiver}` : 'Orden'}
        isMessageRequired={pendingAction === 'reject'}
      />

      {/* Modal de historial */}
      <HistoryModal isOpen={isHistoryModalOpen} onClose={closeHistoryModal} />

      {/* Toast Notification Container */}
      <ToastContainer />
    </div>
  );
};

export default ManageOrders;
