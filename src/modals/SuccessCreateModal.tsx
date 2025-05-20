interface SuccessCreateModalProps {
  show: boolean;
  onClose: () => void;
}

const SuccessCreateModal: React.FC<SuccessCreateModalProps> = ({ show, onClose }) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded shadow-lg w-1/2">
        <h2 className="text-xl font-bold mb-4">Éxito</h2>
        <p className="text-sm text-gray-500 mb-4">Los datos se han creado correctamente.</p>
        <div className="flex justify-end">
          <button onClick={onClose} className="bg-blue-500 text-white px-4 py-2 rounded">
            Aceptar
          </button>
        </div>
      </div>
    </div>
  );
};

export default SuccessCreateModal;
