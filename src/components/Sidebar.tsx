import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  FaHome,
  FaCertificate,
  FaChevronDown,
  FaChevronUp,
  FaPlus,
  FaBars,
  FaCartArrowDown,
  FaUserCircle,
  FaCaretDown,
  FaImage,
  FaTimes,
  FaChartBar,
  FaSignOutAlt,
  FaRuler
} from 'react-icons/fa';
import { MdRoom, MdScience } from 'react-icons/md';
import { GiTeacher, GiTakeMyMoney } from 'react-icons/gi';
import { IoIosConstruct } from 'react-icons/io';
import { BsJournal } from 'react-icons/bs';
import { FaCog } from 'react-icons/fa';
import { FiUsers } from 'react-icons/fi';
import { DocumentTextIcon } from '@heroicons/react/24/solid';
import { useAuth } from '../contexts/AuthContext';

// Define los nombres de políticas para validar roles - igual que en AppRouter.tsx
const policies = {
  admin: ['Admin'],
  adminOrUDPManager: ['Admin', 'UDPManager'],
  adminOrContentEditor: ['Admin', 'ContentEditor'],
  roomManagement: ['Admin', 'RoomManager'],
  labManagement: ['Admin', 'LabManager'],
  certificationManagement: ['Admin', 'CertificationManager'],
  conferenceRoomManagement: ['Admin', 'ConferenceRoomManager'],
  requester: ['RoomandLabRequester'],
  allManagers: ['Admin', 'UDPManager', 'CertificationManager', 'LabManager', 
               'RoomManager', 'ContentEditor', 'ConferenceRoomManager']
};

// Función para obtener el rol más relevante para mostrar al usuario
const getDisplayRole = (roles: string[] | undefined) => {
  if (!roles || roles.length === 0) return 'Usuario';
  
  // Orden de prioridad de roles para mostrar
  const rolePriority = [
    'Admin', 
    'UDPManager',
    'RoomManager',
    'LabManager',
    'CertificationManager',
    'ContentEditor',
    'ConferenceRoomManager',
    'RoomandLabRequester'
  ];
  
  // Nombres más amigables para mostrar
  const roleDisplay: Record<string, string> = {
    'Admin': 'Administrador',
    'UDPManager': 'Administrador UDP',
    'RoomManager': 'Administrador de Salas',
    'LabManager': 'Administrador de Laboratorios',
    'CertificationManager': 'Administrador de Certificaciones',
    'ContentEditor': 'Editor de Contenido',
    'ConferenceRoomManager': 'Administrador de Conferencias',
    'RoomandLabRequester': 'Solicitante'
  };

  // Encuentra el rol de mayor prioridad que tenga el usuario
  for (const priority of rolePriority) {
    if (roles.includes(priority)) {
      return roleDisplay[priority] || priority;
    }
  }
  
  // Si no encuentra ninguno de los roles prioritarios, muestra el primero
  return roleDisplay[roles[0]] || roles[0];
};

const Sidebar: React.FC = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSolicitudesOpen, setIsSolicitudesOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isGestionesOpen, setIsGestionesOpen] = useState(false);
  const [isUDPOpen, setIsUDPOpen] = useState(false);
  const [isCreacionElaboracionOpen, setIsCreacionElaboracionOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  
  const menuRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const hamburgerRef = useRef<HTMLButtonElement>(null);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Detectar si estamos en móvil
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // Actualizar estado móvil cuando cambie el tamaño de ventana
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setIsMobileMenuOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Cerrar menú móvil cuando cambie la ruta
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  // Botón de colapsar para escritorio
  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  // Manejar clic del botón hamburguesa
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Cerrar el menú de perfil al hacer clic fuera
  const handleClickOutside = useCallback((event: MouseEvent) => {
    // No cerrar el menú si se hace clic en el botón hamburguesa
    if (hamburgerRef.current && hamburgerRef.current.contains(event.target as Node)) {
      return;
    }
    
    if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
      setIsProfileMenuOpen(false);
    }
    
    // Cerrar menú móvil al hacer clic fuera, pero no si se clica el botón
    if (mobileMenuRef.current && 
        isMobileMenuOpen && 
        !mobileMenuRef.current.contains(event.target as Node)) {
      setIsMobileMenuOpen(false);
    }
  }, [isMobileMenuOpen]);

  // Cierra el menú con Escape
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      setIsProfileMenuOpen(false);
      if (isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    }
  }, [isMobileMenuOpen]);

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleClickOutside, handleKeyDown]);

  const handleLogout = useCallback(() => {
    logout();
    navigate('/login');
  }, [logout, navigate]);

  const hasRole = (requiredRoles: string[]) => {
    return user?.roles?.some((role) => requiredRoles.includes(role));
  };

  const hasAnyRole = (roles: string[]) => {
    return roles.some((role) => user?.roles?.includes(role));
  };

  // Renderiza el contenido común para ambas versiones
  const renderMenuItems = () => {
    return (
      <>
        {/* Links del menú */}
        <Link 
          to="/dashboard" 
          className={`flex items-center mb-4 rounded hover:bg-gray-700 p-2 ${location.pathname === '/dashboard' ? 'bg-gray-700' : ''}`}
        >
          <FaHome size={24} className="mr-2" />
          {(!isSidebarCollapsed || isMobile) && <span className="text-lg">Inicio</span>}
        </Link>

        {/* Sección de Solicitudes */}
        {hasRole(policies.requester) && (
          <div className="mb-4">
            <h3
              className="text-lg font-semibold mb-2 flex justify-between items-center cursor-pointer p-2 hover:bg-gray-700 rounded"
              onClick={() => setIsSolicitudesOpen(!isSolicitudesOpen)}
            >
              <div className="flex items-center">
                <MdRoom size={24} className="mr-2" />
                {(!isSidebarCollapsed || isMobile) && <span>Solicitudes</span>}
              </div>
              {(!isSidebarCollapsed || isMobile) && (isSolicitudesOpen ? <FaChevronUp /> : <FaChevronDown />)}
            </h3>
            {isSolicitudesOpen && (!isSidebarCollapsed || isMobile) && (
              <div className="pl-4">
                <Link to="/dashboard/solicitar-sala" className={`flex items-center mb-2 hover:bg-gray-700 p-2 rounded ${location.pathname === '/dashboard/solicitar-sala' ? 'bg-gray-700' : ''}`}>
                  <MdRoom className="mr-2" />
                  Solicitar sala
                </Link>
                <Link to="/dashboard/solicitar-laboratorio" className={`flex items-center mb-2 hover:bg-gray-700 p-2 rounded ${location.pathname === '/dashboard/solicitar-laboratorio' ? 'bg-gray-700' : ''}`}>
                  <MdScience className="mr-2" />
                  Solicitar laboratorio
                </Link>
                <Link to="/dashboard/orden-de-pedido" className={`flex items-center mb-2 hover:bg-gray-700 p-2 rounded ${location.pathname === '/dashboard/orden-de-pedido' ? 'bg-gray-700' : ''}`}>
                  <FaPlus className="mr-2" />
                  Orden de Pedido
                </Link>
              </div>
            )}
          </div>
        )}

        {/* Admin y Gestión */}
        {hasRole(policies.admin) && (
          <div className="mb-4">
            <h3
              className="text-lg font-semibold mb-2 flex justify-between items-center cursor-pointer p-2 hover:bg-gray-700 rounded"
              onClick={() => setIsAdminOpen(!isAdminOpen)}
            >
              <div className="flex items-center">
                <FiUsers size={24} className="mr-2" />
                {(!isSidebarCollapsed || isMobile) && <span>Administración</span>}
              </div>
              {(!isSidebarCollapsed || isMobile) && (isAdminOpen ? <FaChevronUp /> : <FaChevronDown />)}
            </h3>
            {isAdminOpen && (!isSidebarCollapsed || isMobile) && (
              <div className="pl-4">
                <Link to="/dashboard/roles" className={`flex items-center mb-2 hover:bg-gray-700 p-2 rounded ${location.pathname === '/dashboard/roles' ? 'bg-gray-700' : ''}`}>
                  <FiUsers className="mr-2" />
                  Gestión de roles
                </Link>
                <Link to="/dashboard/ordenesdepedido" className={`flex items-center mb-2 hover:bg-gray-700 p-2 rounded ${location.pathname === '/dashboard/ordenesdepedido' ? 'bg-gray-700' : ''}`}>
                  <FaCartArrowDown className="mr-2" />
                  Órdenes de pedido
                </Link>
                <Link to="/dashboard/GraficoSalas" className={`flex items-center mb-2 hover:bg-gray-700 p-2 rounded ${location.pathname === '/dashboard/GraficoSalas' ? 'bg-gray-700' : ''}`}>
                  <FaChartBar className="mr-2" />
                  Estadísticas
                </Link>
              </div>
            )}
          </div>
        )}

        {/* Gestiones según roles */}
        {(hasRole(policies.roomManagement) || hasRole(policies.labManagement) || 
          hasRole(policies.certificationManagement)) && (
          <div className="mb-4">
            <h3
              className="text-lg font-semibold mb-2 flex justify-between items-center cursor-pointer p-2 hover:bg-gray-700 rounded"
              onClick={() => setIsGestionesOpen(!isGestionesOpen)}
            >
              <div className="flex items-center">
                <FiUsers size={24} className="mr-2" />
                {(!isSidebarCollapsed || isMobile) && <span>Gestiones</span>}
              </div>
              {(!isSidebarCollapsed || isMobile) && (isGestionesOpen ? <FaChevronUp /> : <FaChevronDown />)}
            </h3>
            {isGestionesOpen && (!isSidebarCollapsed || isMobile) && (
              <div className="pl-4">
                {hasRole(policies.roomManagement) && (
                  <>
                    <Link to="/dashboard/salas" className={`flex items-center mb-2 hover:bg-gray-700 p-2 rounded ${location.pathname === '/dashboard/salas' ? 'bg-gray-700' : ''}`}>
                      <MdRoom className="mr-2" />
                      Solicitudes de salas
                    </Link>
                    <Link to="/dashboard/elaborar-salas" className={`flex items-center mb-2 hover:bg-gray-700 p-2 rounded ${location.pathname === '/dashboard/elaborar-salas' ? 'bg-gray-700' : ''}`}>
                      <MdRoom className="mr-2" />
                      Administrar salas
                    </Link>
                  </>
                )}
                {hasRole(policies.labManagement) && (
                  <>
                    <Link to="/dashboard/laboratorios" className={`flex items-center mb-2 hover:bg-gray-700 p-2 rounded ${location.pathname === '/dashboard/laboratorios' ? 'bg-gray-700' : ''}`}>
                      <MdScience className="mr-2" />
                      Solicitudes de laboratorios
                    </Link>
                    <Link to="/dashboard/elaborar-laboratorios" className={`flex items-center mb-2 hover:bg-gray-700 p-2 rounded ${location.pathname === '/dashboard/elaborar-laboratorios' ? 'bg-gray-700' : ''}`}>
                      <MdScience className="mr-2" />
                      Administrar laboratorios
                    </Link>
                  </>
                )}
                {hasRole(policies.certificationManagement) && (
                  <Link to="/dashboard/certificaciones" className={`flex items-center mb-2 hover:bg-gray-700 p-2 rounded ${location.pathname === '/dashboard/certificaciones' ? 'bg-gray-700' : ''}`}>
                    <FaCertificate className="mr-2" />
                    Certificaciones
                  </Link>
                )}
              </div>
            )}
          </div>
        )}
        
        {/* UDPs - AdminOrUDPManager */}
        {hasRole(policies.adminOrUDPManager) && (
          <div className="mb-4">
            <h3
              className="text-lg font-semibold mb-2 flex justify-between items-center cursor-pointer p-2 hover:bg-gray-700 rounded"
              onClick={() => setIsUDPOpen(!isUDPOpen)}
            >
              <div className="flex items-center">
                <GiTeacher size={24} className="mr-2" />
                {(!isSidebarCollapsed || isMobile) && <span>UDPs</span>}
              </div>
              {(!isSidebarCollapsed || isMobile) && (isUDPOpen ? <FaChevronUp /> : <FaChevronDown />)}
            </h3>
            {isUDPOpen && (!isSidebarCollapsed || isMobile) && (
              <div className="pl-4">
                <Link to="/dashboard/udps" className={`flex items-center mb-2 hover:bg-gray-700 p-2 rounded ${location.pathname === '/dashboard/udps' ? 'bg-gray-700' : ''}`}>
                  <GiTeacher className="mr-2" />
                  Gestionar UDPs
                </Link>
                <Link to="/dashboard/admin-udp-balance" className={`flex items-center mb-2 hover:bg-gray-700 p-2 rounded ${location.pathname === '/dashboard/admin-udp-balance' ? 'bg-gray-700' : ''}`}>
                  <GiTakeMyMoney className="mr-2" />
                  Balance UDP
                </Link>
              </div>
            )}
          </div>
        )}

        {/* Creación y Elaboración - Contenido */}
        {hasRole(policies.adminOrContentEditor) && (
  <div className="mb-4">
    <h3
      className="text-lg font-semibold mb-2 flex justify-between items-center cursor-pointer p-2 hover:bg-gray-700 rounded"
      onClick={() => setIsCreacionElaboracionOpen(!isCreacionElaboracionOpen)}
    >
      <div className="flex items-center">
        <IoIosConstruct size={24} className="mr-2" />
        {(!isSidebarCollapsed || isMobile) && <span>Contenido Académico</span>}
      </div>
      {(!isSidebarCollapsed || isMobile) && (isCreacionElaboracionOpen ? <FaChevronUp /> : <FaChevronDown />)}
    </h3>
    {isCreacionElaboracionOpen && (!isSidebarCollapsed || isMobile) && (
      <div className="pl-4">
        <Link to="/dashboard/eventos" className={`flex items-center mb-2 hover:bg-gray-700 p-2 rounded ${location.pathname === '/dashboard/eventos' ? 'bg-gray-700' : ''}`}>
          <IoIosConstruct className="mr-2" />
          Eventos
        </Link>
        <Link to="/dashboard/especialidades" className={`flex items-center mb-2 hover:bg-gray-700 p-2 rounded ${location.pathname === '/dashboard/especialidades' ? 'bg-gray-700' : ''}`}>
          <BsJournal className="mr-2" />
          Especialidades
        </Link>
        <Link to="/dashboard/talleres" className={`flex items-center mb-2 hover:bg-gray-700 p-2 rounded ${location.pathname === '/dashboard/talleres' ? 'bg-gray-700' : ''}`}>
          <FaCog className="mr-2" />
          Talleres
        </Link>
        <Link to="/dashboard/galeria" className={`flex items-center mb-2 hover:bg-gray-700 p-2 rounded ${location.pathname === '/dashboard/galeria' ? 'bg-gray-700' : ''}`}>
          <FaImage className="mr-2" />
          Galería
        </Link>
        {/* Nuevo enlace para Unidades de Medida */}
        <Link to="/dashboard/unidades-medida" className={`flex items-center mb-2 hover:bg-gray-700 p-2 rounded ${location.pathname === '/dashboard/unidades-medida' ? 'bg-gray-700' : ''}`}>
          <FaRuler className="mr-2" />
          Unidades de Medida
        </Link>
      </div>
    )}
  </div>
)}

        {/* Nuevo enlace para Documentos - Todos los Managers */}
        {hasAnyRole(policies.allManagers) && (
          <Link
            to="/dashboard/documents"
            className={`flex items-center px-4 py-2 mt-2 text-gray-600 transition-colors duration-300 transform hover:bg-gray-100 hover:text-gray-700 ${
              location.pathname === '/dashboard/documents' ? 'bg-gray-100 text-gray-700' : ''
            }`}
          >
            <DocumentTextIcon className="w-5 h-5" />
            <span className="mx-4 font-medium">Documentos</span>
          </Link>
        )}
      </>
    );
  };

  return (
    <>
      {/* Botón de hamburguesa para versión móvil - CAMBIADO A LA IZQUIERDA */}
      {isMobile && (
        <button 
          ref={hamburgerRef}
          className="fixed top-4 left-4 z-[1000] bg-gray-800 text-white p-3 rounded-full shadow-lg focus:outline-none"
          onClick={toggleMobileMenu}
          aria-label="Menú"
          aria-expanded={isMobileMenuOpen}
        >
          {isMobileMenuOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
        </button>
      )}

      {/* Overlay oscuro para versión móvil */}
      {isMobile && isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-[90]"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Menú móvil */}
      {isMobile && (
        <aside 
          ref={mobileMenuRef}
          className={`fixed top-0 left-0 h-full w-3/4 max-w-xs bg-gray-900 text-white z-[100] transform transition-transform duration-300 ease-in-out overflow-y-auto 
            ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}
        >
          {/* Perfil del usuario y Logo en móvil */}
          <div className="p-4">
            <div className="flex items-center mb-4 pt-8">
              <img 
                src="https://i.ibb.co/pdq8Pcj/La-Mansion.png"
                alt="Logo" 
                className="w-10 h-10 mr-2"
              />
              <h2 className="text-xl font-bold">CTP La Mansión</h2>
            </div>
            
            {/* Info del usuario con opciones integradas */}
            <div className="bg-gray-800 rounded-lg p-4 mb-4">
              <div className="flex items-center mb-3">
                <FaUserCircle size={32} className="text-blue-400 mr-3" />
                <div>
                  <p className="text-white font-medium">{user?.name || 'Usuario'}</p>
                  <p className="text-gray-300 text-sm">{getDisplayRole(user?.roles)}</p>
                </div>
              </div>
              <div className="flex items-center mt-2 border-t border-gray-700 pt-3">
                <Link to="/dashboard/perfil" className="flex items-center text-blue-300 hover:text-blue-200 mr-4">
                  <FaUserCircle size={16} className="mr-1" />
                  <span>Mi perfil</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center text-red-400 hover:text-red-300 ml-auto"
                >
                  <FaSignOutAlt size={16} className="mr-1" />
                  <span>Salir</span>
                </button>
              </div>
            </div>
          </div>
          
          {/* Menú de navegación */}
          <nav className="flex flex-col p-4">
            {renderMenuItems()}
          </nav>
        </aside>
      )}

      {/* Sidebar para escritorio (original) */}
      {!isMobile && (
        <div className="flex h-screen">
          <div
            className={`bg-gray-900 text-white h-full p-4 transition-all duration-300 overflow-y-auto flex flex-col justify-between ${isSidebarCollapsed ? 'w-20' : 'w-64'}`}
          >
            {/* Parte superior */}
            <div>
              {/* Botón para colapsar y logo alineado */}
              <div className="flex items-center justify-center mb-6">
                <button 
                  onClick={toggleSidebar} 
                  className="text-white focus:outline-none mr-3"
                  aria-label={isSidebarCollapsed ? "Expandir menú" : "Colapsar menú"}
                >
                  <FaBars size={20} />
                </button>
                
                {!isSidebarCollapsed && (
                  <div className="flex items-center">
                    <img 
                      src="https://i.ibb.co/pdq8Pcj/La-Mansion.png"
                      alt="Logo" 
                      className="w-10 h-10 mr-2"
                    />
                    <h2 className="text-xl font-bold">CTP La Mansión</h2>
                  </div>
                )}
              </div>

              {/* Elementos de navegación */}
              <nav>
                {renderMenuItems()}
              </nav>
            </div>

            {/* Parte inferior - Menú de perfil */}
            {!isSidebarCollapsed ? (
              <div className="relative mt-auto border-t border-gray-700 pt-4" ref={menuRef}>
                <button
                  type="button"
                  className="flex items-center cursor-pointer focus:outline-none w-full text-left hover:bg-gray-700 rounded p-2"
                  onClick={() => setIsProfileMenuOpen((prev) => !prev)}
                  aria-haspopup="true"
                  aria-expanded={isProfileMenuOpen ? "true" : "false"}
                  aria-controls="profile-menu"
                >
                  <FaUserCircle size={24} className="text-blue-400" />
                  <span className="ml-2">{user?.name || 'Usuario'}</span>
                  <FaCaretDown className="ml-2" />
                </button>

                {isProfileMenuOpen && (
                  <div
                    id="profile-menu"
                    className="absolute bottom-14 w-full bg-gray-800 text-white rounded shadow-lg py-2 z-20"
                  >
                    <Link to="/dashboard/perfil" className="block px-4 py-2 hover:bg-gray-700" tabIndex={0}>
                      Mi perfil
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 hover:bg-red-700 text-white"
                      tabIndex={0}
                    >
                      Cerrar sesión
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="mt-auto flex flex-col items-center py-2">
                <Link to="/dashboard/perfil" className="p-2 rounded hover:bg-gray-700 mb-2">
                  <FaUserCircle size={24} className="text-blue-400" />
                </Link>
                <button 
                  onClick={handleLogout} 
                  className="p-2 rounded hover:bg-red-700"
                >
                  <FaSignOutAlt size={20} />
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;