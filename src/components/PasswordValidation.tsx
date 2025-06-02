import React from 'react';
import { FaCheck, FaTimes } from 'react-icons/fa';

export interface PasswordStrength {
  length: boolean;
  hasNumber: boolean;
  hasUpper: boolean;
  hasLower: boolean;
  hasSpecial: boolean;
}

interface PasswordValidationProps {
  password: string;
  showValidation?: boolean;
  className?: string;
}

export const getPasswordStrength = (password: string): PasswordStrength => {
  return {
    length: password?.length >= 8,
    hasNumber: /\d/.test(password || ''),
    hasUpper: /[A-Z]/.test(password || ''),
    hasLower: /[a-z]/.test(password || ''),
    hasSpecial: /[^A-Za-z0-9]/.test(password || ''),
  };
};

export const getStrengthScore = (passwordStrength: PasswordStrength): number => {
  return Object.values(passwordStrength).filter(Boolean).length;
};

const PasswordValidation: React.FC<PasswordValidationProps> = ({ 
  password, 
  showValidation = true,
  className = "" 
}) => {
  const passwordStrength = getPasswordStrength(password);
  const strengthScore = getStrengthScore(passwordStrength);

  if (!showValidation || !password) {
    return null;
  }

  return (
    <div className={`mt-2 ${className}`}>
      {/* Barra de progreso */}
      <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
        <div 
          className={`h-full transition-all duration-300 ${
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
        />
      </div>
      
      {/* Lista de validaciones */}
      <ul className="mt-2 text-xs space-y-1">
        <li className={`flex items-center ${passwordStrength.length ? 'text-green-600' : 'text-gray-500'}`}>
          <span className="flex-shrink-0 mr-2">
            {passwordStrength.length ? <FaCheck size={10} /> : <FaTimes size={10} />}
          </span>
          Mínimo 8 caracteres
        </li>
        <li className={`flex items-center ${passwordStrength.hasUpper ? 'text-green-600' : 'text-gray-500'}`}>
          <span className="flex-shrink-0 mr-2">
            {passwordStrength.hasUpper ? <FaCheck size={10} /> : <FaTimes size={10} />}
          </span>
          Al menos una mayúscula
        </li>
        <li className={`flex items-center ${passwordStrength.hasLower ? 'text-green-600' : 'text-gray-500'}`}>
          <span className="flex-shrink-0 mr-2">
            {passwordStrength.hasLower ? <FaCheck size={10} /> : <FaTimes size={10} />}
          </span>
          Al menos una minúscula
        </li>
        <li className={`flex items-center ${passwordStrength.hasNumber ? 'text-green-600' : 'text-gray-500'}`}>
          <span className="flex-shrink-0 mr-2">
            {passwordStrength.hasNumber ? <FaCheck size={10} /> : <FaTimes size={10} />}
          </span>
          Al menos un número
        </li>
        <li className={`flex items-center ${passwordStrength.hasSpecial ? 'text-green-600' : 'text-gray-500'}`}>
          <span className="flex-shrink-0 mr-2">
            {passwordStrength.hasSpecial ? <FaCheck size={10} /> : <FaTimes size={10} />}
          </span>
          Al menos un carácter especial
        </li>
      </ul>
      
      {/* Texto del nivel de fortaleza */}
      <div className="mt-2 text-xs">
        <span className={`font-medium ${
          strengthScore <= 2 ? 'text-red-500' : 
          strengthScore <= 4 ? 'text-yellow-500' : 
          'text-green-500'
        }`}>
          Fortaleza: {
            strengthScore <= 2 ? 'Débil' :
            strengthScore <= 4 ? 'Media' :
            'Fuerte'
          }
        </span>
      </div>
    </div>
  );
};

export default PasswordValidation;
