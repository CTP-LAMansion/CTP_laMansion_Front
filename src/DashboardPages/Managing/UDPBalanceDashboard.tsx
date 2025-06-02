import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUDPs } from '../../hooks/useUDP';
import { useUDPBalanceHistory } from '../../hooks/useUDPBalanceHistory';
import UDPBalanceChart from '../../components/UDPBalanceChart';
import UDPBalanceMetrics from '../../components/UDPBalanceMetrics';
import UDPBalanceAnalytics from '../../components/UDPBalanceAnalytics';
import { 
  FaChartLine, 
  FaExchangeAlt, 
  FaCalendarAlt, 
  FaFilter,
  FaDownload,
  FaSync,
  FaWallet,
  FaPlus,
  FaChartPie
} from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

// Componente para mostrar estadísticas rápidas
const QuickStatsCard: React.FC<{
  title: string;
  value: string;
  icon: React.ReactNode;
  trend?: { value: number; isPositive: boolean };
  onClick?: () => void;
}> = ({ title, value, icon, trend, onClick }) => (
  <div 
    className={`bg-white rounded-xl shadow-sm p-6 border border-gray-100 transition-all duration-200 hover:shadow-md ${
      onClick ? 'cursor-pointer hover:scale-105' : ''
    }`}
    onClick={onClick}
  >
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-600">{title}</p>
        <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
        {trend && (
          <div className={`flex items-center mt-2 text-sm ${
            trend.isPositive ? 'text-green-600' : 'text-red-600'
          }`}>
            <span className="font-medium">
              {trend.isPositive ? '↗' : '↘'} {Math.abs(trend.value).toFixed(1)}%
            </span>
          </div>
        )}
      </div>
      <div className="p-3 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg">
        {icon}
      </div>
    </div>
  </div>
);

// Filtros avanzados
const FilterPanel: React.FC<{
  selectedUDPId: number | null;
  udps: any[];
  onUDPChange: (id: number) => void;
  dateRange: { start: string; end: string };
  onDateRangeChange: (start: string, end: string) => void;
  onRefresh: () => void;
  onExport: () => void;
}> = ({ 
  selectedUDPId, 
  udps, 
  onUDPChange, 
  dateRange, 
  onDateRangeChange, 
  onRefresh, 
  onExport 
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-6">
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <FaFilter className="text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900">Filtros y Configuración</h3>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={onRefresh}
              className="p-2 text-gray-500 hover:text-blue-600 transition-colors rounded-lg hover:bg-blue-50"
              title="Actualizar datos"
            >
              <FaSync />
            </button>
            <button
              onClick={onExport}
              className="p-2 text-gray-500 hover:text-green-600 transition-colors rounded-lg hover:bg-green-50"
              title="Exportar datos"
            >
              <FaDownload />
            </button>
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-2 text-gray-500 hover:text-blue-600 transition-colors rounded-lg hover:bg-blue-50"
            >
              {isExpanded ? '−' : '+'}
            </button>
          </div>
        </div>
      </div>

      <div className={`transition-all duration-300 ${isExpanded ? 'max-h-96' : 'max-h-0'} overflow-hidden`}>
        <div className="p-4 space-y-4">
          {/* Selector de UDP */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Seleccionar UDP
            </label>
            <select
              value={selectedUDPId || ''}
              onChange={(e) => onUDPChange(parseInt(e.target.value))}
              className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">-- Selecciona una UDP --</option>
              {udps.map(udp => (
                <option key={udp.id_UDP} value={udp.id_UDP}>
                  {udp.title} (Balance: ₡{udp.balance?.toLocaleString()})
                </option>
              ))}
            </select>
          </div>

          {/* Rango de fechas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fecha inicio
              </label>
              <input
                type="date"
                value={dateRange.start}
                onChange={(e) => onDateRangeChange(e.target.value, dateRange.end)}
                className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fecha fin
              </label>
              <input
                type="date"
                value={dateRange.end}
                onChange={(e) => onDateRangeChange(dateRange.start, e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const UDPBalanceDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { udps, loading: udpsLoading } = useUDPs();
  const [selectedUDPId, setSelectedUDPId] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'analytics'>('overview');
  const [dateRange, setDateRange] = useState({
    start: format(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), 'yyyy-MM-dd'),
    end: format(new Date(), 'yyyy-MM-dd')
  });
  const {
    transactions,
    // monthlyChartData,
    // typeChartData,
    loading: transactionsLoading,
    error,
    loadTransactions,
    filterByDateRange,
    loadMonthlyChartData,
    loadTypeChartData
  } = useUDPBalanceHistory(selectedUDPId || 0);

  // Cargar UDP por defecto
  useEffect(() => {
    if (udps.length > 0 && !selectedUDPId) {
      setSelectedUDPId(udps[0].id_UDP);
    }
  }, [udps, selectedUDPId]);

  // Cargar datos cuando cambia la UDP seleccionada
  useEffect(() => {
    if (selectedUDPId) {
      loadTransactions();
      loadMonthlyChartData();
      loadTypeChartData();
    }
  }, [selectedUDPId]);

  const handleUDPChange = (udpId: number) => {
    setSelectedUDPId(udpId);
  };

  const handleDateRangeChange = (start: string, end: string) => {
    setDateRange({ start, end });
    if (selectedUDPId) {
      filterByDateRange(
        `${start}T00:00:00`,
        `${end}T23:59:59`
      );
    }
  };

  const handleRefresh = () => {
    if (selectedUDPId) {
      loadTransactions();
      loadMonthlyChartData();
      loadTypeChartData();
      toast.success('Datos actualizados correctamente');
    }
  };

  const handleExport = () => {
    if (transactions.length === 0) {
      toast.warning('No hay datos para exportar');
      return;
    }

    const csvContent = [
      ['Fecha', 'Tipo', 'Monto', 'Balance Después', 'Descripción'].join(','),
      ...transactions.map(t => [
        format(new Date(t.transactionDate), 'dd/MM/yyyy HH:mm', { locale: es }),
        t.transactionType,
        t.amount,
        t.balanceAfterTransaction,
        `"${t.description}"`
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `udp_balance_${selectedUDPId}_${dateRange.start}_${dateRange.end}.csv`;
    link.click();
      toast.success('Datos exportados correctamente');
  };

  const handleNewTransaction = () => {
    navigate('/dashboard/admin-udp-balance');
  };

  const selectedUDP = udps.find(udp => udp.id_UDP === selectedUDPId);

  // Estadísticas rápidas
  const quickStats = {
    totalTransactions: transactions.length,
    currentBalance: selectedUDP?.balance || 0,
    totalIncome: transactions.filter(t => t.amount > 0).reduce((sum, t) => sum + t.amount, 0),
    totalExpenses: Math.abs(transactions.filter(t => t.amount < 0).reduce((sum, t) => sum + t.amount, 0))
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <ToastContainer position="top-right" autoClose={3000} />
      
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Dashboard de Balance UDP
            </h1>
            <p className="text-gray-600">
              Monitoreo en tiempo real y análisis financiero de tus UDP
            </p>
          </div>          <div className="mt-4 md:mt-0 flex items-center space-x-3">
            <button
              onClick={handleNewTransaction}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <FaPlus className="mr-2" />
              Nueva Transacción
            </button>
          </div>
        </div>
      </div>

      {/* Filtros */}
      <FilterPanel
        selectedUDPId={selectedUDPId}
        udps={udps}
        onUDPChange={handleUDPChange}
        dateRange={dateRange}
        onDateRangeChange={handleDateRangeChange}
        onRefresh={handleRefresh}
        onExport={handleExport}
      />

      {/* Estadísticas rápidas */}
      {selectedUDPId && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <QuickStatsCard
            title="Balance Actual"
            value={`₡${quickStats.currentBalance.toLocaleString()}`}
            icon={<FaWallet className="text-blue-600 text-xl" />}
            trend={{
              value: 5.2,
              isPositive: quickStats.currentBalance >= 0
            }}
          />
          <QuickStatsCard
            title="Total Transacciones"
            value={quickStats.totalTransactions.toString()}
            icon={<FaExchangeAlt className="text-green-600 text-xl" />}
          />
          <QuickStatsCard
            title="Ingresos Totales"
            value={`₡${quickStats.totalIncome.toLocaleString()}`}
            icon={<FaChartLine className="text-emerald-600 text-xl" />}
          />
          <QuickStatsCard
            title="Gastos Totales"
            value={`₡${quickStats.totalExpenses.toLocaleString()}`}
            icon={<FaCalendarAlt className="text-red-600 text-xl" />}
          />
        </div>
      )}      {selectedUDPId ? (
        <div className="space-y-8">
          {/* Navegación por tabs */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="border-b border-gray-200">
              <nav className="flex space-x-8 px-6" aria-label="Tabs">
                <button
                  onClick={() => setActiveTab('overview')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === 'overview'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center">
                    <FaChartLine className="mr-2" />
                    Resumen General
                  </div>
                </button>
                <button
                  onClick={() => setActiveTab('analytics')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === 'analytics'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center">
                    <FaChartPie className="mr-2" />
                    Análisis Detallado
                  </div>
                </button>
              </nav>
            </div>
          </div>

          {/* Contenido de las tabs */}
          {activeTab === 'overview' ? (
            <div className="space-y-8">
              {/* Gráfico principal */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                <div className="p-6 border-b border-gray-100">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-gray-900">
                      Evolución del Balance - {selectedUDP?.title}
                    </h2>
                    <div className="text-sm text-gray-500">
                      Última actualización: {format(new Date(), 'dd/MM/yyyy HH:mm', { locale: es })}
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <UDPBalanceChart 
                    transactions={transactions}
                    loading={transactionsLoading}
                    onDateRangeChange={handleDateRangeChange}
                  />
                </div>
              </div>

              {/* Métricas detalladas */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                <div className="p-6 border-b border-gray-100">
                  <h2 className="text-xl font-semibold text-gray-900">
                    Métricas Financieras Detalladas
                  </h2>
                </div>
                <div className="p-6">
                  <UDPBalanceMetrics transactions={transactions} />
                </div>
              </div>

              {/* Tabla de transacciones recientes */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                <div className="p-6 border-b border-gray-100">
                  <h2 className="text-xl font-semibold text-gray-900">
                    Transacciones Recientes
                  </h2>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Fecha
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Tipo
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Monto
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Balance
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Descripción
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {transactions.slice(0, 10).map((transaction) => (
                        <tr key={transaction.id_UDPBalanceHistory} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {format(new Date(transaction.transactionDate), 'dd/MM/yyyy HH:mm', { locale: es })}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                              {transaction.transactionType}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <span className={`font-semibold ${
                              transaction.amount >= 0 ? 'text-green-600' : 'text-red-600'
                            }`}>
                              {transaction.amount >= 0 ? '+' : ''}₡{transaction.amount.toLocaleString()}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            ₡{transaction.balanceAfterTransaction.toLocaleString()}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate">
                            {transaction.description}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {transactions.length === 0 && (
                    <div className="text-center py-12">
                      <FaChartLine className="mx-auto text-4xl text-gray-300 mb-4" />
                      <p className="text-gray-500">No hay transacciones para mostrar</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-8">
              {/* Análisis detallado */}
              <UDPBalanceAnalytics transactions={transactions} />
            </div>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
          <FaWallet className="mx-auto text-6xl text-gray-300 mb-6" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Selecciona una UDP
          </h3>
          <p className="text-gray-600 mb-6">
            Elige una UDP de la lista para ver su dashboard de balance
          </p>
          {udpsLoading && (
            <div className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-1/4 mx-auto"></div>
            </div>
          )}
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <div className="flex">
            <div className="text-red-600">
              <p className="font-medium">Error al cargar los datos</p>
              <p className="text-sm">{error}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UDPBalanceDashboard;
