import { useState, useEffect } from 'react';
import { 
  getUDPBalanceHistory, 
  getUDPBalanceHistoryByDateRange, 
  getUDPBalanceHistoryByType,
  getUDPBalanceMonthlyChartData,
  getUDPBalanceTypeChartData,
  UDPBalanceTransaction,
  MonthlyChartData,
  TransactionTypeChartData
} from '../services/udpBalanceService';
import { updateUDPBalance, BalanceUpdateDto } from '../services/udpService';

export const useUDPBalanceHistory = (udpId: number) => {
  const [transactions, setTransactions] = useState<UDPBalanceTransaction[]>([]);
  const [monthlyChartData, setMonthlyChartData] = useState<MonthlyChartData[]>([]);
  const [typeChartData, setTypeChartData] = useState<TransactionTypeChartData[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Cargar el historial de transacciones
  const loadTransactions = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getUDPBalanceHistory(udpId);
      setTransactions(data);
    } catch (err) {
      setError('Error al cargar el historial de transacciones.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Filtrar transacciones por rango de fechas
  const filterByDateRange = async (startDate: string, endDate: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await getUDPBalanceHistoryByDateRange(udpId, startDate, endDate);
      setTransactions(data);
      return data;
    } catch (err) {
      setError('Error al filtrar transacciones por fechas.');
      console.error(err);
      return [];
    } finally {
      setLoading(false);
    }
  };

  // Filtrar transacciones por tipo
  const filterByType = async (transactionType: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await getUDPBalanceHistoryByType(udpId, transactionType);
      setTransactions(data);
      return data;
    } catch (err) {
      setError('Error al filtrar transacciones por tipo.');
      console.error(err);
      return [];
    } finally {
      setLoading(false);
    }
  };

  // Cargar datos para gráfica mensual
  const loadMonthlyChartData = async (year?: number) => {
    setLoading(true);
    setError(null);
    try {
      const data = await getUDPBalanceMonthlyChartData(udpId, year);
      setMonthlyChartData(data);
      return data;
    } catch (err) {
      setError('Error al cargar datos para la gráfica mensual.');
      console.error(err);
      return [];
    } finally {
      setLoading(false);
    }
  };

  // Cargar datos para gráfica por tipo
  const loadTypeChartData = async (isExpense: boolean = true) => {
    setLoading(true);
    setError(null);
    try {
      const data = await getUDPBalanceTypeChartData(udpId, isExpense);
      setTypeChartData(data);
      return data;
    } catch (err) {
      setError('Error al cargar datos para la gráfica por tipo.');
      console.error(err);
      return [];
    } finally {
      setLoading(false);
    }
  };

  // Registrar una nueva transacción
  const addTransaction = async (balanceUpdate: BalanceUpdateDto) => {
    setLoading(true);
    setError(null);
    try {
      const result = await updateUDPBalance(udpId, balanceUpdate);
      // Recargar las transacciones después de agregar una nueva
      await loadTransactions();
      return result;
    } catch (err) {
      setError('Error al registrar la nueva transacción.');
      console.error(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Cargar las transacciones al montar el componente
  useEffect(() => {
    if (udpId) {
      loadTransactions();
    }
  }, [udpId]);

  return {
    transactions,
    monthlyChartData,
    typeChartData,
    loading,
    error,
    loadTransactions,
    filterByDateRange,
    filterByType,
    loadMonthlyChartData,
    loadTypeChartData,
    addTransaction
  };
};