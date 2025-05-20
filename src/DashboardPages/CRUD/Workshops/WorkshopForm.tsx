import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Workshop, Speciality } from '../../../types/Types';
import ImageUploader from '../../../components/ImageUploader'; // Asegúrate de importar correctamente el componente

interface WorkshopFormProps {
  workshop: Workshop | null;
  specialities: Speciality[];
  onSave: (workshop: Omit<Workshop, 'id'>) => void;
  onCancel: () => void; // Prop para manejar el cierre del modal
}

const WorkshopForm: React.FC<WorkshopFormProps> = ({ workshop, specialities, onSave, onCancel }) => {
  const { control, handleSubmit, reset, setValue } = useForm<Omit<Workshop, 'id'>>({
    defaultValues: workshop || { title: '', description: '', especiality: '', url_Image: '' },
  });

  // Maneja la carga de la imagen y actualiza el valor en el formulario
  const handleImageUpload = (url: string) => {
    setValue('url_Image', url); // Actualiza el valor de la URL de la imagen en el formulario
  };

  const onSubmit = (data: Omit<Workshop, 'id'>) => {
    onSave(data);
    reset();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 text-gray-800">
      <div className="flex flex-col">
        <label className="mb-2 font-semibold">Título</label>
        <Controller
          name="title"
          control={control}
          render={({ field }) => (
            <input
              {...field}
              type="text"
              className="border border-gray-300 p-2 rounded-md"
              placeholder="Ingrese el título"
              required
            />
          )}
        />
      </div>

      <div className="flex flex-col">
        <label className="mb-2 font-semibold">Descripción</label>
        <Controller
          name="description"
          control={control}
          render={({ field }) => (
            <textarea
              {...field}
              className="border border-gray-300 p-2 rounded-md"
              placeholder="Ingrese la descripción"
              required
            />
          )}
        />
      </div>

      <div className="flex flex-col">
        <label className="mb-2 font-semibold">Especialidad</label>
        <Controller
          name="especiality"
          control={control}
          render={({ field }) => (
            <select
              {...field}
              className="border border-gray-300 p-2 rounded-md"
              required
            >
              <option value="">Seleccione una especialidad</option>
              {specialities.map((speciality) => (
                <option key={speciality.id} value={speciality.title}>
                  {speciality.title}
                </option>
              ))}
            </select>
          )}
        />
      </div>

      <div className="flex flex-col">
        <ImageUploader onImageUpload={handleImageUpload} />
        <Controller
          name="url_Image"
          control={control}
          render={({ field }) => (
            <input {...field} type="hidden" /> // Campo oculto para almacenar la URL de la imagen
          )}
        />
      </div>

      {/* Botones de Guardar y Cancelar alineados horizontalmente */}
      <div className="flex justify-end space-x-4 mt-4">
      
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
        >
          Guardar
        </button>
        <button
          type="button"
          onClick={() => {
            reset();
            onCancel();
          }}
          className="bg-gray-400 text-white px-4 py-2 rounded-md hover:bg-gray-500 transition"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
};

export default WorkshopForm;
