import React, { createContext, useState, useEffect, useContext } from 'react';
import {jwtDecode} from 'jwt-decode';
import Cookies from 'js-cookie';
import { login as authLogin, logout as authLogout } from '../services/authService';

interface UserType {
  id: number;
  name: string;
  email: string;
  roles: string[];
}

interface AuthContextType {
  token: string | null;
  user: UserType | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<UserType | null>(null);
  const [loading, setLoading] = useState<boolean>(true); // Para controlar el estado de carga

  // Función para decodificar el token JWT y extraer los datos del usuario
  const decodeToken = (token: string): UserType => {
    const decodedToken: any = jwtDecode(token);
    return {
      id: parseInt(decodedToken.nameid),
      name: decodedToken.Name,
      email: decodedToken.Email,
      roles: Array.isArray(decodedToken.role) ? decodedToken.role : [decodedToken.role],
    };
  };

  // Cargar el token desde las cookies al iniciar la aplicación
  useEffect(() => {
    const storedToken = Cookies.get('token');
    if (storedToken) {
      setToken(storedToken);
      setUser(decodeToken(storedToken));
    }
    setLoading(false); // Termina de cargar una vez que se verifica el token
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    const success = await authLogin(email, password);
    if (success) {
      const tokenFromCookie = Cookies.get('token');
      if (tokenFromCookie) {
        setToken(tokenFromCookie);
        setUser(decodeToken(tokenFromCookie));
      }
      return true;
    }
    return false;
  };

  const logout = () => {
    authLogout();
    Cookies.remove('token'); // Elimina el token de las cookies
    setToken(null);
    setUser(null);
  };

  if (loading) {
    return <div>Loading...</div>; // Muestra un cargando mientras el token se carga desde las cookies
  }

  return (
    <AuthContext.Provider value={{ token, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de un AuthProvider');
  }
  return context;
};
