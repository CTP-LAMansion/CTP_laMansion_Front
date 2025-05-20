import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { UDP } from '../../../types/Types';
import { getUsers } from '../../../services/userService'; // Asume que tienes este servicio

interface User {
  id: number;
  name: string;
  lastName: string;
  lastName2: string;
}

interface UDPFormProps {
  udp: UDP | null;
  onSave: (udp: UDP) => void;
  onCancel: () => void;
}

const UDPForm: React.FC<UDPFormProps> = ({ udp, onSave, onCancel }) => {
  const { control, handleSubmit, reset, setValue } = useForm<UDP>({
    defaultValues: udp || { id_UDP: 0, title: '', description: '', area: '', balance: 0, userId: 0 },
  });

  const [searchTerm, setSearchTerm] = useState<string>('');
  const [allUsers, setAllUsers] = useState<User[]>([]); // Todos los usuarios
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]); // Usuarios filtrados
  const [, setSelectedUser] = useState<User | null>(null);

  // Obtener todos los usuarios al cargar el componente
  useEffect(() => {
    const fetchUsers = async () => {
      const users = await getUsers(); // Obtener todos los usuarios
      setAllUsers(users);
    };
    fetchUsers();
  }, []);

  // Filtrar usuarios localmente cuando el término de búsqueda cambia
  useEffect(() => {
    if (searchTerm) {
      const filtered = allUsers.filter(
        (user) =>
          user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.lastName2.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredUsers(filtered);
    } else {
      setFilteredUsers([]);
    }
  }, [searchTerm, allUsers]);

  // Seleccionar un usuario de la lista filtrada
  const handleUserSelect = (user: User) => {
    setSelectedUser(user);
    setValue('userId', user.id); // Actualizar el valor del campo userId en el formulario
    setSearchTerm(`${user.name} ${user.lastName} ${user.lastName2}`); // Mostrar el nombre completo en el input
    setFilteredUsers([]); // Limpiar la lista de resultados
  };

  const onSubmit = (data: UDP) => {
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
              placeholder="Ingrese el título del UDP"
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
        <label className="mb-2 font-semibold">Área</label>
        <Controller
          name="area"
          control={control}
          render={({ field }) => (
            <input
              {...field}
              type="text"
              className="border border-gray-300 p-2 rounded-md"
              placeholder="Ingrese el área"
              required
            />
          )}
        />
      </div>

      <div className="flex flex-col">
        <label className="mb-2 font-semibold">Balance</label>
        <Controller
          name="balance"
          control={control}
          render={({ field }) => (
            <input
              {...field}
              type="number"
              className="border border-gray-300 p-2 rounded-md"
              placeholder="Ingrese el balance"
              required
            />
          )}
        />
      </div>

      <div className="flex flex-col">
        <label className="mb-2 font-semibold">Usuario</label>
        <div className="relative">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border border-gray-300 p-2 rounded-md w-full"
            placeholder="Buscar usuario por nombre o apellidos"
          />
          {filteredUsers.length > 0 && (
            <ul className="absolute z-10 bg-white border border-gray-300 rounded-md mt-1 w-full max-h-48 overflow-y-auto">
              {filteredUsers.map((user) => (
                <li
                  key={user.id}
                  onClick={() => handleUserSelect(user)}
                  className="p-2 hover:bg-gray-100 cursor-pointer"
                >
                  {`${user.name} ${user.lastName} ${user.lastName2}`}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

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

export default UDPForm;