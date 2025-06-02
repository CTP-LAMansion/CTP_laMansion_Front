import React, { useState, forwardRef } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

interface PasswordFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  containerClassName?: string;
  inputClassName?: string;
}

const PasswordField = forwardRef<HTMLInputElement, PasswordFieldProps>(({
  label,
  error,
  helperText,
  containerClassName = "",
  inputClassName = "",
  className,
  ...props
}, ref) => {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const defaultInputClassName = "w-full p-2 pr-10 border rounded-lg focus:border-blue-500 focus:outline-none";
  const finalInputClassName = inputClassName || className || defaultInputClassName;

  return (
    <div className={containerClassName}>
      {label && (
        <label className="block font-medium mb-1 text-sm">
          {label}
        </label>
      )}
      <div className="relative">
        <input
          ref={ref}
          type={showPassword ? "text" : "password"}
          className={`${finalInputClassName} ${error ? 'border-red-500' : ''}`}
          {...props}
        />
        <button
          type="button"
          className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700 focus:outline-none"
          onClick={togglePasswordVisibility}
          tabIndex={-1}
          aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
        >
          {showPassword ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
        </button>
      </div>
      {error && (
        <span className="text-red-500 text-xs mt-1 block">{error}</span>
      )}
      {helperText && !error && (
        <span className="text-gray-500 text-xs mt-1 block">{helperText}</span>
      )}
    </div>
  );
});

PasswordField.displayName = 'PasswordField';

export default PasswordField;
