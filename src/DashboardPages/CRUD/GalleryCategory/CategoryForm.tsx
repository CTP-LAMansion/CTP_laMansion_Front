import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Category } from '../../../types/Types';

interface CategoryFormProps {
  category: Category | null;
  onSave: (category: Category) => void;
  onCancel: () => void;
}

const CategoryForm: React.FC<CategoryFormProps> = ({ category, onSave, onCancel }) => {
  const { control, handleSubmit, reset } = useForm<Category>({
    defaultValues: category || {
      id_Category: 0,
      name: '',
      galleries: []
    },
  });
  
  const [showConfirmation, setShowConfirmation] = useState(false);

  const onSubmit = (data: Category) => {
    onSave(data);
    reset();
  };
  
  const handleCancel = () => {
    setShowConfirmation(true);
  };
  
  const confirmCancel = () => {
    reset();
    onCancel();
    setShowConfirmation(false);
  };
  
  const cancelConfirmation = () => {
    setShowConfirmation(false);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 text-gray-800">
      <div className="flex flex-col">
        <label className="mb-2 font-semibold">Nombre de la Categoría</label>
        <Controller
          name="name"
          control={control}
          rules={{ required: "El nombre es obligatorio" }}
          render={({ field, fieldState: { error } }) => (
            <>
              <input
                {...field}
                type="text"
                className={`border ${error ? 'border-red-500' : 'border-gray-300'} p-2 rounded-md`}
                placeholder="Ej: Eventos, Actividades, Infraestructura..."
                required
              />
              {error && <p className="mt-1 text-sm text-red-500">{error.message}</p>}
            </>
          )}
        />
      </div>

      <div className="flex justify-end space-x-4 mt-6">
        {/* Invertir orden: Guardar primero (izquierda), Cancelar después (derecha) */}
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
        >
          Guardar
        </button>
<button
  type="button"
  onClick={handleCancel} // Usa handleCancel en lugar de onCancel directamente
  className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400"
>
  Cancelar
</button>
      </div>
      
      {/* Modal de confirmación para cancelar */}
      {showConfirmation && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
            <h3 className="text-lg font-semibold mb-4">¿Estás seguro?</h3>
            <p className="mb-6">Los cambios que has realizado no se guardarán.</p>
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
                onClick={cancelConfirmation}
              >
                Seguir editando
              </button>
              <button
                type="button"
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                onClick={confirmCancel}
              >
                Descartar cambios
              </button>
            </div>
          </div>
        </div>
      )}
    </form>
  );
};

export default CategoryForm;