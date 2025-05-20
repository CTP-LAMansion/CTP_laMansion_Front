import React, { useState, useEffect, useRef, useCallback } from 'react';
import { FaUserCircle, FaCaretDown } from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import clsx from 'clsx';

const Topbar: React.FC = () => {
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Función para cerrar el menú si se hace clic fuera de él
  const handleClickOutside = useCallback((event: MouseEvent) => {
    if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
      setIsProfileMenuOpen(false);
    }
  }, []);

  // Función para cerrar el menú con la tecla `Esc`
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      setIsProfileMenuOpen(false);
    }
  }, []);

  useEffect(() => {
    document.addEventListener('click', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('click', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleClickOutside, handleKeyDown]);

  // Manejar el cierre de sesión
  const handleLogout = useCallback(() => {
    logout();
    navigate('/login');
  }, [logout, navigate]);

  return (
    <div className="bg-gray-900 text-white h-16 flex items-center justify-between px-4 shadow-md">
      <h1 className="text-lg font-bold">Dashboard</h1>
      <div className="flex items-center space-x-4">
        <div className="relative" ref={menuRef}>
          <button
            className="flex items-center cursor-pointer focus:outline-none"
            onClick={() => setIsProfileMenuOpen((prev) => !prev)}
            aria-haspopup="true"
            aria-expanded={isProfileMenuOpen}
            aria-controls="profile-menu"
          >
            <FaUserCircle size={24} />
            <span className="ml-2">{user?.name || 'Usuario'}</span>
            <FaCaretDown className="ml-2" />
          </button>

          {isProfileMenuOpen && (
            <div
              id="profile-menu"
              className={clsx(
                'absolute right-0 mt-2 w-48 bg-white text-gray-800 rounded shadow-lg py-2 z-20 transform transition duration-200',
                isProfileMenuOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
              )}
              style={{ minWidth: '10rem' }}
            >
              <Link to="/dashboard/perfil" className="block px-4 py-2 hover:bg-gray-100" tabIndex={0}>
                Perfil
              </Link>
              <button
                onClick={handleLogout}
                className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                tabIndex={0}
              >
                Cerrar sesión
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Topbar;
