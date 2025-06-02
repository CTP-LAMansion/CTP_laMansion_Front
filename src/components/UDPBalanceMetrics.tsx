import React, { useMemo } from 'react';
import { UDPBalanceTransaction } from '../services/udpBalanceService';
import { 
  FaArrowUp, 
  FaArrowDown, 
  FaWallet, 
  FaExchangeAlt,
  FaArrowUp as FaTrendUp,
  FaArrowDown as FaTrendDown,
  FaChartBar
} from 'react-icons/fa';
import { format, parseISO, isSameMonth } from 'date-fns';
import { es } from 'date-fns/locale';

interface UDPBalanceMetricsProps {
  transactions: UDPBalanceTransaction[];
  className?: string;
}

interface MetricCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
}

const MetricCard: React.FC<MetricCardProps> = ({ 
  title, 
  value, 
  icon, 
  trend, 
  className = "" 
}) => (
  <div className={`bg-white rounded-lg shadow p-6 ${className}`}>
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-600">{title}</p>
        <p className="text-2xl font-bold text-gray-900">
          {typeof value === 'number' ? value.toLocaleString() : value}
        </p>
        {trend && (
          <div className={`flex items-center mt-2 text-sm ${
            trend.isPositive ? 'text-green-600' : 'text-red-600'
          }`}>
            {trend.isPositive ? <FaTrendUp className="mr-1" /> : <FaTrendDown className="mr-1" />}
            <span>{Math.abs(trend.value).toFixed(1)}%</span>
          </div>
        )}
      </div>
      <div className="p-3 bg-blue-50 rounded-lg">
        {icon}
      </div>
    </div>
  </div>
);

const UDPBalanceMetrics: React.FC<UDPBalanceMetricsProps> = ({ 
  transactions, 
  className = "" 
}) => {
  const metrics = useMemo(() => {
    if (!transactions || transactions.length === 0) {
      return {
        currentBalance: 0,
        totalIncome: 0,
        totalExpenses: 0,
        netFlow: 0,
        transactionCount: 0,
        averageTransaction: 0,
        monthlyIncome: 0,
        monthlyExpenses: 0,
        monthlyNet: 0,
        lastTransaction: null,
        highestBalance: 0,
        lowestBalance: 0,
        volatilityIndex: 0
      };
    }

    // Ordenar transacciones por fecha
    const sortedTransactions = [...transactions].sort(
      (a, b) => new Date(a.transactionDate).getTime() - new Date(b.transactionDate).getTime()
    );

    const currentBalance = sortedTransactions[sortedTransactions.length - 1]?.balanceAfterTransaction || 0;
    
    // Calcular ingresos y gastos totales
    const totalIncome = transactions
      .filter(t => t.amount > 0)
      .reduce((sum, t) => sum + t.amount, 0);
    
    const totalExpenses = Math.abs(transactions
      .filter(t => t.amount < 0)
      .reduce((sum, t) => sum + t.amount, 0));
    
    const netFlow = totalIncome - totalExpenses;
    const transactionCount = transactions.length;
    const averageTransaction = transactionCount > 0 
      ? transactions.reduce((sum, t) => sum + Math.abs(t.amount), 0) / transactionCount 
      : 0;

    // Métricas del mes actual
    const currentMonth = new Date();
    const currentMonthTransactions = transactions.filter(t => 
      isSameMonth(parseISO(t.transactionDate), currentMonth)
    );

    const monthlyIncome = currentMonthTransactions
      .filter(t => t.amount > 0)
      .reduce((sum, t) => sum + t.amount, 0);
    
    const monthlyExpenses = Math.abs(currentMonthTransactions
      .filter(t => t.amount < 0)
      .reduce((sum, t) => sum + t.amount, 0));
    
    const monthlyNet = monthlyIncome - monthlyExpenses;

    // Última transacción
    const lastTransaction = sortedTransactions[sortedTransactions.length - 1] || null;

    // Balance máximo y mínimo
    const balances = sortedTransactions.map(t => t.balanceAfterTransaction);
    const highestBalance = Math.max(...balances);
    const lowestBalance = Math.min(...balances);

    // Índice de volatilidad (desviación estándar de cambios porcentuales)
    let volatilityIndex = 0;
    if (balances.length > 1) {
      const changes = [];
      for (let i = 1; i < balances.length; i++) {
        if (balances[i - 1] !== 0) {
          const change = ((balances[i] - balances[i - 1]) / Math.abs(balances[i - 1])) * 100;
          changes.push(change);
        }
      }
      
      if (changes.length > 0) {
        const mean = changes.reduce((sum, change) => sum + change, 0) / changes.length;
        const variance = changes.reduce((sum, change) => sum + Math.pow(change - mean, 2), 0) / changes.length;
        volatilityIndex = Math.sqrt(variance);
      }
    }

    return {
      currentBalance,
      totalIncome,
      totalExpenses,
      netFlow,
      transactionCount,
      averageTransaction,
      monthlyIncome,
      monthlyExpenses,
      monthlyNet,
      lastTransaction,
      highestBalance,
      lowestBalance,
      volatilityIndex
    };
  }, [transactions]);

  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 ${className}`}>      {/* Balance Actual */}
      <MetricCard
        title="Balance Actual"
        value={`₡${metrics.currentBalance.toLocaleString()}`}
        icon={<FaWallet className="text-blue-600 text-xl" />}
        trend={{
          value: metrics.netFlow !== 0 ? (metrics.netFlow / Math.abs(metrics.currentBalance || 1)) * 100 : 0,
          isPositive: metrics.netFlow >= 0
        }}
      />

      {/* Ingresos Totales */}
      <MetricCard
        title="Ingresos Totales"
        value={`₡${metrics.totalIncome.toLocaleString()}`}
        icon={<FaArrowUp className="text-green-600 text-xl" />}
        trend={{
          value: metrics.monthlyIncome !== 0 ? (metrics.monthlyIncome / metrics.totalIncome) * 100 : 0,
          isPositive: true
        }}
      />

      {/* Gastos Totales */}
      <MetricCard
        title="Gastos Totales"
        value={`₡${metrics.totalExpenses.toLocaleString()}`}
        icon={<FaArrowDown className="text-red-600 text-xl" />}
        trend={{
          value: metrics.monthlyExpenses !== 0 ? (metrics.monthlyExpenses / metrics.totalExpenses) * 100 : 0,
          isPositive: false
        }}
      />

      {/* Flujo Neto */}
      <MetricCard
        title="Flujo Neto"
        value={`₡${metrics.netFlow.toLocaleString()}`}
        icon={<FaExchangeAlt className={`text-xl ${metrics.netFlow >= 0 ? 'text-green-600' : 'text-red-600'}`} />}
        trend={{
          value: metrics.monthlyNet !== 0 ? Math.abs(metrics.monthlyNet / (metrics.netFlow || 1)) * 100 : 0,
          isPositive: metrics.monthlyNet >= 0
        }}
      />

      {/* Métricas mensuales - fila adicional */}
      <div className="md:col-span-2 lg:col-span-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">          <MetricCard
            title="Ingresos del Mes"
            value={`₡${metrics.monthlyIncome.toLocaleString()}`}
            icon={<FaTrendUp className="text-green-600 text-xl" />}
          />

          <MetricCard
            title="Gastos del Mes"
            value={`₡${metrics.monthlyExpenses.toLocaleString()}`}
            icon={<FaTrendDown className="text-red-600 text-xl" />}
          />

          <MetricCard
            title="Neto del Mes"
            value={`₡${metrics.monthlyNet.toLocaleString()}`}
            icon={<FaChartBar className={`text-xl ${metrics.monthlyNet >= 0 ? 'text-green-600' : 'text-red-600'}`} />}
          />
        </div>
      </div>

      {/* Información adicional */}
      <div className="md:col-span-2 lg:col-span-4">
        <div className="bg-white rounded-lg shadow p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Estadísticas Adicionales</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="text-gray-600">Total Transacciones:</span>
              <div className="font-semibold text-gray-900">{metrics.transactionCount}</div>
            </div>            <div>
              <span className="text-gray-600">Promedio por Transacción:</span>
              <div className="font-semibold text-gray-900">₡{metrics.averageTransaction.toLocaleString()}</div>
            </div>
            <div>
              <span className="text-gray-600">Balance Máximo:</span>
              <div className="font-semibold text-green-600">₡{metrics.highestBalance.toLocaleString()}</div>
            </div>
            <div>
              <span className="text-gray-600">Balance Mínimo:</span>
              <div className="font-semibold text-red-600">₡{metrics.lowestBalance.toLocaleString()}</div>
            </div>
            <div>
              <span className="text-gray-600">Índice de Volatilidad:</span>
              <div className="font-semibold text-gray-900">{metrics.volatilityIndex.toFixed(2)}%</div>
            </div>
            {metrics.lastTransaction && (
              <>
                <div>
                  <span className="text-gray-600">Última Transacción:</span>
                  <div className="font-semibold text-gray-900">
                    {format(parseISO(metrics.lastTransaction.transactionDate), 'dd/MM/yyyy', { locale: es })}
                  </div>
                </div>
                <div>
                  <span className="text-gray-600">Tipo:</span>
                  <div className="font-semibold text-gray-900">{metrics.lastTransaction.transactionType}</div>
                </div>
                <div>
                  <span className="text-gray-600">Monto:</span>                  <div className={`font-semibold ${
                    metrics.lastTransaction.amount >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    ₡{metrics.lastTransaction.amount.toLocaleString()}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UDPBalanceMetrics;
