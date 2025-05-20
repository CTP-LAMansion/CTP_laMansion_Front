import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { 
  getUserById, 
  updateUser, 
  getUserLabRequests, 
  getUserRoomRequests 
} from '../services/userService';
import { changePassword } from '../services/authService';
import { ChangePasswordDto } from '../types/Types';

export const useUserProfile = (userId: number | undefined) => {
  // Estados del perfil de usuario
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  
  // Estados para cambio de contraseña
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  
  // Estados para solicitudes del usuario
  const [labRequests, setLabRequests] = useState<any[]>([]);
  const [roomRequests, setRoomRequests] = useState<any[]>([]);
  const [requestsLoading, setRequestsLoading] = useState(false);
  const [requestsError, setRequestsError] = useState<string | null>(null);

  // Obtener el token desde las cookies
  const token = Cookies.get('token');

  // Obtener datos del usuario por ID
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        if (userId && token) {
          setLoading(true);
          const userData = await getUserById(userId);
          setUser(userData);
          setLoading(false);
        }
      } catch (err) {
        setError('Error al obtener los datos del usuario.');
        setLoading(false);
      }
    };

    if (userId && token) {
      fetchUserData();
    }
  }, [userId, token]);

  // Actualizar los datos del usuario
  const handleUpdateUser = async (updatedData: any) => {
    try {
      if (!token) throw new Error('Token no disponible.');
      setLoading(true);
      const updatedUser = await updateUser(userId!, updatedData);
      setUser(updatedUser);
      setUpdateSuccess(true);
      setLoading(false);
    } catch (err) {
      setError('Error al actualizar los datos del usuario.');
      setLoading(false);
    }
  };
  
  // Cambiar contraseña
  const handleChangePassword = async (data: ChangePasswordDto) => {
    setPasswordLoading(true);
    setPasswordError(null);
    setPasswordSuccess(false);
    
    try {
      await changePassword(data);
      setPasswordSuccess(true);
    } catch (err: any) {
      setPasswordError(err.message);
    } finally {
      setPasswordLoading(false);
    }
  };
  
  // Cargar solicitudes del usuario
  const fetchUserRequests = async () => {
    setRequestsLoading(true);
    setRequestsError(null);
    
    try {
      const [labData, roomData] = await Promise.all([
        getUserLabRequests(),
        getUserRoomRequests()
      ]);
      
      setLabRequests(labData);
      setRoomRequests(roomData);
    } catch (err) {
      setRequestsError('Error al cargar las solicitudes. Verifique la conexión.');
    } finally {
      setRequestsLoading(false);
    }
  };
  
  // Cargar solicitudes al inicializar el hook
  useEffect(() => {
    if (token) {
      fetchUserRequests();
    }
  }, [token]);

  return {
    // Datos y funciones del perfil
    user,
    loading,
    error,
    updateSuccess,
    handleUpdateUser,
    
    // Datos y funciones para cambio de contraseña
    passwordLoading,
    passwordError,
    passwordSuccess,
    handleChangePassword,
    
    // Datos y funciones para solicitudes
    labRequests,
    roomRequests,
    requestsLoading,
    requestsError,
    fetchUserRequests, // Para permitir recargar solicitudes manualmente
  };
};