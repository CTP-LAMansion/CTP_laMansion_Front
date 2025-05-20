import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Speciality } from '../../../types/Types';
import ImageUploader from '../../../components/ImageUploader';

interface SpecialityFormProps {
  speciality: Speciality | null;
  onSave: (speciality: Speciality) => void;
  onCancel: () => void;
}

const SpecialityForm: React.FC<SpecialityFormProps> = ({ speciality, onSave, onCancel }) => {
  const { control, handleSubmit, reset, setValue } = useForm<Speciality>({
    defaultValues: speciality || { 
      id: 0, 
      title: '', 
      description: '', 
      url_Image: '',
      Url_Details: '' 
    },
  });

  const handleMainImageUpload = (url: string) => setValue('url_Image', url);
  const handleDetailsImageUpload = (url: string) => setValue('Url_Details', url);

  const onSubmit = (data: Speciality) => {
    onSave(data);
    reset();
  };

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-gray-900 bg-opacity-50 z-50">
      <div className="bg-white max-w-md md:max-w-lg w-full p-6 rounded-lg shadow-lg max-h-screen overflow-auto">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
          <h2 className="text-xl font-semibold text-center">Editar Especialidad</h2>

          <div className="flex flex-col">
            <label className="mb-1 font-semibold">Título</label>
            <Controller
              name="title"
              control={control}
              render={({ field }) => (
                <input
                  {...field}
                  type="text"
                  className="w-full border border-gray-300 p-2 rounded-md text-gray-800"
                  placeholder="Ingrese el título"
                  required
                />
              )}
            />
          </div>

          <div className="flex flex-col">
            <label className="mb-1 font-semibold">Descripción</label>
            <Controller
              name="description"
              control={control}
              render={({ field }) => (
                <textarea
                  {...field}
                  className="w-full border border-gray-300 p-2 rounded-md text-gray-800"
                  placeholder="Ingrese la descripción"
                  required
                  rows={3}
                />
              )}
            />
          </div>

          {/* Uploader para imagen principal */}
          <div className="flex flex-col">
            <label className="mb-1 font-semibold">Imagen Principal</label>
            <ImageUploader 
              onImageUpload={handleMainImageUpload} 
              initialImage={speciality?.url_Image}
            />
            <Controller
              name="url_Image"
              control={control}
              render={({ field }) => <input {...field} type="hidden" />}
            />
          </div>

          {/* Uploader para imagen de detalles */}
          <div className="flex flex-col">
            <label className="mb-1 font-semibold">Imagen para "Ver más detalles"</label>
            <ImageUploader 
              onImageUpload={handleDetailsImageUpload} 
              initialImage={speciality?.Url_Details}
            />
            {/* Corregido: Url_Details en lugar de url_Details */}
            <Controller
              name="Url_Details"
              control={control}
              render={({ field }) => <input {...field} type="hidden" />}
            />
          </div>

          {/* Botones responsivos */}
          <div className="flex flex-wrap justify-end space-x-2 mt-3">
            <button
              type="button"
              onClick={() => {
                reset();
                onCancel();
              }}
              className="bg-gray-400 text-white px-4 py-2 rounded-md hover:bg-gray-500 transition w-full sm:w-auto"
            >
              Cancelar
            </button>
            <button 
              type="submit" 
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition w-full sm:w-auto"
            >
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SpecialityForm;