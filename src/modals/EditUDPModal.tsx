import React, { useState, useEffect } from 'react';
import { UDP } from '../types/Types';
import { getUsers } from '../services/userService'; // Asume que tienes este servicio

interface User {
  id: number;
  name: string;
  lastName: string;
  lastName2: string;
}

interface EditUDPModalProps {
  show: boolean;
  udp: UDP | null;
  onClose: () => void;
  onSave: (udp: UDP) => void;
}

const EditUDPModal: React.FC<EditUDPModalProps> = ({ show, udp, onClose, onSave }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [area, setArea] = useState('');
  const [balance, setBalance] = useState(0);
  const [userId, setUserId] = useState(0);

  // Estados para la búsqueda de usuarios
  const [searchTerm, setSearchTerm] = useState('');
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [, setSelectedUser] = useState<User | null>(null);

  // Rellena los campos al editar o los limpia al crear una nueva UDP
  useEffect(() => {
    if (udp) {
      setTitle(udp.title);
      setDescription(udp.description);
      setArea(udp.area);
      setBalance(udp.balance);
      setUserId(udp.userId);

      // Buscar el usuario seleccionado si estamos editando
      if (udp.userId) {
        const fetchSelectedUser = async () => {
          const user = allUsers.find((u) => u.id === udp.userId);
          if (user) {
            setSelectedUser(user);
            setSearchTerm(`${user.name} ${user.lastName} ${user.lastName2}`);
          }
        };
        fetchSelectedUser();
      }
    } else {
      setTitle('');
      setDescription('');
      setArea('');
      setBalance(0);
      setUserId(0);
      setSelectedUser(null);
      setSearchTerm('');
    }
  }, [udp, allUsers]);

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
    setUserId(user.id); // Actualizar el userId
    setSearchTerm(`${user.name} ${user.lastName} ${user.lastName2}`); // Mostrar el nombre completo en el input
    setFilteredUsers([]); // Limpiar la lista de resultados
  };

  const handleSubmit = () => {
    const udpData: UDP = {
      id_UDP: udp ? udp.id_UDP : 0, // Al editar, usar el id actual; al crear, se ignora este valor
      title,
      description,
      area,
      balance,
      userId,
    };
    onSave(udpData);
    onClose();
  };

  if (!show) return null;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-white p-6 rounded-md w-96 shadow-lg">
        <h2 id="modal-title" className="text-2xl font-bold mb-6 text-gray-700">
          {udp ? 'Editar UDP' : 'Agregar UDP'}
        </h2>
        <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
          {/* Campo Título */}
          <div>
            <label htmlFor="udp-title" className="block font-semibold mb-1 text-gray-600">
              Título
            </label>
            <input
              id="udp-title"
              type="text"
              className="border border-gray-300 rounded-md p-2 w-full focus:ring focus:ring-blue-200"
              placeholder="Ingrese el título del UDP"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          {/* Campo Descripción */}
          <div>
            <label htmlFor="udp-description" className="block font-semibold mb-1 text-gray-600">
              Descripción
            </label>
            <textarea
              id="udp-description"
              className="border border-gray-300 rounded-md p-2 w-full focus:ring focus:ring-blue-200"
              placeholder="Ingrese la descripción"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>

          {/* Campo Área */}
          <div>
            <label htmlFor="udp-area" className="block font-semibold mb-1 text-gray-600">
              Área
            </label>
            <input
              id="udp-area"
              type="text"
              className="border border-gray-300 rounded-md p-2 w-full focus:ring focus:ring-blue-200"
              placeholder="Ingrese el área"
              value={area}
              onChange={(e) => setArea(e.target.value)}
              required
            />
          </div>

          {/* Campo Balance */}
          <div>
            <label htmlFor="udp-balance" className="block font-semibold mb-1 text-gray-600">
              Balance
            </label>
            <input
              id="udp-balance"
              type="number"
              className="border border-gray-300 rounded-md p-2 w-full focus:ring focus:ring-blue-200"
              placeholder="Ingrese el balance"
              value={balance}
              onChange={(e) => setBalance(Number(e.target.value))}
              required
            />
          </div>

          {/* Campo de búsqueda de usuario */}
          <div>
            <label htmlFor="udp-user" className="block font-semibold mb-1 text-gray-600">
              Usuario
            </label>
            <div className="relative">
              <input
                id="udp-user"
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="border border-gray-300 rounded-md p-2 w-full focus:ring focus:ring-blue-200"
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

          {/* Botones */}
          <div className="flex justify-end space-x-4">
            
            <button
              type="button"
              onClick={handleSubmit}
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
            >
              Guardar
            </button>
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-400 text-white px-4 py-2 rounded-md hover:bg-gray-500 transition"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditUDPModal;