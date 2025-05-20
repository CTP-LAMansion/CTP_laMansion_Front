// src/Services/authService.ts

import axios from 'axios';
import {jwtDecode} from 'jwt-decode'; 
import Cookies from 'js-cookie';
import { ChangePasswordDto } from '../types/Types';

// URL base para tu API
const BASE_URL = 'https://ctplamansion-production.up.railway.app/api';

// Define la estructura esperada del JWT decodificado
interface DecodedUser {
  id: number;
  name: string;
  email: string;
  roles: string[];
}

// Crear una instancia de Axios para Auth
const authClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar el token JWT a cada solicitud
authClient.interceptors.request.use((config) => {
  const token = Cookies.get('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Realizar login y almacenar token en cookies
export const login = async (email: string, password: string): Promise<DecodedUser | null> => {
  try {
    const response = await authClient.post(
      '/Auth/login',
      { email, password },
      { headers: { 'Content-Type': 'application/json-patch+json' } }
    );

    const { token } = response.data;

    // Guardar el token en las cookies con una expiración de 1 día
    Cookies.set('token', token, { expires: 1 }); 

    // Decodificar el token JWT para extraer los datos del usuario
    const decodedToken: any = jwtDecode(token);
    const decodedUser: DecodedUser = {
      id: parseInt(decodedToken.nameid),
      name: decodedToken.Name,
      email: decodedToken.Email,
      roles: Array.isArray(decodedToken.role) ? decodedToken.role : [decodedToken.role],
    };

    return decodedUser; // Retornar el usuario decodificado con roles
  } catch (error) {
    console.error('Error durante el login:', error);
    return null;
  }
};

// Eliminar el token de las cookies al hacer logout
export const logout = () => {
  Cookies.remove('token');
};

// Registrar un nuevo usuario
export const register = async (userData: any): Promise<any> => {
  try {
    const response = await authClient.post('/Auth/register', userData);
    return response.data;
  } catch (error) {
    console.error('Error al registrar usuario:', error);
    throw error;
  }
};

// Verificar email
export const verifyEmail = async (userId: string, verificationCode: string): Promise<any> => {
  try {
    const response = await authClient.post(`/Auth/verify-email?userId=${userId}&verificationCode=${verificationCode}`);
    return response.data;
  } catch (error) {
    console.error('Error al verificar email:', error);
    throw error;
  }
};

// Reenviar código de verificación
export const resendVerificationCode = async (userId: string): Promise<any> => {
  try {
    const response = await authClient.post(`/Auth/resend-verification-code?userId=${userId}`);
    return response.data;
  } catch (error) {
    console.error('Error al reenviar código de verificación:', error);
    throw error;
  }
};

// Enviar token para restablecer contraseña
export const sendPasswordResetToken = async (email: string): Promise<any> => {
  try {
    const response = await authClient.post('/Auth/send-password-reset-token', JSON.stringify(email), {
      headers: { 'Content-Type': 'application/json-patch+json' }
    });
    return response.data;
  } catch (error) {
    console.error('Error al enviar token para restablecer contraseña:', error);
    throw error;
  }
};

// Restablecer contraseña
export const resetPassword = async (email: string, token: string, newPassword: string): Promise<any> => {
  try {
    const response = await authClient.post('/Auth/reset-password', {
      email,
      token,
      newPassword
    });
    return response.data;
  } catch (error) {
    console.error('Error al restablecer contraseña:', error);
    throw error;
  }
};

// Cambio de contraseña
export const changePassword = async (changePasswordDto: ChangePasswordDto): Promise<string> => {
  try {
    const response = await authClient.post('/Auth/change-password', changePasswordDto);
    return response.data;
  } catch (error: any) {
    // Capturar mensaje de error específico del backend
    const errorMessage = error.response?.data || 'Error al cambiar la contraseña';
    throw new Error(errorMessage);
  }
};
