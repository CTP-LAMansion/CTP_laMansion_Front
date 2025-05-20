import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from 'react-router-dom';
import Modal from 'react-modal';
import ImageUploader from './ImageUploader'; // Importar el componente ImageUploader
import { register as registerUser } from "../services/authService"; // Importar la función de registro desde authService

Modal.setAppElement('#root');

interface RegisterFormData {
  name: string;
  lastName: string;
  lastName2: string;
  phoneNumber: string;
  emergencyPhoneNumber: string;
  email: string;
  password: string;
  confirmPassword: string;
  profilePicture: string; // URL de la imagen
  address: string;
  institutionJoinDate: string;
  workJoinDate: string;
}

const RegisterForm: React.FC = () => {
  const { register, handleSubmit, watch, formState: { errors }, setValue } = useForm<RegisterFormData>();
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const password = watch("password");

  // Función para manejar la subida de imagen
  const handleImageUpload = (url: string) => {
    setValue("profilePicture", url);
  };

  const onSubmit = async (data: RegisterFormData) => {
    setIsSubmitting(true);
    try {
      // Remove confirmPassword as it's not needed in the API request
      const { confirmPassword, ...dataToSend } = data;

      // Usar la función de registro desde authService
      const result = await registerUser(dataToSend);
      const userId = result.id_User;

      if (userId) {
        sessionStorage.setItem('userId', userId);
        setIsModalOpen(true);
      } else {
        console.error('No userId found in the response.');
      }
    } catch (error) {
      console.error('Error in registration:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    navigate('/verify-email');
  };

  const handleLoginRedirect = () => {
    navigate('/login');
  };

  return (
    <div className="bg-gray-100 text-gray-800 flex justify-center items-center h-screen">
      <div className="hidden lg:block w-1/2 h-screen">
        <img
          src="https://i.ibb.co/dKVCLB2/ctp-m.jpg"
          alt="Imagen de fondo"
          className="object-cover w-full h-full"
        />
      </div>

      <div className="lg:p-8 md:p-8 sm:p-6 p-4 w-full lg:w-1/2 h-full bg-white shadow-lg rounded-lg overflow-y-auto">
        <h1 className="text-2xl font-semibold mb-4">Regístrate</h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Nombre y Apellidos */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label htmlFor="name" className="block mb-1 text-sm">Nombre</label>              <input
                type="text"
                {...register("name", { 
                  required: "El nombre es requerido",
                  minLength: {
                    value: 2,
                    message: "El nombre debe tener al menos 2 caracteres"
                  },
                  maxLength: {
                    value: 50,
                    message: "El nombre no puede exceder 50 caracteres"
                  }
                })}
                id="name"
                maxLength={50}
                className="w-full border rounded-md py-1 px-2 bg-gray-100 border-gray-300 text-sm text-gray-800 focus:border-blue-500 focus:outline-none"
                placeholder="Juan"
              />
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
            </div>            <div>
              <label htmlFor="lastName" className="block mb-1 text-sm">Primer Apellido</label>
              <input
                type="text"
                {...register("lastName", { 
                  required: "El primer apellido es requerido",
                  minLength: {
                    value: 2,
                    message: "El apellido debe tener al menos 2 caracteres"
                  },
                  maxLength: {
                    value: 50,
                    message: "El apellido no puede exceder 50 caracteres"
                  }
                })}
                id="lastName"
                maxLength={50}
                className="w-full border rounded-md py-1 px-2 bg-gray-100 border-gray-300 text-sm text-gray-800 focus:border-blue-500 focus:outline-none"
                placeholder="Pérez"
              />
              {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName.message}</p>}
              <p className="text-gray-500 text-xs mt-1">Máx. 50 caracteres</p>
            </div>            <div>
              <label htmlFor="lastName2" className="block mb-1 text-sm">Segundo Apellido</label>
              <input
                type="text"
                {...register("lastName2", { 
                  required: "El segundo apellido es requerido",
                  minLength: {
                    value: 2,
                    message: "El apellido debe tener al menos 2 caracteres"
                  },
                  maxLength: {
                    value: 50,
                    message: "El apellido no puede exceder 50 caracteres"
                  }
                })}
                id="lastName2"
                maxLength={50}
                className="w-full border rounded-md py-1 px-2 bg-gray-100 border-gray-300 text-sm text-gray-800 focus:border-blue-500 focus:outline-none"
                placeholder="Gómez"
              />
              {errors.lastName2 && <p className="text-red-500 text-xs mt-1">{errors.lastName2.message}</p>}
              <p className="text-gray-500 text-xs mt-1">Máx. 50 caracteres</p>
            </div>
          </div>

          {/* Teléfonos */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">            <div>
              <label htmlFor="phoneNumber" className="block mb-1 text-sm">Número de Teléfono</label>
              <input
                type="tel"
                {...register("phoneNumber", { 
                  required: "El número de teléfono es requerido",
                  pattern: {
                    value: /^[0-9-]{8,15}$/,
                    message: "Formato inválido. Ejemplo: 8888-8888"
                  }
                })}
                id="phoneNumber"
                maxLength={15}
                onKeyPress={(e) => {
                  const key = e.key;
                  if (!/[0-9-]/.test(key)) {
                    e.preventDefault();
                  }
                }}
                className="w-full border rounded-md py-1 px-2 bg-gray-100 border-gray-300 text-sm text-gray-800 focus:border-blue-500 focus:outline-none"
                placeholder="8888-8888"
              />
              {errors.phoneNumber && <p className="text-red-500 text-xs mt-1">{errors.phoneNumber.message}</p>}
              <p className="text-gray-500 text-xs mt-1">Máx. 15 caracteres (números y guiones)</p>
            </div>            <div>
              <label htmlFor="emergencyPhoneNumber" className="block mb-1 text-sm">Teléfono de Emergencia</label>
              <input
                type="tel"
                {...register("emergencyPhoneNumber", { 
                  required: "El teléfono de emergencia es requerido",
                  pattern: {
                    value: /^[0-9-]{8,15}$/,
                    message: "Formato inválido. Ejemplo: 8888-8888"
                  }
                })}
                id="emergencyPhoneNumber"
                maxLength={15}
                onKeyPress={(e) => {
                  const key = e.key;
                  if (!/[0-9-]/.test(key)) {
                    e.preventDefault();
                  }
                }}
                className="w-full border rounded-md py-1 px-2 bg-gray-100 border-gray-300 text-sm text-gray-800 focus:border-blue-500 focus:outline-none"
                placeholder="8888-8888"
              />
              {errors.emergencyPhoneNumber && <p className="text-red-500 text-xs mt-1">{errors.emergencyPhoneNumber.message}</p>}
              <p className="text-gray-500 text-xs mt-1">Máx. 15 caracteres (números y guiones)</p>
            </div>
          </div>

          {/* Correo Electrónico */}          <div>
            <label htmlFor="email" className="block mb-1 text-sm">Correo Electrónico</label>              <input
                type="email"
                {...register("email", { 
                  required: "El correo electrónico es requerido",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Dirección de correo inválida"
                  },
                  maxLength: {
                    value: 50,
                    message: "El correo no puede exceder 50 caracteres"
                  }
                })}
                id="email"
                maxLength={50}
                className="w-full border rounded-md py-1 px-2 bg-gray-100 border-gray-300 text-sm text-gray-800 focus:border-blue-500 focus:outline-none"
                placeholder="nombre@empresa.com"
              />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
              <p className="text-gray-500 text-xs mt-1">Máx. 50 caracteres</p>
          </div>

          {/* Contraseñas */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label htmlFor="password" className="block mb-1 text-sm">Contraseña</label>
              <input
                type="password"
                {...register("password", { 
                  required: "La contraseña es requerida",
                  minLength: {
                    value: 8,
                    message: "La contraseña debe tener al menos 8 caracteres"
                  },
                  maxLength: {
                    value: 128,
                    message: "La contraseña no puede exceder 128 caracteres"
                  },
                  validate: {
                    hasNumber: value => /\d/.test(value) || "La contraseña debe contener al menos un número",
                    hasLower: value => /[a-z]/.test(value) || "La contraseña debe contener al menos una letra minúscula",
                    hasUpper: value => /[A-Z]/.test(value) || "La contraseña debe contener al menos una letra mayúscula",
                    hasSpecial: value => /[^a-zA-Z0-9]/.test(value) || "La contraseña debe contener al menos un carácter especial"
                  }
                })}
                id="password"
                className="w-full border rounded-md py-1 px-2 bg-gray-100 border-gray-300 text-sm text-gray-800 focus:border-blue-500 focus:outline-none"
                placeholder="••••••••"
              />
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block mb-1 text-sm">Confirmar Contraseña</label>
              <input
                type="password"
                {...register("confirmPassword", { 
                  required: "Debe confirmar la contraseña",
                  validate: value => value === password || "Las contraseñas no coinciden"
                })}
                id="confirmPassword"
                className="w-full border rounded-md py-1 px-2 bg-gray-100 border-gray-300 text-sm text-gray-800 focus:border-blue-500 focus:outline-none"
                placeholder="••••••••"
              />
              {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword.message}</p>}
            </div>
          </div>

          {/* Dirección */}          <div>
            <label htmlFor="address" className="block mb-1 text-sm">Dirección</label>
            <input
              type="text"
              {...register("address", { 
                required: "La dirección es requerida",
                minLength: {
                  value: 5,
                  message: "La dirección debe tener al menos 5 caracteres"
                },
                maxLength: {
                  value: 200,
                  message: "La dirección no puede exceder 200 caracteres"
                }
              })}
              id="address"
              maxLength={200}
              className="w-full border rounded-md py-1 px-2 bg-gray-100 border-gray-300 text-sm text-gray-800 focus:border-blue-500 focus:outline-none"
              placeholder="Dirección completa"
            />
            {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address.message}</p>}
            <p className="text-gray-500 text-xs mt-1">Máx. 200 caracteres</p>
          </div>

          {/* Fechas */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label htmlFor="institutionJoinDate" className="block mb-1 text-sm">Ingreso a Institución</label>
              <input
                type="date"
                {...register("institutionJoinDate", { 
                  required: "La fecha de ingreso a la institución es requerida"
                })}
                id="institutionJoinDate"
                className="w-full border rounded-md py-1 px-2 bg-gray-100 border-gray-300 text-sm text-gray-800 focus:border-blue-500 focus:outline-none"
              />
              {errors.institutionJoinDate && <p className="text-red-500 text-xs mt-1">{errors.institutionJoinDate.message}</p>}
            </div>

            <div>
              <label htmlFor="workJoinDate" className="block mb-1 text-sm">Ingreso al Trabajo</label>
              <input
                type="date"
                {...register("workJoinDate", { 
                  required: "La fecha de ingreso al trabajo es requerida"
                })}
                id="workJoinDate"
                className="w-full border rounded-md py-1 px-2 bg-gray-100 border-gray-300 text-sm text-gray-800 focus:border-blue-500 focus:outline-none"
              />
              {errors.workJoinDate && <p className="text-red-500 text-xs mt-1">{errors.workJoinDate.message}</p>}
            </div>
          </div>

          {/* Foto de Perfil (usando ImageUploader) - Opcional */}
          <div className="flex flex-col">
            <label className="block mb-1 text-sm">Foto de Perfil (opcional)</label>
            <ImageUploader onImageUpload={handleImageUpload} />
            <input
              type="hidden"
              {...register("profilePicture")}
              id="profilePicture"
            />
          </div>

          {/* Botón de Registro */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-2 px-4 rounded-md font-semibold transition-colors duration-300 bg-blue-500 text-white hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
          >
            {isSubmitting ? 'Procesando...' : 'Registrarse'}
          </button>
        </form>

        {/* Modal de Registro Exitoso */}
        <Modal
          isOpen={isModalOpen}
          onRequestClose={closeModal}
          contentLabel="Registro Exitoso"
          className="absolute inset-0 flex items-center justify-center z-[9999]"
          overlayClassName="fixed inset-0 bg-black bg-opacity-50 z-[9998]"
        >
          <div className="p-6 rounded-lg shadow-lg bg-white text-gray-800">
            <h2 className="text-xl font-semibold text-blue-600">Registro Exitoso</h2>
            <p className="mt-2 text-sm">Tu registro ha sido exitoso. Por favor verifica tu correo para activar tu cuenta.</p>
            <button
              onClick={closeModal}
              className="mt-4 px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 text-sm"
            >
              Aceptar
            </button>
          </div>
        </Modal>

        {/* Enlace para Iniciar Sesión */}
        <div className="mt-4 text-center">
          <button onClick={handleLoginRedirect} className="text-blue-500 hover:underline text-sm">
            ¿Ya tienes una cuenta? Inicia sesión aquí
          </button>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;