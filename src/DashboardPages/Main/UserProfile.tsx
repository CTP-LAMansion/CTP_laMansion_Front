import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form"; // Importación esencial que faltaba
import { useUserProfile } from "../../hooks/useUserProfile";
import { useAuth } from "../../contexts/AuthContext";
import { ChangePasswordDto } from "../../types/Types";
import LoadingSpinner from "../../components/LoadingSpinner";
import PasswordField from "../../components/PasswordField";
import PasswordValidation from "../../components/PasswordValidation";
import { FaTimes } from "react-icons/fa"; // Iconos completos
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
  };  // CAMBIO - Loader centrado con mensaje
  if (loading) return (
    <div className="max-w-5xl mx-auto my-8 flex flex-col space-y-8">
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner variant="classic" size="large" message="Cargando perfil de usuario..." />
      </div>
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
  
  const password = watch("newPassword", "");
  const currentPassword = watch("currentPassword", "");
  
  useEffect(() => {
    if (passwordSuccess) {
      reset();
    }
  }, [passwordSuccess, reset]);

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
          <PasswordField
            label="Contraseña Actual:"
            {...register("currentPassword", {
              required: "La contraseña actual es requerida"
            })}
            error={errors.currentPassword?.message}
            inputClassName="w-full p-2 pr-10 border rounded-lg"
          />
          
          {/* Nueva contraseña */}
          <div>
            <PasswordField
              label="Nueva Contraseña:"
              {...register("newPassword", {
                required: "La nueva contraseña es requerida",
                minLength: {
                  value: 8,
                  message: "La contraseña debe tener al menos 8 caracteres"
                },
                pattern: {
                  value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).*$/,
                  message: "La contraseña debe contener al menos una minúscula, una mayúscula, un número y un carácter especial"
                },
                validate: value => value !== currentPassword || "La nueva contraseña debe ser diferente a la actual"
              })}
              error={errors.newPassword?.message}
              inputClassName="w-full p-2 pr-10 border rounded-lg"
            />
            
            {/* Indicador de fortaleza */}
            <PasswordValidation password={password} />
          </div>
          
          {/* Confirmar nueva contraseña */}
          <PasswordField
            label="Confirmar Nueva Contraseña:"
            {...register("confirmNewPassword", {
              required: "Debe confirmar la contraseña",
              validate: value => value === watch("newPassword") || "Las contraseñas no coinciden"
            })}
            error={errors.confirmNewPassword?.message}
            inputClassName="w-full p-2 pr-10 border rounded-lg"
          />
          
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
            >              {loading ? (
                <span className="flex items-center">
                  <LoadingSpinner size="small" variant="inline" />
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