import React from 'react';
import { FaEnvelope, FaPencilAlt, FaLock, FaUser } from 'react-icons/fa';

interface ViewProfileProps {
  user: any;
  onEdit: () => void;
  onChangePassword: () => void;
}

// Función para formatear fecha a formato legible
const formatDisplayDate = (dateString: string): string => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
};

const ViewProfile: React.FC<ViewProfileProps> = ({ user, onEdit, onChangePassword }) => {
  // Datos organizados en dos columnas
  const columnOneData = [
    { icon: <FaUser className="text-blue-600 text-xl" />, label: "Primer Apellido", value: user?.lastName },
    { icon: <FaUser className="text-blue-600 text-xl" />, label: "Segundo Apellido", value: user?.lastName2 },
    { label: "📞 Teléfono", value: user?.phoneNumber },
    { label: "📍 Dirección", value: user?.address },
  ];
  
  const columnTwoData = [
    { label: "🚨 Contacto de Emergencia", value: user?.emergencyPhoneNumber },
    { label: "🏛️ Ingreso a la Institución", value: formatDisplayDate(user?.institutionJoinDate?.toString() || '') },
    { label: "💼 Ingreso al MEP", value: formatDisplayDate(user?.workJoinDate?.toString() || '') },
    
  ];

  return (
    <div className="bg-white rounded-lg shadow-xl overflow-hidden">
      {/* Cabecera con fondo de color */}
      <div className="bg-gradient-to-r from-gray-800 to-gray-900 h-32 flex items-center px-6">
        {/* Imagen de perfil (superpuesta sobre el fondo) */}
        <div className="relative">
          <img
            src={user?.profilePicture || "https://source.unsplash.com/MP0IUfwrn0A"}
            alt="Profile"
            className="w-24 h-24 rounded-full shadow-lg border-4 border-white object-cover"
          />
        </div>
        
        <div className="ml-6 text-white">
          <h1 className="text-xl font-semibold">Perfil de Usuario</h1>
          <p className="text-white text-opacity-80 text-sm">Información personal y profesional</p>
        </div>
      </div>
      
      <div className="p-6">
        {/* Información principal - Solo nombre */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">{user?.name || 'Usuario'}</h1>
            <p className="text-gray-600 break-words text-sm sm:text-base flex items-center">
              <FaEnvelope className="mr-2 text-blue-600" />
              {user?.email}
            </p>
          </div>
          
          {/* Botones de acción */}
          <div className="mt-4 md:mt-0 flex space-x-3">
            <button 
              onClick={onEdit}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md flex items-center"
            >
              <FaPencilAlt className="mr-2" /> Editar Perfil
            </button>
            <button 
              onClick={onChangePassword}
              className="border border-gray-300 text-gray-700 hover:bg-gray-50 font-bold py-2 px-4 rounded-md flex items-center"
            >
              <FaLock className="mr-2" /> Cambiar Contraseña
            </button>
          </div>
        </div>
        
        {/* Información en tarjetas - Organizada en dos columnas específicas */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Primera columna: Apellidos y teléfono */}
          <div className="space-y-4">
            {columnOneData.map((item, index) => (
              <div key={`col1-${index}`} className="p-4 bg-gray-50 border border-gray-100 rounded-lg flex flex-col sm:flex-row items-start sm:items-center space-x-3">
                {item.icon ? (
                  item.icon
                ) : (
                  <span className="text-blue-600 text-xl">{item.label.split(" ")[0]}</span>
                )}
                <div>
                  <p className="text-gray-700">
                    <strong>{item.icon ? item.label : item.label.split(" ").slice(1).join(" ")}:</strong> {item.value || 'No especificado'}
                  </p>
                </div>
              </div>
            ))}
          </div>
          
          {/* Segunda columna: Resto de información */}
          <div className="space-y-4">
            {columnTwoData.map((item, index) => (
              <div key={`col2-${index}`} className="p-4 bg-gray-50 border border-gray-100 rounded-lg flex flex-col sm:flex-row items-start sm:items-center space-x-3">
                <span className="text-blue-600 text-xl">{item.label.split(" ")[0]}</span>
                <div>
                  <p className="text-gray-700">
                    <strong>{item.label.split(" ").slice(1).join(" ")}:</strong> {item.value || 'No especificado'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewProfile;