import React, { useEffect, useState } from 'react';
import { addUserRole, getUserRoles, getUsers, removeUserRole, deleteUser, getUserById, PaginatedResponse } from '../../services/userService';
import { FaUserCircle, FaPhone, FaEnvelope, FaIdCard, FaTrash, FaInfoCircle, FaTimesCircle, FaCheckCircle, FaSpinner } from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ClipLoader from 'react-spinners/ClipLoader';

interface User {
  id: number;
  name: string;
  lastName: string;
  lastName2: string;
  email: string;
  phoneNumber: string;
  address?: string;
  identificationNumber?: string;
  emergencyPhoneNumber?: string;
  profilePicture?: string;
  institutionJoinDate?: string;
  workJoinDate?: string;
}

interface Role {
  id: number;
  name: string;
}

interface DetailedUser extends User {
  fullInfo: boolean;
}

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
}

const roleNames: { [key: number]: string } = {
  1: "Admin",
  2: "Editor de perfil",
  3: "Encarg. UDP",
  4: "Encarg. Certificados",
  5: "Encarg. Labs",
  6: "Editor de Contenido",
  7: "Encarg. Salas",
  8: "Encarg. Sala de Conf.",
  9: "Solicitante de Salas y Labs",
};

// Componente del modal de confirmación
const ConfirmationModal: React.FC<ConfirmationModalProps> = ({ isOpen, onClose, onConfirm, title, message }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <h2 className="text-xl font-bold text-gray-800 mb-4">{title}</h2>
        <p className="text-gray-600 mb-6">{message}</p>
        <div className="flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
          >
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
};

// Componente principal de gestión de usuarios
const RolesManagement: React.FC = () => {
  const [users, setUsers] = useState<DetailedUser[]>([]);
  const [roles, setRoles] = useState<{ [key: number]: Role[] }>({});
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<number | null>(null);
  const [closingUser, setClosingUser] = useState<number | null>(null);
  const [userDetailsLoading, setUserDetailsLoading] = useState<{ [key: number]: boolean }>({});
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [rolesLoading, setRolesLoading] = useState(true);

  // Estados para paginación
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);

  // Cargar usuarios y roles al iniciar
  useEffect(() => {
    fetchUsersAndRoles();
  }, [currentPage, pageSize]); // Recargar cuando cambia la página o el tamaño de página

  const fetchUsersAndRoles = async () => {
    try {
      setIsLoadingUsers(true);
      setRolesLoading(true);

      const response = await getUsers(currentPage, pageSize);

      // Verificar si la respuesta está paginada
      if (response.items && response.totalItems !== undefined) {
        // Respuesta paginada
        const paginatedResponse = response as PaginatedResponse<User>;
        const detailedUsers = paginatedResponse.items.map(user => ({ ...user, fullInfo: false }));

        setUsers(detailedUsers);
        setTotalItems(paginatedResponse.totalItems);
        setTotalPages(paginatedResponse.totalPages);
      } else {
        // Respuesta no paginada (comportamiento anterior)
        const detailedUsers = Array.isArray(response)
          ? response.map(user => ({ ...user, fullInfo: false }))
          : [];
        setUsers(detailedUsers);
      }

      const rolesData: { [key: number]: Role[] } = {};
      // Solo cargar roles para los usuarios de la página actual
      for (const user of Array.isArray(response.items) ? response.items : response) {
        const userRoles = await getUserRoles(user.id);
        rolesData[user.id] = userRoles;
      }
      setRoles(rolesData);
    } catch (error) {
      console.error('Error al obtener usuarios o roles:', error);
      toast.error('Error al cargar los usuarios');
      setUsers([]);
    } finally {
      setIsLoadingUsers(false);
      setRolesLoading(false);
    }
  };

  // Manejar cambios de roles (añadir/eliminar)
  const handleRoleChange = async (userId: number, roleId: number, isAssigned: boolean) => {
    try {
      // Desactivar los botones de roles para este usuario durante la operación
      setRolesLoading(true);

      if (isAssigned) {
        await removeUserRole(userId, roleId);
        toast.success("Rol eliminado correctamente");
      } else {
        await addUserRole(userId, roleId);
        toast.success("Rol asignado correctamente");
      }

      const updatedRoles = await getUserRoles(userId);
      setRoles((prevRoles) => ({ ...prevRoles, [userId]: updatedRoles }));
    } catch (error) {
      console.error('Error al cambiar roles:', error);
      toast.error('Error al modificar los roles');
    } finally {
      setRolesLoading(false);
    }
  };

  // Cargar detalles completos del usuario
  const loadUserDetails = async (userId: number) => {
    try {
      setUserDetailsLoading(prev => ({ ...prev, [userId]: true }));

      const userDetails = await getUserById(userId);
      setUsers(prevUsers =>
        prevUsers.map(user =>
          user.id === userId
            ? { ...user, ...userDetails, fullInfo: true }
            : user
        )
      );
    } catch (error) {
      console.error(`Error al cargar detalles del usuario ${userId}:`, error);
      toast.error('Error al cargar los detalles del usuario');
    } finally {
      setUserDetailsLoading(prev => ({ ...prev, [userId]: false }));
    }
  };

  // Manejar la visualización de detalles del usuario
  const toggleUserDetails = async (userId: number) => {
    const user = users.find(u => u.id === userId);

    if (selectedUser === userId) {
      // Cerrando detalles - primero registramos el id para la animación de cierre
      setClosingUser(userId);
      // Esperamos a que termine la animación antes de ocultar realmente
      setTimeout(() => {
        setSelectedUser(null);
        setClosingUser(null);
      }, 400); // Tiempo de la animación (coincide con la duración CSS)
    } else {
      // Abriendo detalles
      if (user && !user.fullInfo) {
        await loadUserDetails(userId);
      }
      setSelectedUser(userId);
    }
  };

  // Confirmar eliminación de usuario
  const confirmDelete = (user: User) => {
    setUserToDelete(user);
    setShowDeleteModal(true);
  };

  // Eliminar usuario
  const handleDeleteUser = async () => {
    if (!userToDelete) return;

    try {
      await deleteUser(userToDelete.id);
      setUsers(prevUsers => prevUsers.filter(user => user.id !== userToDelete.id));
      toast.success(`Usuario ${userToDelete.name} eliminado correctamente`);
      setShowDeleteModal(false);
      setUserToDelete(null);
    } catch (error) {
      console.error(`Error al eliminar el usuario ${userToDelete.id}:`, error);
      toast.error('Error al eliminar el usuario');
    }
  };

  // Filtrar usuarios según término de búsqueda
  const filteredUsers = users.filter((user) =>
    `${user.name} ${user.lastName} ${user.lastName2} ${user.email}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  // Formatear fecha para mostrar
  const formatDate = (dateString?: string) => {
    if (!dateString) return "No disponible";
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  // Manejar cambio en el tamaño de página
  const handlePageSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newSize = parseInt(e.target.value);
    setPageSize(newSize);
    setCurrentPage(1); // Resetear a la primera página al cambiar el tamaño
  };

  return (
    <div className="container mx-auto p-4 md:p-8 bg-gray-100 min-h-screen">
      <h1 className="text-2xl md:text-3xl font-extrabold text-gray-800 mb-6 text-center">
        Gestión de Usuarios
      </h1>

      <div className="mb-6 bg-blue-50 p-4 rounded-lg border border-blue-200">
        <p className="text-blue-700 text-center font-medium">
          Aquí puede administrar los usuarios del sistema, asignar roles y ver información detallada.
        </p>
      </div>

      {/* Panel de búsqueda y configuración */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          {/* Barra de búsqueda */}
          <div className="relative flex-grow md:max-w-md">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <FaUserCircle className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Buscar por nombre, apellido o correo electrónico"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
            />
          </div>

          {/* Control de tamaño de página */}
          <div className="flex items-center">
            <label htmlFor="pageSize" className="mr-2 text-gray-700">Mostrar:</label>
            <select
              id="pageSize"
              value={pageSize}
              onChange={handlePageSizeChange}
              className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
            </select>
          </div>
        </div>
      </div>

      {/* Indicador de carga para usuarios */}
      {isLoadingUsers && (
        <div className="flex justify-center items-center py-8">
          <ClipLoader color="#3b82f6" size={100} />
        </div>
      )}

      {/* Lista de usuarios (se oculta durante la carga) */}
      {!isLoadingUsers && (
        <>
          {filteredUsers.length === 0 ? (
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <p className="text-gray-500 text-lg">No se encontraron usuarios con ese criterio de búsqueda</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-auto grid-flow-row-dense">
              {filteredUsers.map((user) => {
                const userRoles = roles[user.id] || [];
                const availableRoles = Object.keys(roleNames)
                  .map(Number)
                  .filter((roleId) => !userRoles.some((role) => role.id === roleId));

                const isSelected = selectedUser === user.id;

                return (
                  <div
                    key={user.id}
                    className={`bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 
                      ${isSelected ? 'ring-2 ring-blue-500 col-span-1 row-span-1' : 'hover:shadow-lg'}`}
                    style={{ height: 'fit-content' }}
                  >
                    {/* Cabecera del usuario */}
                    <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-b">
                      <div className="flex justify-between items-center">
                        <h2 className="text-xl font-bold text-gray-800 truncate">
                          {user.name} {user.lastName}
                        </h2>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => toggleUserDetails(user.id)}
                            className="p-1.5 rounded-full text-blue-600 hover:bg-blue-100"
                            title="Ver detalles"
                          >
                            <FaInfoCircle size={18} />
                          </button>
                          <button
                            onClick={() => confirmDelete(user)}
                            className="p-1.5 rounded-full text-red-600 hover:bg-red-100"
                            title="Eliminar usuario"
                          >
                            <FaTrash size={18} />
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Información de contacto */}
                    <div className="p-4">
                      <div className="flex items-center space-x-2 mb-2">
                        <FaEnvelope className="text-gray-500 min-w-[16px]" />
                        <p className="text-gray-700 truncate">{user.email}</p>
                      </div>
                      {user.phoneNumber && (
                        <div className="flex items-center space-x-2">
                          <FaPhone className="text-gray-500 min-w-[16px]" />
                          <p className="text-gray-700">{user.phoneNumber}</p>
                        </div>
                      )}
                    </div>

                    {/* Detalles extendidos (condicional) - CORRECCIÓN */}
                    {(isSelected || closingUser === user.id) && (
                      <div className={`border-t border-gray-200 bg-gray-50 ${closingUser === user.id ? 'animate-collapse' : 'animate-expand'
                        }`}>
                        {userDetailsLoading[user.id] ? (
                          <div className="text-center py-4">
                            <p className="text-gray-500">Cargando información detallada...</p>
                          </div>
                        ) : (
                          <div className="p-4">
                            <h3 className="font-semibold text-gray-700 mb-3">Información Detallada</h3>
                            <div className="space-y-2">
                              {user.identificationNumber && (
                                <div className="flex items-start space-x-2">
                                  <FaIdCard className="text-gray-500 mt-1 min-w-[16px]" />
                                  <div>
                                    <p className="text-sm text-gray-500">Identificación:</p>
                                    <p className="text-gray-700">{user.identificationNumber}</p>
                                  </div>
                                </div>
                              )}
                              {user.address && (
                                <div className="flex items-start space-x-2">
                                  <FaIdCard className="text-gray-500 mt-1 min-w-[16px]" />
                                  <div>
                                    <p className="text-sm text-gray-500">Dirección:</p>
                                    <p className="text-gray-700">{user.address}</p>
                                  </div>
                                </div>
                              )}
                              {user.emergencyPhoneNumber && (
                                <div className="flex items-start space-x-2">
                                  <FaPhone className="text-gray-500 mt-1 min-w-[16px]" />
                                  <div>
                                    <p className="text-sm text-gray-500">Teléfono de emergencia:</p>
                                    <p className="text-gray-700">{user.emergencyPhoneNumber}</p>
                                  </div>
                                </div>
                              )}
                              {user.institutionJoinDate && (
                                <div className="flex items-start space-x-2">
                                  <FaIdCard className="text-gray-500 mt-1 min-w-[16px]" />
                                  <div>
                                    <p className="text-sm text-gray-500">Ingreso a la institución:</p>
                                    <p className="text-gray-700">{formatDate(user.institutionJoinDate)}</p>
                                  </div>
                                </div>
                              )}
                              {user.workJoinDate && (
                                <div className="flex items-start space-x-2">
                                  <FaIdCard className="text-gray-500 mt-1 min-w-[16px]" />
                                  <div>
                                    <p className="text-sm text-gray-500">Ingreso laboral:</p>
                                    <p className="text-gray-700">{formatDate(user.workJoinDate)}</p>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Sección de roles - Mover dentro del card para que no haya espacio intermedio */}
                    <div className={`p-4 ${isSelected ? 'border-t border-gray-200' : ''}`}>
                      {/* Sección de Roles Asignados */}
                      <h3 className="font-semibold text-gray-700 mb-2">Roles Asignados</h3>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {rolesLoading ? (
                          <div className="flex items-center space-x-2 text-gray-500">
                            <FaSpinner className="animate-spin" />
                            <span>Cargando roles...</span>
                          </div>
                        ) : userRoles.length > 0 ? (
                          userRoles
                            .filter((role) => role.id !== 2)
                            .map((role) => (
                              <button
                                key={role.id}
                                onClick={() => handleRoleChange(user.id, role.id, true)}
                                disabled={rolesLoading}
                                className={`px-2 py-1 text-xs bg-green-100 text-green-600 font-medium rounded-full flex items-center
                                ${rolesLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-green-500 hover:text-white'}`}
                              >
                                {roleNames[role.id]} <  FaCheckCircle className="ml-1" />
                              </button>
                            ))
                        ) : (
                          <p className="text-sm text-gray-500">No hay roles asignados</p>
                        )}
                      </div>

                      {/* Sección de Roles Disponibles */}
                      {!rolesLoading && availableRoles.length > 0 && (
                        <>
                          <h3 className="font-semibold text-gray-700 mb-2">Roles Disponibles</h3>
                          <div className="flex flex-wrap gap-2">
                            {availableRoles.map((roleId) => (
                              <button
                                key={roleId}
                                onClick={() => handleRoleChange(user.id, roleId, false)}
                                disabled={rolesLoading}
                                className={`px-2 py-1 text-xs bg-red-100 text-red-600 font-medium rounded-full flex items-center
            ${rolesLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-red-500 hover:text-white'}`}
                              >
                                {roleNames[roleId]} <FaTimesCircle className="ml-1" />
                              </button>
                            ))}
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Controles de paginación simplificados al estilo ReactPagination */}
          {totalItems > 0 && (
            <div className="mt-8 flex justify-center">
              <div className="flex">
                {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                  // Determinar qué página mostrar en cada posición
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
                      onClick={() => setCurrentPage(pageNum)}
                      className={`h-8 w-8 mx-1 flex items-center justify-center rounded ${currentPage === pageNum
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </>
      )}

      {/* Modal de confirmación para eliminar usuario */}
      <ConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteUser}
        title="Confirmar eliminación"
        message={`¿Está seguro que desea eliminar a ${userToDelete?.name} ${userToDelete?.lastName}? Esta acción no se puede deshacer.`}
      />

      {/* Contenedor de notificaciones Toast */}
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default RolesManagement;