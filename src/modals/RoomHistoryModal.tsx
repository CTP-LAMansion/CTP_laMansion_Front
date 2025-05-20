import React, { useState, useEffect } from 'react';
import { RequestStatus, RoomRequest } from '../types/RoomRequestType';
import RoomHistoryDetailsModal from './RoomHistoryDetailsModal';


interface RoomHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  roomRequests: RoomRequest[];
}

const RoomHistoryModal: React.FC<RoomHistoryModalProps> = ({ isOpen, onClose, roomRequests }) => {
  const [filter, setFilter] = useState<RequestStatus | 'All'>('All');
  const [selectedRequest, setSelectedRequest] = useState<RoomRequest | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Estados para paginación
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5); // Número de elementos por página
  
  // Estados para el filtro de fechas
  const [startDateFilter, setStartDateFilter] = useState<string>('');
  const [endDateFilter, setEndDateFilter] = useState<string>('');

  // Reset pagination cuando cambien los filtros
  useEffect(() => {
    setCurrentPage(1);
  }, [filter, searchTerm, startDateFilter, endDateFilter]);

  if (!isOpen) return null;

  // Función para limpiar los filtros de fecha
  const clearDateFilters = () => {
    setStartDateFilter('');
    setEndDateFilter('');
  };

  const filteredRequests = roomRequests.filter(request => {
    // Filtrado por estado
    const statusMatch = filter === 'All' 
      ? request.status === RequestStatus.Approved || request.status === RequestStatus.Rejected
      : request.status === filter;
    
    // Filtrado por nombre
    const nameMatch = `${request.managerName} ${request.managerLastName} ${request.managerLastName2}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    
    // Filtrado por fecha de inicio
    let dateMatch = true;
    const requestDate = new Date(request.startDate);
    
    if (startDateFilter) {
      const filterStartDate = new Date(startDateFilter);
      filterStartDate.setHours(0, 0, 0, 0);
      dateMatch = dateMatch && requestDate >= filterStartDate;
    }
    
    if (endDateFilter) {
      const filterEndDate = new Date(endDateFilter);
      filterEndDate.setHours(23, 59, 59, 999);
      dateMatch = dateMatch && requestDate <= filterEndDate;
    }
    
    return statusMatch && nameMatch && dateMatch;
  });

  // Paginación
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredRequests.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredRequests.length / itemsPerPage);

  // Funciones de navegación
  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const renderPagination = () => {
    if (totalPages <= 1) return null;

    const pages = [];
    const maxVisiblePages = 5;
    let startPage = 1;
    let endPage = totalPages;

    if (totalPages > maxVisiblePages) {
      // Centramos la página actual
      const leftOffset = Math.floor(maxVisiblePages / 2);
      const rightOffset = maxVisiblePages - leftOffset - 1;
      
      if (currentPage > leftOffset) {
        startPage = currentPage - leftOffset;
      }
      
      if (currentPage + rightOffset < totalPages) {
        endPage = currentPage + rightOffset;
      } else {
        endPage = totalPages;
        startPage = Math.max(1, totalPages - maxVisiblePages + 1);
      }
    }

    // Botón primera página
    if (startPage > 1) {
      pages.push(
        <button 
          key="first" 
          onClick={() => goToPage(1)}
          className="px-3 py-1 mx-1 rounded border border-gray-300 hover:bg-gray-100"
        >
          &laquo;
        </button>
      );
    }

    // Botones de páginas numeradas
    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => goToPage(i)}
          className={`px-3 py-1 mx-1 rounded ${
            currentPage === i
              ? 'bg-blue-500 text-white'
              : 'border border-gray-300 hover:bg-gray-100'
          }`}
        >
          {i}
        </button>
      );
    }

    // Botón última página
    if (endPage < totalPages) {
      pages.push(
        <button 
          key="last" 
          onClick={() => goToPage(totalPages)}
          className="px-3 py-1 mx-1 rounded border border-gray-300 hover:bg-gray-100"
        >
          &raquo;
        </button>
      );
    }

    return pages;
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50" onClick={onClose}>
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-4xl w-full relative" onClick={(e) => e.stopPropagation()}>
        <h2 className="text-2xl font-semibold mb-4">Historial de Solicitudes de Sala</h2>

        {/* Filtro por gestor */}
        <div className="flex justify-center mb-4">
          <input
            type="text"
            placeholder="Buscar por gestor..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border border-gray-300 px-4 py-2 rounded-md w-1/2"
          />
        </div>

        {/* Fila de filtros: estado y fechas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          {/* Filtro por estado */}
          <div className="flex flex-col items-center">
            <label className="text-sm text-gray-600 mb-1">Estado</label>
            <select
              className="border border-gray-300 px-4 py-2 rounded-md w-full"
              value={filter}
              onChange={(e) => {
                const value = e.target.value;
                setFilter(value === 'All' ? 'All' : Number(value) as RequestStatus);
              }}
            >
              <option value={RequestStatus.Approved}>Aprobadas</option>
              <option value={RequestStatus.Rejected}>Rechazadas</option>
              <option value="All">Todas</option>
            </select>
          </div>
          
          {/* Filtros de fecha */}
          <div className="flex flex-col items-center">
            <label className="text-sm text-gray-600 mb-1">Desde</label>
            <input
              type="date"
              className="border border-gray-300 px-4 py-2 rounded-md w-full"
              value={startDateFilter}
              onChange={(e) => setStartDateFilter(e.target.value)}
            />
          </div>
          
          <div className="flex flex-col items-center">
            <label className="text-sm text-gray-600 mb-1">Hasta</label>
            <div className="flex w-full">
              <input
                type="date"
                className="border border-gray-300 px-4 py-2 rounded-l-md flex-grow"
                value={endDateFilter}
                onChange={(e) => setEndDateFilter(e.target.value)}
              />
              {(startDateFilter || endDateFilter) && (
                <button 
                  onClick={clearDateFilters}
                  className="bg-gray-200 px-2 py-2 rounded-r-md hover:bg-gray-300"
                  title="Limpiar filtros de fecha"
                >
                  ✕
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Contenedor con altura fija para la tabla */}
        <div className="h-[350px] flex flex-col">
          <div className="flex-grow overflow-y-auto mb-3">
            {filteredRequests.length === 0 ? (
              <div className="flex items-center justify-center h-full">
                <p className="text-center text-gray-600">No hay solicitudes disponibles.</p>
              </div>
            ) : (
              <table className="table-auto w-full text-left border-collapse">
                <thead className="sticky top-0 bg-white z-10">
                  <tr className="bg-gray-100">
                    <th className="px-4 py-2 border text-gray-600 text-center">Gestor</th>
                    <th className="px-4 py-2 border text-gray-600 text-center">Fecha de Inicio</th>
                    <th className="px-4 py-2 border text-gray-600 text-center">Estado</th>
                    <th className="px-4 py-2 border text-gray-600 text-center">Acción</th>
                  </tr>
                </thead>
                <tbody>
                  {currentItems.map((request) => (
                    <tr key={request.id_RoomRequest} className="hover:bg-gray-50">
                      <td className="px-4 py-2 border text-center">
                        {request.managerName} {request.managerLastName} {request.managerLastName2}
                      </td>
                      <td className="px-4 py-2 border text-center">
                        {new Date(request.startDate).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-2 border text-center">
                        <span
                          className={`px-2 py-1 rounded-full text-white ${
                            request.status === RequestStatus.Approved
                              ? 'bg-green-500'
                              : request.status === RequestStatus.Rejected
                              ? 'bg-red-500'
                              : 'bg-yellow-500'
                          }`}
                        >
                          {request.status === RequestStatus.Approved
                            ? 'Aprobada'
                            : request.status === RequestStatus.Rejected
                            ? 'Rechazada'
                            : 'Pendiente'}
                        </span>
                      </td>
                      <td className="px-4 py-2 border text-center">
                        <button
                          className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                          onClick={() => setSelectedRequest(request)}
                        >
                          Ver detalles
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* Área de paginación con altura fija */}
          <div className="h-[50px] mt-2">
            {filteredRequests.length > 0 && (
              <div className="flex justify-center items-center h-full">
                <div className="flex flex-wrap">
                  <button
                    onClick={() => goToPage(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`px-3 py-1 mx-1 rounded ${
                      currentPage === 1
                        ? 'text-gray-400 cursor-not-allowed border border-gray-200'
                        : 'border border-gray-300 hover:bg-gray-100'
                    }`}
                  >
                    Anterior
                  </button>
                  
                  {renderPagination()}
                  
                  <button
                    onClick={() => goToPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`px-3 py-1 mx-1 rounded ${
                      currentPage === totalPages || totalPages === 0
                        ? 'text-gray-400 cursor-not-allowed border border-gray-200'
                        : 'border border-gray-300 hover:bg-gray-100'
                    }`}
                  >
                    Siguiente
                  </button>
                </div>
                
                <div className="ml-4 text-sm text-gray-600">
                  Página {currentPage} de {totalPages || 1}
                  <span className="hidden sm:inline"> | Mostrando {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, filteredRequests.length)} de {filteredRequests.length}</span>
                </div>
              </div>
            )}
          </div>
        </div>

        <button className="absolute top-2 right-2 text-gray-500 hover:text-gray-700" onClick={onClose}>
          &#x2715;
        </button>

        {selectedRequest && (
          <RoomHistoryDetailsModal
            isOpen={!!selectedRequest}
            onClose={() => setSelectedRequest(null)}
            request={selectedRequest}
          />
        )}
      </div>
    </div>
  );
};

export default RoomHistoryModal;