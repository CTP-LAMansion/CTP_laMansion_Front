import React from 'react';
import ClipLoader from 'react-spinners/ClipLoader';

interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large' | 'xlarge';
  variant?: 'centered' | 'inline' | 'fullscreen' | 'classic';
  message?: string;
  color?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'medium', 
  variant = 'centered', 
  message,
  color = '#3b82f6' 
}) => {
  // Size mapping para ClipLoader
  const sizeMap = {
    small: 20,
    medium: 40,
    large: 60,
    xlarge: 100
  };

  // Size mapping para classic spinner (Tailwind classes)
  const classicSizeMap = {
    small: 'h-5 w-5',
    medium: 'h-8 w-8', 
    large: 'h-10 w-10',
    xlarge: 'h-12 w-12'
  };
  // Si es variante classic, usar el spinner CSS original
  if (variant === 'classic') {
    // Determinar el color del borde usando clases de Tailwind
    const borderColorClass = color === '#3b82f6' ? 'border-blue-500' : 
                            color === '#6366f1' ? 'border-indigo-500' :
                            color === '#10b981' ? 'border-emerald-500' :
                            color === '#ef4444' ? 'border-red-500' :
                            'border-blue-500'; // fallback

    const spinnerElement = (
      <div 
        className={`animate-spin rounded-full border-t-2 border-b-2 ${classicSizeMap[size]} ${borderColorClass}`}
      />
    );

    return (
      <div className="flex flex-col justify-center items-center py-8">
        {spinnerElement}
        {message && (
          <p className="mt-4 text-gray-600 text-center animate-pulse">
            {message}
          </p>
        )}
      </div>
    );
  }

  // Common ClipLoader spinner element para otras variantes
  const spinner = (
    <ClipLoader 
      color={color} 
      size={sizeMap[size]} 
    />
  );

  // Variant styles
  const getContainerClasses = () => {
    switch (variant) {
      case 'fullscreen':
        return 'fixed inset-0 bg-white bg-opacity-75 flex flex-col justify-center items-center z-50';
      case 'inline':
        return 'flex items-center justify-center py-4';
      case 'centered':
      default:
        return 'flex flex-col justify-center items-center py-8';
    }
  };

  return (
    <div className={getContainerClasses()}>
      {spinner}
      {message && (
        <p className="mt-4 text-gray-600 text-center animate-pulse">
          {message}
        </p>
      )}
    </div>
  );
};

export default LoadingSpinner;
