import React, { useState } from 'react';

interface LabRequestResponseModalProps {
  isOpen: boolean;
  title: string;
  action: 'approve' | 'reject';
  onConfirm: (message: string) => void;
  onCancel: () => void;
  requestName?: string;
  isMessageRequired: boolean;
}

const LabRequestResponseModal: React.FC<LabRequestResponseModalProps> = ({
  isOpen,
  title,
  action,
  onConfirm,
  onCancel,
  requestName,
  isMessageRequired = false,
}) => {
  const [message, setMessage] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = () => {
    if (isMessageRequired && (!message || message.trim() === '')) {
      setError('Por favor proporciona un mensaje antes de continuar.');
      return;
    }
    
    onConfirm(message);
    setMessage('');
    setError(null);
  };

  if (!isOpen) return null;

  const bgColor = action === 'approve' ? 'bg-green-50' : 'bg-red-50';
  const borderColor = action === 'approve' ? 'border-green-300' : 'border-red-300';
  const titleColor = action === 'approve' ? 'text-green-800' : 'text-red-800';
  const buttonColor = action === 'approve' 
    ? 'bg-green-600 hover:bg-green-700 text-white' 
    : 'bg-red-600 hover:bg-red-700 text-white';

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50">
      <div className={`w-full max-w-md p-6 rounded-xl shadow-xl ${bgColor} border-2 ${borderColor}`}>
        <h2 className={`text-xl font-bold mb-4 ${titleColor}`}>{title}</h2>
        
        {requestName && (
          <p className="mb-4 text-gray-700">
            Solicitud para: <span className="font-medium">{requestName}</span>
          </p>
        )}
        
        <div className="mb-4">
          <label htmlFor="responseMessage" className="block text-gray-700 text-sm font-medium mb-2">
            {action === 'approve' 
              ? 'Mensaje (opcional)' 
              : 'Motivo del rechazo (requerido)'}
          </label>
          <textarea
            id="responseMessage"
            value={message}
            onChange={(e) => {
              setMessage(e.target.value);
              if (error) setError(null);
            }}
            placeholder={action === 'approve' 
              ? 'Añade comentarios opcionales para el solicitante...' 
              : 'Proporciona un motivo para rechazar esta solicitud...'}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            rows={4}
          />
          {error && <p className="text-sm text-red-600 mt-1">{error}</p>}
        </div>
        
        <div className="flex justify-end space-x-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            className={`px-4 py-2 ${buttonColor} rounded-md transition-colors`}
          >
            {action === 'approve' ? 'Aprobar' : 'Rechazar'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LabRequestResponseModal;
