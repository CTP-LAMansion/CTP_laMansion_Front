import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form"; // Importación esencial que faltaba
import { useUserProfile } from "../../hooks/useUserProfile";
import { useAuth } from "../../contexts/AuthContext";
import { ChangePasswordDto } from "../../types/Types";
import ClipLoader from "react-spinners/ClipLoader";
import { FaTimes, FaEye, FaEyeSlash, FaCheck } from "react-icons/fa"; // Iconos completos
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ViewProfile from "./ProfileComponents/ViewProfile";
import EditProfile from "./ProfileComponents/EditProfile";
import UserRequestsTable from "./ProfileComponents/UserRequestsTable";

const UserProfile: React.FC = () => {
  const { user: authUser } = useAuth();
  const userId = authUser?.id;
  const { 
    user, 
    loading, 
    error, 
    handleUpdateUser, 
    handleChangePassword, 
    passwordLoading,
    passwordError,
    passwordSuccess,
    labRequests,
    roomRequests,
    requestsLoading,
    requestsError,
    fetchUserRequests
  } = useUserProfile(userId);

  const [editMode, setEditMode] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [requestsLoaded, setRequestsLoaded] = useState(false);

  // Cargar solicitudes una sola vez
  useEffect(() => {
    if (userId && !requestsLoaded) {
      fetchUserRequests();
      setRequestsLoaded(true);
    }
  }, [userId, requestsLoaded, fetchUserRequests]);

  const onSubmitProfile = async (data: any) => {
    try {
      await handleUpdateUser(data);
      setEditMode(false);
      toast.success("Perfil actualizado con éxito");
    } catch (err) {
      toast.error("Error al actualizar el perfil");
      console.error(err);
    }
  };

  const onSubmitPassword = async (data: ChangePasswordDto) => {
    try {
      await handleChangePassword(data);
      if (!passwordError) {
        setShowPasswordModal(false);
        toast.success("Contraseña actualizada con éxito");
      }
    } catch (err) {
      // Errores manejados por useUserProfile
      console.error(err);
    }
  };

  const handleRefreshRequests = () => {
    fetchUserRequests();
  };

  // CAMBIO - Loader centrado con mensaje
  if (loading) return (
    <div className="flex flex-col justify-center items-center h-screen">
      <ClipLoader color="#3b82f6" size={100} />
    </div>
  );
  
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="max-w-5xl mx-auto my-8 flex flex-col space-y-8">
      <ToastContainer position="top-right" autoClose={3000} />
      
      {/* Perfil del usuario */}
      {editMode ? (
        <EditProfile 
          user={user} 
          onSubmit={onSubmitProfile} 
          onCancel={() => setEditMode(false)} 
        />
      ) : (
        <ViewProfile 
          user={user} 
          onEdit={() => setEditMode(true)} 
          onChangePassword={() => setShowPasswordModal(true)}
        />
      )}
      
      {/* Tabla de solicitudes */}
      <UserRequestsTable
        labRequests={labRequests}
        roomRequests={roomRequests}
        loading={requestsLoading}
        error={requestsError}
        onRefresh={handleRefreshRequests}
      />
      
      {/* Modal de Cambio de Contraseña */}
      {showPasswordModal && (
        <PasswordChangeModal 
          onClose={() => setShowPasswordModal(false)}
          onSubmit={onSubmitPassword}
          loading={passwordLoading}
          error={passwordError}
          passwordSuccess={passwordSuccess}
        />
      )}
    </div>
  );
};

interface PasswordChangeModalProps {
  onClose: () => void;
  onSubmit: (data: ChangePasswordDto) => Promise<void>;
  loading: boolean;
  error: string | null;
  passwordSuccess: boolean;
}

const PasswordChangeModal: React.FC<PasswordChangeModalProps> = ({ 
  onClose, onSubmit, loading, error, passwordSuccess 
}) => {
  const { register, handleSubmit, watch, reset, formState: { errors } } = 
    useForm<ChangePasswordDto>();
  
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false
  });
  
  const password = watch("newPassword", "");
  const currentPassword = watch("currentPassword", "");
  
  const passwordStrength = {
    length: password?.length >= 8,
    hasNumber: /\d/.test(password || ''),
    hasUpper: /[A-Z]/.test(password || ''),
    hasLower: /[a-z]/.test(password || ''),
    hasSpecial: /[^A-Za-z0-9]/.test(password || ''),
  };
  const strengthScore = Object.values(passwordStrength).filter(Boolean).length;
  
  useEffect(() => {
    if (passwordSuccess) {
      reset();
    }
  }, [passwordSuccess, reset]);

  const togglePasswordVisibility = (field: 'current' | 'new' | 'confirm') => {
    setShowPassword(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const handleModalSubmit = async (data: ChangePasswordDto) => {
    try {
      await onSubmit(data);
    } catch (err) {
      console.error("Error submitting password change:", err);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Cambiar Contraseña</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
            type="button"
          >
            <FaTimes />
          </button>
        </div>
        
        <form onSubmit={handleSubmit(handleModalSubmit)} className="space-y-4">
          {/* Contraseña actual */}
          <div>
            <label className="block font-medium mb-1">Contraseña Actual:</label>
            <div className="relative">
              <input
                type={showPassword.current ? "text" : "password"}
                {...register("currentPassword", {
                  required: "La contraseña actual es requerida"
                })}
                className="w-full p-2 pr-10 border rounded-lg"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => togglePasswordVisibility('current')}
              >
                {showPassword.current ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            {errors.currentPassword && (
              <span className="text-red-500 text-sm">{errors.currentPassword.message}</span>
            )}
          </div>
          
          {/* Nueva contraseña */}
          <div>
            <label className="block font-medium mb-1">Nueva Contraseña:</label>
            <div className="relative">
              <input
                type={showPassword.new ? "text" : "password"}
                {...register("newPassword", {
                  required: "La nueva contraseña es requerida",
                  minLength: {
                    value: 8,
                    message: "La contraseña debe tener al menos 8 caracteres"
                  },
                  pattern: {
                    value: /^(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).*$/,
                    message: "La contraseña debe contener al menos una mayúscula, un número y un carácter especial"
                  },
                  validate: value => value !== currentPassword || "La nueva contraseña debe ser diferente a la actual"
                })}
                className="w-full p-2 pr-10 border rounded-lg"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => togglePasswordVisibility('new')}
              >
                {showPassword.new ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            {errors.newPassword && (
              <span className="text-red-500 text-sm">{errors.newPassword.message}</span>
            )}
            
            {/* Indicador de fortaleza */}
            {password && (
              <div className="mt-2">
                <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${
                      strengthScore <= 2 ? 'bg-red-500' : 
                      strengthScore <= 4 ? 'bg-yellow-500' : 
                      'bg-green-500'
                    } ${
                      strengthScore === 1 ? 'w-1/5' :
                      strengthScore === 2 ? 'w-2/5' :
                      strengthScore === 3 ? 'w-3/5' :
                      strengthScore === 4 ? 'w-4/5' :
                      strengthScore === 5 ? 'w-full' : 'w-0'
                    }`}
                  ></div>
                </div>
                <ul className="mt-1 text-xs">
                  <li className={`flex items-center ${passwordStrength.length ? 'text-green-600' : 'text-gray-500'}`}>
                    {passwordStrength.length ? <FaCheck className="mr-1" /> : <FaTimes className="mr-1" />}
                    Mínimo 8 caracteres
                  </li>
                  <li className={`flex items-center ${passwordStrength.hasUpper ? 'text-green-600' : 'text-gray-500'}`}>
                    {passwordStrength.hasUpper ? <FaCheck className="mr-1" /> : <FaTimes className="mr-1" />}
                    Al menos una mayúscula
                  </li>
                  <li className={`flex items-center ${passwordStrength.hasNumber ? 'text-green-600' : 'text-gray-500'}`}>
                    {passwordStrength.hasNumber ? <FaCheck className="mr-1" /> : <FaTimes className="mr-1" />}
                    Al menos un número
                  </li>
                  <li className={`flex items-center ${passwordStrength.hasSpecial ? 'text-green-600' : 'text-gray-500'}`}>
                    {passwordStrength.hasSpecial ? <FaCheck className="mr-1" /> : <FaTimes className="mr-1" />}
                    Al menos un carácter especial
                  </li>
                </ul>
              </div>
            )}
          </div>
          
          {/* Confirmar nueva contraseña */}
          <div>
            <label className="block font-medium mb-1">Confirmar Nueva Contraseña:</label>
            <div className="relative">
              <input
                type={showPassword.confirm ? "text" : "password"}
                {...register("confirmNewPassword", {
                  required: "Debe confirmar la contraseña",
                  validate: value => value === watch("newPassword") || "Las contraseñas no coinciden"
                })}
                className="w-full p-2 pr-10 border rounded-lg"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => togglePasswordVisibility('confirm')}
              >
                {showPassword.confirm ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            {errors.confirmNewPassword && (
              <span className="text-red-500 text-sm">{errors.confirmNewPassword.message}</span>
            )}
          </div>
          
          {/* Error del backend */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative">
              {error}
            </div>
          )}
          
          {/* Botones */}
          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-70"
            >
              {loading ? (
                <span className="flex items-center">
                  <ClipLoader color="#ffffff" size={16} className="mr-2" />
                  Guardando...
                </span>
              ) : (
                "Guardar Cambios"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserProfile;