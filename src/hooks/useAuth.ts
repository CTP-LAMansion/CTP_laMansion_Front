// hooks/useAuth.ts
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { login, logout } from '../services/authService';


export const useAuth = () => {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleLogin = async (email: string, password: string) => {
    try {
      const decodedUser = await login(email, password);  // Usamos el servicio para iniciar sesión
      console.log('Usuario decodificado', decodedUser);
      navigate('/dashboard');  // Redirigimos al dashboard
    } catch (error: any) {
      if (error.response && error.response.data) {
        setErrorMessage('La información de usuario no corresponde a ningún usuario en nuestro sistema');
      } else {
        setErrorMessage('Ocurrió un error durante el inicio de sesión');
      }
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return {
    handleLogin,
    handleLogout,
    errorMessage,
  };
};
