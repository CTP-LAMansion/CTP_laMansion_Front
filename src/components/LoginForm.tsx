import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Modal from 'react-modal';
import { useAuthContext } from '../hooks/useAuthContext';

Modal.setAppElement('#root');

const LoginForm: React.FC = () => {
  const { login } = useAuthContext();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validación básica de campos
    if (!email || !password) {
      setErrorMessage('Por favor completa todos los campos');
      setIsModalOpen(true);
      return;
    }

    setIsLoading(true);

    try {
      const success = await login(email, password);
      
      if (success) {
        navigate('/dashboard');
      } else {
        setErrorMessage('Credenciales incorrectas. Verifica tu email y contraseña');
        setIsModalOpen(true);
      }
    } catch (error) {
      setErrorMessage('Error al conectar con el servidor. Intenta nuevamente más tarde');
      setIsModalOpen(true);
    } finally {
      setIsLoading(false);
    }
  };

  const closeModal = () => setIsModalOpen(false);

  return (
    <div className="bg-gray-100 text-gray-800 flex justify-center items-center h-screen">
      <div className="hidden lg:block w-1/2 h-screen">
        <img
          src="https://i.ibb.co/dKVCLB2/ctp-m.jpg"
          alt="Imagen de fondo"
          className="object-cover w-full h-full"
        />
      </div>

      <div className="lg:p-36 md:p-52 sm:p-20 p-8 w-full lg:w-1/2 h-full bg-white shadow-lg rounded-lg">
        <h1 className="text-3xl font-semibold mb-6">Iniciar Sesión</h1>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label htmlFor="email" className="block mb-2">Correo Electrónico</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border rounded-md py-2 px-3 bg-gray-100 border-gray-300 text-gray-800 focus:border-blue-500 focus:outline-none"
              placeholder="nombre@empresa.com"
            />
          </div>

          <div className="relative">
            <label htmlFor="password" className="block mb-2">Contraseña</label>
            <input
              type={showPassword ? 'text' : 'password'}
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border rounded-md py-2 px-3 bg-gray-100 border-gray-300 text-gray-800 focus:border-blue-500 focus:outline-none"
              placeholder="••••••••"
            />
            <button
              type="button"
              className="absolute top-3/4 right-3 transform -translate-y-1/2 focus:outline-none"
              onClick={() => setShowPassword(!showPassword)}
            >
              <svg className="h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                {showPassword ? (
                  <path d="M10 2C5.445 2 1.734 4.943.172 9.278c-.115.323-.115.678 0 1.001C1.734 15.057 5.445 18 10 18s8.266-2.943 9.828-7.278a1.007 1.007 0 000-1.001C18.266 4.943 14.555 2 10 2zm0 12c-2.411 0-4.373-1.94-4.373-4.333S7.589 5.333 10 5.333c2.411 0 4.373 1.94 4.373 4.334S12.411 14 10 14zm0-7.333a3.02 3.02 0 00-3 3.333 3.02 3.02 0 003 3.333 3.02 3.02 0 003-3.333 3.02 3.02 0 00-3-3.333z" />
                ) : (
                  <path d="M.172 9.278a.905.905 0 010-1.001C1.734 4.943 5.445 2 10 2s8.266 2.943 9.828 7.278a.905.905 0 010 1.001C18.266 15.057 14.555 18 10 18s-8.266-2.943-9.828-7.278zM10 15c2.411 0 4.373-1.94 4.373-4.333S12.411 6.333 10 6.333 5.627 8.274 5.627 10.667 7.589 15 10 15zm0-9c-2.411 0-4.373 1.94-4.373 4.333S7.589 14.667 10 14.667 14.373 12.726 14.373 10.333 12.411 6 10 6z" />
                )}
              </svg>
            </button>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2 px-4 rounded-md font-semibold transition-colors duration-300 bg-blue-500 hover:bg-blue-600 text-white disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                </svg>
                Verificando...
              </span>
            ) : (
              'Iniciar Sesión'
            )}
          </button>

          {/* Nuevos enlaces agregados */}
          <div className="mt-4 text-center space-y-2">
            <button
              type="button"
              onClick={() => navigate('/register')}
              className="text-blue-500 hover:underline hover:text-blue-600 text-sm"
            >
              ¿No tienes una cuenta? Regístrate aquí
            </button>
            <br />
            <button
              type="button"
              onClick={() => navigate('/request-password-reset')}
              className="text-blue-500 hover:underline hover:text-blue-600 text-sm"
            >
              ¿Olvidaste tu contraseña? Restablécela aquí
            </button>
          </div>
        </form>

        <Modal
          isOpen={isModalOpen}
          onRequestClose={closeModal}
          contentLabel="Error"
          className="absolute inset-0 flex items-center justify-center z-[9999]"
          overlayClassName="fixed inset-0 bg-black bg-opacity-50 z-[9998]"
        >
          <div className="p-6 rounded-lg shadow-lg bg-white text-gray-800 max-w-sm">
            <h2 className="text-xl font-semibold text-red-600 mb-4">Error de autenticación</h2>
            <p className="mb-4">{errorMessage}</p>
            <button
              onClick={closeModal}
              className="w-full px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition-colors"
            >
              Cerrar
            </button>
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default LoginForm;