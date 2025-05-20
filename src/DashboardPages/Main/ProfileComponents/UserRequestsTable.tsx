import React, { useState, useMemo } from 'react';
import ClipLoader from "react-spinners/ClipLoader";
import { 
  FaCalendar, 
  FaFilter, 
  FaClock, 
  FaUserClock, 
  FaChevronLeft, 
  FaChevronRight,
} from 'react-icons/fa';

interface UserRequestsTableProps {
  labRequests: any[];
  roomRequests: any[];
  loading: boolean;
  error: string | null;
  onRefresh: () => void;
}

// Componente para mostrar estado con color
const RequestStatus: React.FC<{ status: number }> = ({ status }) => {
  let statusText = "Pendiente";
  let bgColor = "bg-yellow-500";
  
  if (status === 1) {
    statusText = "Aprobada";
    bgColor = "bg-green-500";
  } else if (status === 2) {
    statusText = "Rechazada";
    bgColor = "bg-red-500";
  }
  
  return (
    <span className={`${bgColor} text-white text-xs font-semibold px-3 py-1 rounded-full`}>
      {statusText}
    </span>
  );
};

// Función para formatear fecha a formato legible
const formatDisplayDate = (dateString: string): string => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
};

const UserRequestsTable: React.FC<UserRequestsTableProps> = ({
  labRequests,
  roomRequests,
  loading,
  error,
  onRefresh
}) => {
  const [activeTab, setActiveTab] = useState<'labs' | 'rooms'>('labs');
  const [statusFilter, setStatusFilter] = useState<'all' | 0 | 1 | 2>('all');
  const [dateFilter, setDateFilter] = useState<'all' | 'week' | 'month'>('all');
  
  // Estados para paginación
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(15);

  // Filtrar y ordenar solicitudes según los criterios
  const filteredRequests = useMemo(() => {
    const requests = activeTab === 'labs' ? labRequests : roomRequests;
    
    // Filtrar por estado
    let filtered = requests;
    if (statusFilter !== 'all') {
      filtered = filtered.filter(req => req.status === statusFilter);
    }

    // Filtrar por fecha
    if (dateFilter !== 'all') {
      const today = new Date();
      const startDate = new Date();
      
      if (dateFilter === 'week') {
        startDate.setDate(today.getDate() - 7);
      } else if (dateFilter === 'month') {
        startDate.setMonth(today.getMonth() - 1);
      }
      
      filtered = filtered.filter(req => {
        const requestDate = new Date(req.startDate);
        return requestDate >= startDate && requestDate <= today;
      });
    }

    // Ordenar por fecha (más próximas primero)
    return filtered.sort((a, b) => {
      const dateA = new Date(a.startDate);
      const dateB = new Date(b.startDate);
      return dateB.getTime() - dateA.getTime(); // Orden descendente
    });
  }, [activeTab, labRequests, roomRequests, statusFilter, dateFilter]);

  // Calcular número total de páginas
  const totalPages = Math.ceil(filteredRequests.length / itemsPerPage);

  // Obtener elementos para la página actual
  const paginatedRequests = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredRequests.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredRequests, currentPage, itemsPerPage]);

  // Resetear a la primera página cuando cambian los filtros
  React.useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, statusFilter, dateFilter, itemsPerPage]);

  // Función para cambiar de página
  const goToPage = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  return (
    <div className="bg-white rounded-lg shadow-xl overflow-hidden">
      {/* Cabecera con color estandarizado */}
      <div className="bg-gradient-to-r from-gray-800 to-gray-900 p-4 flex justify-between items-center">
        <h2 className="text-white text-xl font-semibold">Mis Solicitudes</h2>
        <button 
          onClick={onRefresh}
          className="bg-white text-gray-800 px-3 py-1 rounded-lg text-sm hover:bg-gray-100 flex items-center"
          disabled={loading}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          {loading ? 'Actualizando...' : 'Actualizar'}
        </button>
      </div>
      
      <div className="p-6">
        {/* Tabs para cambiar entre tipos de solicitud */}
        <div className="flex border-b mb-4">
          <button
            className={`pb-2 px-4 font-semibold ${activeTab === 'labs' 
              ? 'text-blue-600 border-b-2 border-blue-600' 
              : 'text-gray-500 hover:text-blue-600'}`}
            onClick={() => setActiveTab('labs')}
          >
            Laboratorios
          </button>
          <button
            className={`pb-2 px-4 font-semibold ${activeTab === 'rooms' 
              ? 'text-blue-600 border-b-2 border-blue-600' 
              : 'text-gray-500 hover:text-blue-600'}`}
            onClick={() => setActiveTab('rooms')}
          >
            Salas
          </button>
        </div>
        
        {/* Filtros */}
        <div className="flex flex-wrap gap-3 mb-4 bg-gray-50 p-3 rounded-lg">
          <div className="flex items-center">
            <FaFilter className="text-gray-500 mr-2" />
            <span className="text-gray-700 font-medium mr-2">Filtros:</span>
          </div>
          
          {/* Filtro por estado */}
          <div className="flex items-center">
            <label htmlFor="status" className="text-sm text-gray-600 mr-2">Estado:</label>
            <select 
              id="status"
              value={statusFilter === 'all' ? 'all' : statusFilter.toString()}
              onChange={(e) => setStatusFilter(e.target.value === 'all' ? 'all' : Number(e.target.value) as 0 | 1 | 2)}
              className="border rounded px-2 py-1 text-sm"
            >
              <option value="all">Todos</option>
              <option value="0">Pendiente</option>
              <option value="1">Aprobada</option>
              <option value="2">Rechazada</option>
            </select>
          </div>
          
          {/* Filtro por fecha */}
          <div className="flex items-center">
            <label htmlFor="date" className="text-sm text-gray-600 mr-2">Período:</label>
            <select
              id="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value as 'all' | 'week' | 'month')}
              className="border rounded px-2 py-1 text-sm"
            >
              <option value="all">Todas las fechas</option>
              <option value="week">Última semana</option>
              <option value="month">Último mes</option>
            </select>
          </div>
        </div>
        
        {/* Tabla de solicitudes */}
        {loading ? (
          <div className="flex justify-center py-6">
            <ClipLoader color="#3b82f6" size={40} />
          </div>
        ) : error ? (
          <div className="text-red-500 py-4 text-center">
            {error}
          </div>
        ) : filteredRequests.length === 0 ? (
          <div className="bg-gray-50 rounded-lg p-8 text-center">
            <p className="text-gray-500">
              No se encontraron solicitudes para los filtros seleccionados.
            </p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tipo
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Fecha
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Horario
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Descripción
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Estado
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {paginatedRequests.map((request) => (
                    <tr key={activeTab === 'labs' ? request.id_LaboratoryRequest : request.id_RoomRequest} 
                        className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900 flex items-center">
                          {activeTab === 'labs' ? (
                            <>
                              <FaUserClock className="text-blue-600 mr-2" />
                              {request.labName}
                            </>
                          ) : (
                            <>
                              <FaUserClock className="text-green-600 mr-2" />
                              {request.roomName}
                            </>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <FaCalendar className="text-gray-400 mr-2" />
                          <div className="text-sm text-gray-900">
                            {formatDisplayDate(request.startDate)}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <FaClock className="text-gray-400 mr-2" />
                          <div className="text-sm text-gray-900">
                            {request.startTime} - {request.endTime}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900 line-clamp-2">
                          {request.activityDescription}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <RequestStatus status={request.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Controles de paginación */}
            <div className="mt-6 flex flex-col sm:flex-row justify-between items-center border-t pt-4">
              <div className="flex items-center mb-3 sm:mb-0">
                <span className="text-sm text-gray-700 mr-3">
                  Mostrar por página:
                </span>
                <select
                  aria-label="Número de elementos por página"
                  className="border border-gray-300 rounded px-2 py-1 text-sm"
                  value={itemsPerPage}
                  onChange={(e) => setItemsPerPage(Number(e.target.value))}
                >
                  <option value={10}>10</option>
                  <option value={15}>15</option>
                  <option value={20}>20</option>
                  <option value={30}>30</option>
                  <option value={50}>50</option>
                </select>
              </div>
              
              <div className="flex items-center">
                <span className="text-sm text-gray-700 mr-3">
                  Mostrando {Math.min(filteredRequests.length, (currentPage - 1) * itemsPerPage + 1)}-
                  {Math.min(currentPage * itemsPerPage, filteredRequests.length)} de {filteredRequests.length}
                </span>
                
                <div className="flex space-x-1">
                  {/* Botón de página anterior */}
                  <button
                    onClick={() => goToPage(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`px-2 py-1 rounded ${
                      currentPage === 1
                        ? 'text-gray-400 cursor-not-allowed'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <FaChevronLeft size={14} />
                  </button>
                  
                  {/* Números de página */}
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    // Lógica para mostrar las páginas alrededor de la página actual
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }
                    
                    return (
                      <button
                        key={pageNum}
                        onClick={() => goToPage(pageNum)}
                        className={`px-3 py-1 rounded ${
                          currentPage === pageNum
                            ? 'bg-blue-600 text-white'
                            : 'text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                  
                  {/* Botón de página siguiente */}
                  <button
                    onClick={() => goToPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`px-2 py-1 rounded ${
                      currentPage === totalPages
                        ? 'text-gray-400 cursor-not-allowed'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <FaChevronRight size={14} />
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default UserRequestsTable;