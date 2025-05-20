
interface DeleteEventModalProps {
  show: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const DeleteEventModal: React.FC<DeleteEventModalProps> = ({ show, onClose, onConfirm }) => {
  if (!show) return null; // Asegúrate de que no se renderiza cuando no debe mostrarse.

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded shadow-lg">
        <h2 className="text-xl text-black font-bold mb-4">Confirmar Eliminación</h2>
        <p className="text-s text-black ">¿Estás seguro de que quieres eliminar este Elemento?</p>
        <div className="flex justify-end mt-4">
          <button
            className="bg-red-500 text-white px-4 py-2 rounded mr-2"
            onClick={onConfirm}
          >
            Eliminar
          </button>
          <button
            className="bg-gray-400 text-white px-4 py-2 rounded-md hover:bg-gray-500 transition"
            onClick={onClose}
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteEventModal;
