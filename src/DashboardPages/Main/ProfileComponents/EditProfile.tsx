import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { 
  FaUser, 
  FaEnvelope, 
  FaCheck, 
  FaTimes, 
  FaCamera, 
  FaPhone, 
  FaMapMarkerAlt, 
  FaCalendarAlt, 
  FaBriefcase,
  FaIdCard,
  FaAddressCard,
  FaPencilAlt,
  FaPhoneVolume
} from 'react-icons/fa';
import ImageUploader from '../../../components/ImageUploader';
import DiscardChangesModal from '../../../modals/galleryModals/DiscardChangesModal';

interface EditProfileProps {
  user: any;
  onSubmit: (data: any) => Promise<void>;
  onCancel: () => void;
}

interface UserProfileFormData {
  name: string;
  lastName: string;
  lastName2: string;
  email: string;
  phoneNumber: string;
  profilePicture: string;
  emergencyPhoneNumber: string;
  address: string;
  institutionJoinDate: string;
  workJoinDate: string;
}

// Función corregida para formatear fecha a 'YYYY-MM-DD' sin problemas de zona horaria
const formatDate = (date: string | Date): string => {
  if (!date) return "";
  
  const d = new Date(date);
  // Asegurar que usamos la fecha local, no UTC
  const year = d.getFullYear();
  // getMonth() devuelve 0-11, por eso añadimos 1
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  
  return `${year}-${month}-${day}`;
};

const EditProfile: React.FC<EditProfileProps> = ({ user, onSubmit, onCancel }) => {
  const [showDiscardModal, setShowDiscardModal] = useState(false);
  const [showImageUploader, setShowImageUploader] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
    setValue,
    getValues
  } = useForm<UserProfileFormData>();

  useEffect(() => {
    if (user) {
      reset({
        name: user.name,
        lastName: user.lastName,
        lastName2: user.lastName2,
        email: user.email,
        phoneNumber: user.phoneNumber,
        profilePicture: user.profilePicture,
        emergencyPhoneNumber: user.emergencyPhoneNumber,
        address: user.address,
        institutionJoinDate: formatDate(user.institutionJoinDate),
        workJoinDate: formatDate(user.workJoinDate),
      });
    }
  }, [user, reset]);

  const handleCancelEdit = () => {
    if (isDirty) {
      setShowDiscardModal(true);
    } else {
      onCancel();
    }
  };

  const handleDiscardChanges = () => {
    reset();
    setShowDiscardModal(false);
    onCancel();
  };
  
  const handleImageUploaded = (url: string) => {
    setValue("profilePicture", url);
    setShowImageUploader(false);
  };

  // Función para manejar el envío del formulario con fechas en formato correcto
  const handleFormSubmit = async (data: UserProfileFormData) => {
    // Enviar los datos tal como están, sin manipular las fechas
    // El formato YYYY-MM-DD del input type="date" es lo que el servidor espera
    await onSubmit(data);
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {/* Encabezado con imagen de perfil - Ahora con el color de la sidebar */}
      <div className="relative bg-gradient-to-r from-gray-800 to-gray-900 h-32 flex items-center px-6">
        <div className="absolute left-6 top-1/2 transform -translate-y-1/2">
          <div 
            className="relative cursor-pointer"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={() => setShowImageUploader(true)}
          >
            <img
              src={getValues("profilePicture") || "https://source.unsplash.com/MP0IUfwrn0A"}
              alt="Profile"
              className="w-24 h-24 rounded-full shadow-md border-4 border-white object-cover"
            />
            
            {/* Overlay con lápiz al hacer hover */}
            {isHovered && (
              <div className="absolute inset-0 bg-black bg-opacity-40 rounded-full flex items-center justify-center transition-all duration-300">
                <FaPencilAlt className="text-white" size={24} />
              </div>
            )}
          </div>
        </div>
        
        <div className="ml-32">
          <h1 className="text-xl font-semibold text-white">Editar Perfil</h1>
          <p className="text-white text-opacity-80 text-sm">Actualiza tu información personal</p>
          
          {/* Nuevo botón para cambiar foto de perfil */}
          <button 
            onClick={() => setShowImageUploader(true)}
            className="text-white text-opacity-90 text-sm flex items-center mt-1 hover:text-opacity-100"
          >
            <FaPencilAlt className="mr-1" size={12} /> Cambiar foto de perfil
          </button>
        </div>
      </div>
      
      <form onSubmit={handleSubmit(handleFormSubmit)} className="p-6">
        {/* Sección de información básica */}
        <div className="border-b pb-4 mb-4">
          <h2 className="flex items-center text-lg font-semibold text-gray-800 mb-4">
            <FaIdCard className="mr-2 text-blue-600" /> 
            <span>Información básica</span>
          </h2>
          
          {/* Nombre */}
          <div className="flex flex-col sm:flex-row sm:items-center py-3 border-t border-gray-100">
            <label className="sm:w-1/3 text-gray-600 font-medium flex items-center">
              <FaUser className="mr-2 text-blue-600" /> Nombre
            </label>
            <div className="sm:w-2/3 mt-1 sm:mt-0">
              <input
                type="text"
                {...register("name", { required: "Campo obligatorio" })}
                className="border border-gray-300 rounded px-3 py-2 w-full sm:max-w-xs"
                placeholder="Nombre"
              />
              {errors.name && <span className="text-red-500 text-sm block mt-1">{errors.name.message}</span>}
            </div>
          </div>
          
          {/* Apellido */}
          <div className="flex flex-col sm:flex-row sm:items-center py-3 border-t border-gray-100">
            <label className="sm:w-1/3 text-gray-600 font-medium flex items-center">
              <FaUser className="mr-2 text-blue-600" /> Apellido
            </label>
            <div className="sm:w-2/3 mt-1 sm:mt-0">
              <input
                type="text"
                {...register("lastName", { required: "Campo obligatorio" })}
                className="border border-gray-300 rounded px-3 py-2 w-full sm:max-w-xs"
                placeholder="Apellido"
              />
              {errors.lastName && <span className="text-red-500 text-sm block mt-1">{errors.lastName.message}</span>}
            </div>
          </div>
          
          {/* Segundo Apellido */}
          <div className="flex flex-col sm:flex-row sm:items-center py-3 border-t border-gray-100">
            <label className="sm:w-1/3 text-gray-600 font-medium flex items-center">
              <FaUser className="mr-2 text-blue-600" /> Segundo Apellido
            </label>
            <div className="sm:w-2/3 mt-1 sm:mt-0">
              <input
                type="text"
                {...register("lastName2", { required: "Campo obligatorio" })}
                className="border border-gray-300 rounded px-3 py-2 w-full sm:max-w-xs"
              />
              {errors.lastName2 && <span className="text-red-500 text-sm block mt-1">{errors.lastName2.message}</span>}
            </div>
          </div>
          
          {/* Email (no editable) */}
          <div className="flex flex-col sm:flex-row sm:items-center py-3 border-t border-gray-100">
            <label className="sm:w-1/3 text-gray-600 font-medium flex items-center">
              <FaEnvelope className="mr-2 text-blue-600" /> Correo electrónico
            </label>
            <div className="sm:w-2/3 mt-1 sm:mt-0 text-gray-800">
              {user?.email}
              <input type="hidden" {...register("email")} />
            </div>
          </div>
        </div>
        
        {/* Sección de contacto */}
        <div className="border-b pb-4 mb-4">
          <h2 className="flex items-center text-lg font-semibold text-gray-800 mb-4">
            <FaAddressCard className="mr-2 text-blue-600" /> 
            <span>Información de contacto</span>
          </h2>
          
          {/* Teléfono */}
          <div className="flex flex-col sm:flex-row sm:items-center py-3 border-t border-gray-100">
            <label className="sm:w-1/3 text-gray-600 font-medium flex items-center">
              <FaPhone className="mr-2 text-blue-600" /> Teléfono
            </label>
            <div className="sm:w-2/3 mt-1 sm:mt-0">
              <input
                type="text"
                {...register("phoneNumber", { required: "Campo obligatorio" })}
                className="border border-gray-300 rounded px-3 py-2 w-full sm:max-w-xs"
              />
              {errors.phoneNumber && <span className="text-red-500 text-sm block mt-1">{errors.phoneNumber.message}</span>}
            </div>
          </div>
          
          {/* Contacto de emergencia */}
          <div className="flex flex-col sm:flex-row sm:items-center py-3 border-t border-gray-100">
            <label className="sm:w-1/3 text-gray-600 font-medium flex items-center">
              <FaPhoneVolume className="mr-2 text-blue-600" /> Contacto de emergencia
            </label>
            <div className="sm:w-2/3 mt-1 sm:mt-0">
              <input
                type="text"
                {...register("emergencyPhoneNumber", { required: "Campo obligatorio" })}
                className="border border-gray-300 rounded px-3 py-2 w-full sm:max-w-xs"
              />
              {errors.emergencyPhoneNumber && <span className="text-red-500 text-sm block mt-1">{errors.emergencyPhoneNumber.message}</span>}
            </div>
          </div>
          
          {/* Dirección */}
          <div className="flex flex-col sm:flex-row sm:items-center py-3 border-t border-gray-100">
            <label className="sm:w-1/3 text-gray-600 font-medium flex items-center">
              <FaMapMarkerAlt className="mr-2 text-blue-600" /> Dirección
            </label>
            <div className="sm:w-2/3 mt-1 sm:mt-0">
              <input
                type="text"
                {...register("address", { required: "Campo obligatorio" })}
                className="border border-gray-300 rounded px-3 py-2 w-full sm:max-w-xs"
              />
              {errors.address && <span className="text-red-500 text-sm block mt-1">{errors.address.message}</span>}
            </div>
          </div>
        </div>
        
        {/* Sección profesional */}
        <div className="pb-4">
          <h2 className="flex items-center text-lg font-semibold text-gray-800 mb-4">
            <FaBriefcase className="mr-2 text-blue-600" /> 
            <span>Información profesional</span>
          </h2>
          
          {/* Fecha ingreso institución */}
          <div className="flex flex-col sm:flex-row sm:items-center py-3 border-t border-gray-100">
            <label className="sm:w-1/3 text-gray-600 font-medium flex items-center">
              <FaCalendarAlt className="mr-2 text-blue-600" /> Ingreso a la Institución
            </label>
            <div className="sm:w-2/3 mt-1 sm:mt-0">
              <input
                type="date"
                {...register("institutionJoinDate")}
                className="border border-gray-300 rounded px-3 py-2 w-full sm:max-w-xs"
              />
            </div>
          </div>
          
          {/* Fecha ingreso MEP */}
          <div className="flex flex-col sm:flex-row sm:items-center py-3 border-t border-gray-100">
            <label className="sm:w-1/3 text-gray-600 font-medium flex items-center">
              <FaCalendarAlt className="mr-2 text-blue-600" /> Ingreso al MEP
            </label>
            <div className="sm:w-2/3 mt-1 sm:mt-0">
              <input
                type="date"
                {...register("workJoinDate")}
                className="border border-gray-300 rounded px-3 py-2 w-full sm:max-w-xs"
              />
            </div>
          </div>
        </div>
        
        {/* Botones de acción - Cambiado el orden y posición */}
        <div className="mt-6 flex justify-center space-x-4">
          <button 
            type="submit"
            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium flex items-center"
          >
            <FaCheck className="mr-2" /> Guardar cambios
          </button>
          <button 
            type="button"
            onClick={handleCancelEdit}
            className="px-6 py-2.5 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 font-medium flex items-center"
          >
            <FaTimes className="mr-2" /> Cancelar
          </button>
        </div>
      </form>
      
      {/* Modal para cambiar la imagen de perfil */}
      {showImageUploader && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-lg w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold flex items-center">
                <FaCamera className="mr-2 text-blue-600" /> Cambiar foto de perfil
              </h3>
              <button 
                onClick={() => setShowImageUploader(false)}
                className="text-gray-400 hover:text-gray-600"
                type="button"
              >
                <FaTimes />
              </button>
            </div>
            
            <ImageUploader onImageUpload={handleImageUploaded} />
            
            <div className="flex justify-end mt-4">
              <button 
                onClick={() => setShowImageUploader(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 font-medium"
                type="button"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Confirmación para Descartar Cambios */}
      <DiscardChangesModal
        isOpen={showDiscardModal}
        onContinueEditing={() => setShowDiscardModal(false)}
        onDiscard={handleDiscardChanges}
      />
    </div>
  );
};

export default EditProfile;