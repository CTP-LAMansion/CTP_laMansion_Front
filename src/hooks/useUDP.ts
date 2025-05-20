import { useState, useEffect } from 'react';
import { UDP } from '../types/Types';
import { addUDP, deleteUDP, editUDP, getUDPs, getUDPById, patchUDPBalance, updateUDPBalance as updateUDPBalanceWithTransaction, BalanceUpdateDto } from '../services/udpService';

export const useUDPs = () => {
  const [udps, setUdps] = useState<UDP[]>([]);
  const [selectedUdp, setSelectedUdp] = useState<UDP | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchUDPsData();
  }, []);

  // Función para seleccionar una UDP por ID y actualizar `selectedUdp`
  const fetchUdpById = async (id: number) => {
    try {
      const udp = await getUDPById(id);
      if (udp) {
        setSelectedUdp(udp);
        console.log('UDP seleccionada:', udp);
      } else {
        setError('UDP no encontrada');
      }
    } catch (error) {
      console.error('Error al obtener la UDP:', error);
      setError('Error al obtener la UDP');
    }
  };
  
  const fetchUDPsData = async () => {
    setLoading(true);
    try {
      const data = await getUDPs();
      setUdps(data);
      setError(null);
    } catch {
      setError("Error al obtener UDPs");
      setUdps([]);
    } finally {
      setLoading(false);
    }
  };

  // Función para añadir una nueva UDP
  const handleAddUDP = async (newUDP: Omit<UDP, 'id_UDP'>) => {
    try {
      await addUDP(newUDP);
      fetchUDPsData();
    } catch (error) {
      console.error('Error al agregar UDP:', error);
      setError('Error al agregar UDP');
    }
  };

  // Función para editar una UDP existente
  const handleEditUDP = async (id: number, updatedUDP: Omit<UDP, 'id_UDP'>) => {
    try {
      const udpWithId = { id_UDP: id, ...updatedUDP }; // Agrega el campo `id_UDP`
      await editUDP(id, udpWithId); // Llamada con el objeto completo
      fetchUDPsData();
    } catch (error) {
      console.error('Error al editar UDP:', error);
      setError('Error al editar UDP');
    }
  };

  // Función para eliminar una UDP
  const handleDeleteUDP = async (id: number) => {
    try {
      await deleteUDP(id);
      fetchUDPsData();
    } catch (error) {
      console.error('Error al eliminar UDP:', error);
      setError('Error al eliminar UDP');
    }
  };

  // Método antiguo - Actualizar el balance de una UDP específica con PATCH
  const updateUDPBalance = async (id: number, newBalance: number) => {
    try {
      setLoading(true);
      await patchUDPBalance(id, newBalance);
      await fetchUdpById(id); // Actualizar `selectedUdp` después de modificar el balance
    } catch (error) {
      console.error('Error al actualizar el balance:', error);
      setError('Error al actualizar el balance');
    } finally {
      setLoading(false);
    }
  };

  // NUEVO MÉTODO - Actualizar el balance con transacción completa
  const addBalanceTransaction = async (id: number, transaction: BalanceUpdateDto) => {
    try {
      setLoading(true);
      await updateUDPBalanceWithTransaction(id, transaction);
      await fetchUdpById(id); // Actualizar `selectedUdp` después de modificar el balance
      return true;
    } catch (error) {
      console.error('Error al registrar la transacción:', error);
      setError('Error al registrar la transacción');
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    udps,
    selectedUdp,
    loading,
    error,
    fetchUdpById,
    updateUDPBalance,
    addBalanceTransaction, // Nuevo método para transacciones
    handleAddUDP,
    handleEditUDP,
    handleDeleteUDP,
  };
};
