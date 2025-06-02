import React, { useMemo } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar, Line } from 'react-chartjs-2';
import { UDPBalanceTransaction } from '../services/udpBalanceService';
import { FaCalendarAlt, FaArrowUp as FaTrendUp, FaArrowDown as FaTrendDown, FaEquals } from 'react-icons/fa';
import { format, parseISO, getMonth, getYear } from 'date-fns';
import { es } from 'date-fns/locale';

// Registrar componentes de Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

interface UDPMonthlyAnalysisProps {
  transactions: UDPBalanceTransaction[];
  className?: string;
}

interface MonthlyData {
  month: string;
  year: number;
  monthNum: number;
  income: number;
  expenses: number;
  net: number;
  transactionCount: number;
  endBalance: number;
}

const UDPMonthlyAnalysis: React.FC<UDPMonthlyAnalysisProps> = ({
  transactions,
  className = ""
}) => {
  // Procesar datos mensuales
  const monthlyData = useMemo(() => {
    if (!transactions || transactions.length === 0) return [];

    const monthMap = new Map<string, {
      income: number;
      expenses: number;
      transactionCount: number;
      transactions: UDPBalanceTransaction[];
    }>();

    // Agrupar transacciones por mes
    transactions.forEach(transaction => {
      const date = parseISO(transaction.transactionDate);
      const monthKey = `${getYear(date)}-${String(getMonth(date) + 1).padStart(2, '0')}`;
      
      if (!monthMap.has(monthKey)) {
        monthMap.set(monthKey, {
          income: 0,
          expenses: 0,
          transactionCount: 0,
          transactions: []
        });
      }

      const monthData = monthMap.get(monthKey)!;
      monthData.transactionCount += 1;
      monthData.transactions.push(transaction);
      
      if (transaction.amount > 0) {
        monthData.income += transaction.amount;
      } else {
        monthData.expenses += Math.abs(transaction.amount);
      }
    });

    // Convertir a array y ordenar por fecha
    return Array.from(monthMap.entries())
      .map(([monthKey, data]): MonthlyData => {
        const [year, month] = monthKey.split('-');
        const monthDate = new Date(parseInt(year), parseInt(month) - 1, 1);
        
        // Obtener el balance al final del mes
        const monthTransactions = data.transactions.sort(
          (a, b) => new Date(a.transactionDate).getTime() - new Date(b.transactionDate).getTime()
        );
        const endBalance = monthTransactions.length > 0 
          ? monthTransactions[monthTransactions.length - 1].balanceAfterTransaction 
          : 0;

        return {
          month: format(monthDate, 'MMM', { locale: es }),
          year: parseInt(year),
          monthNum: parseInt(month),
          income: data.income,
          expenses: data.expenses,
          net: data.income - data.expenses,
          transactionCount: data.transactionCount,
          endBalance
        };
      })
      .sort((a, b) => {
        if (a.year !== b.year) return a.year - b.year;
        return a.monthNum - b.monthNum;
      });
  }, [transactions]);

  // Configuración del gráfico de barras (ingresos vs gastos)
  const barData = {
    labels: monthlyData.map(item => `${item.month} ${item.year}`),
    datasets: [
      {
        label: 'Ingresos',
        data: monthlyData.map(item => item.income),
        backgroundColor: 'rgba(16, 185, 129, 0.8)',
        borderColor: 'rgb(16, 185, 129)',
        borderWidth: 2,
        borderRadius: 4,
        borderSkipped: false,
      },
      {
        label: 'Gastos',
        data: monthlyData.map(item => item.expenses),
        backgroundColor: 'rgba(239, 68, 68, 0.8)',
        borderColor: 'rgb(239, 68, 68)',
        borderWidth: 2,
        borderRadius: 4,
        borderSkipped: false,
      }
    ]
  };

  // Configuración del gráfico de línea (balance mensual)
  const lineData = {
    labels: monthlyData.map(item => `${item.month} ${item.year}`),
    datasets: [
      {
        label: 'Balance al final del mes',
        data: monthlyData.map(item => item.endBalance),
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        borderWidth: 3,
        fill: true,
        tension: 0.1,
        pointBackgroundColor: 'rgb(59, 130, 246)',
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2,
        pointRadius: 6,
        pointHoverRadius: 8,
      }
    ]
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#ffffff',
        bodyColor: '#ffffff',
        borderColor: '#374151',
        borderWidth: 1,
        callbacks: {
          label: (context: any) => {
            const value = context.raw;
            return `${context.dataset.label}: ₡${value.toLocaleString()}`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(156, 163, 175, 0.1)'
        },
        ticks: {
          color: '#6B7280',
          callback: function(value: any) {
            return '₡' + Number(value).toLocaleString();
          }
        }
      },
      x: {
        grid: {
          display: false
        },
        ticks: {
          color: '#6B7280',
          maxRotation: 45
        }
      }
    }
  };

  const lineOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#ffffff',
        bodyColor: '#ffffff',
        borderColor: '#374151',
        borderWidth: 1,
        callbacks: {
          label: (context: any) => {
            const item = monthlyData[context.dataIndex];
            return [
              `Balance: ₡${context.raw.toLocaleString()}`,
              `Transacciones: ${item.transactionCount}`,
              `Flujo neto: ₡${item.net.toLocaleString()}`
            ];
          }
        }
      }
    },
    scales: {
      y: {
        grid: {
          color: 'rgba(156, 163, 175, 0.1)'
        },
        ticks: {
          color: '#6B7280',
          callback: function(value: any) {
            return '₡' + Number(value).toLocaleString();
          }
        }
      },
      x: {
        grid: {
          display: false
        },
        ticks: {
          color: '#6B7280',
          maxRotation: 45
        }
      }
    }
  };

  if (monthlyData.length === 0) {
    return (
      <div className={`bg-white rounded-xl shadow-sm border border-gray-100 p-8 ${className}`}>
        <div className="text-center">
          <FaCalendarAlt className="mx-auto text-4xl text-gray-300 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Sin Datos Mensuales
          </h3>
          <p className="text-gray-600">
            No hay transacciones suficientes para generar análisis mensual
          </p>
        </div>
      </div>
    );
  }

  // Calcular tendencias
  const currentMonth = monthlyData[monthlyData.length - 1];
  const previousMonth = monthlyData.length > 1 ? monthlyData[monthlyData.length - 2] : null;

  const balanceTrend = previousMonth 
    ? ((currentMonth.endBalance - previousMonth.endBalance) / Math.abs(previousMonth.endBalance || 1)) * 100
    : 0;

  const incomeTrend = previousMonth 
    ? ((currentMonth.income - previousMonth.income) / Math.abs(previousMonth.income || 1)) * 100
    : 0;

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Resumen mensual */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center mb-4">
          <FaCalendarAlt className="text-blue-600 mr-2" />
          <h3 className="text-lg font-semibold text-gray-900">
            Análisis Mensual - Últimos {monthlyData.length} meses
          </h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              ₡{currentMonth.endBalance.toLocaleString()}
            </div>
            <div className="text-sm text-gray-600">Balance Actual</div>
            {previousMonth && (
              <div className={`flex items-center justify-center mt-1 text-xs ${
                balanceTrend >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {balanceTrend === 0 ? <FaEquals /> : balanceTrend > 0 ? <FaTrendUp /> : <FaTrendDown />}
                <span className="ml-1">{Math.abs(balanceTrend).toFixed(1)}%</span>
              </div>
            )}
          </div>

          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              ₡{currentMonth.income.toLocaleString()}
            </div>
            <div className="text-sm text-gray-600">Ingresos del Mes</div>
            {previousMonth && (
              <div className={`flex items-center justify-center mt-1 text-xs ${
                incomeTrend >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {incomeTrend === 0 ? <FaEquals /> : incomeTrend > 0 ? <FaTrendUp /> : <FaTrendDown />}
                <span className="ml-1">{Math.abs(incomeTrend).toFixed(1)}%</span>
              </div>
            )}
          </div>

          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">
              ₡{currentMonth.expenses.toLocaleString()}
            </div>
            <div className="text-sm text-gray-600">Gastos del Mes</div>
          </div>

          <div className="text-center">
            <div className={`text-2xl font-bold ${
              currentMonth.net >= 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              ₡{currentMonth.net.toLocaleString()}
            </div>
            <div className="text-sm text-gray-600">Flujo Neto</div>
          </div>
        </div>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Gráfico de barras - Ingresos vs Gastos */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Ingresos vs Gastos Mensuales
          </h3>
          <div className="h-80">
            <Bar data={barData} options={barOptions} />
          </div>
        </div>

        {/* Gráfico de línea - Evolución del balance */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Evolución del Balance Mensual
          </h3>
          <div className="h-80">
            <Line data={lineData} options={lineOptions} />
          </div>
        </div>
      </div>

      {/* Tabla detallada */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900">
            Detalle Mensual
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Mes
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ingresos
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Gastos
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Flujo Neto
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Transacciones
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Balance Final
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {monthlyData.map((month) => (
                <tr key={`${month.year}-${month.monthNum}`} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {month.month} {month.year}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 font-semibold">
                    ₡{month.income.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600 font-semibold">
                    ₡{month.expenses.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold">
                    <span className={month.net >= 0 ? 'text-green-600' : 'text-red-600'}>
                      ₡{month.net.toLocaleString()}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {month.transactionCount}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                    ₡{month.endBalance.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UDPMonthlyAnalysis;
