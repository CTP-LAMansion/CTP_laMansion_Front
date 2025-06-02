import React, { useState, useMemo } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale,
  ChartOptions,
  TooltipItem
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import 'chartjs-adapter-date-fns';
import { format, parseISO, startOfDay, endOfDay, subDays, subYears } from 'date-fns';
import { es } from 'date-fns/locale';
import { UDPBalanceTransaction } from '../services/udpBalanceService';
import { FaCalendarAlt, FaChartLine, FaArrowUp, FaArrowDown, FaEquals } from 'react-icons/fa';

// Registrar los componentes de Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale
);

interface UDPBalanceChartProps {
  transactions: UDPBalanceTransaction[];
  loading?: boolean;
  className?: string;
  onDateRangeChange?: (startDate: string, endDate: string) => void;
}

type TimeRange = '7d' | '30d' | '90d' | '1y' | 'all';

interface ProcessedDataPoint {
  x: Date;
  y: number;
  transaction?: UDPBalanceTransaction;
}

const UDPBalanceChart: React.FC<UDPBalanceChartProps> = ({
  transactions,
  loading = false,
  className = "",
  onDateRangeChange
}) => {
  const [selectedTimeRange, setSelectedTimeRange] = useState<TimeRange>('30d');
  const [hoveredPoint, setHoveredPoint] = useState<ProcessedDataPoint | null>(null);

  // Procesar datos para el gráfico
  const processedData = useMemo(() => {
    if (!transactions || transactions.length === 0) return [];

    // Ordenar transacciones por fecha
    const sortedTransactions = [...transactions].sort(
      (a, b) => new Date(a.transactionDate).getTime() - new Date(b.transactionDate).getTime()
    );

    // Filtrar por rango de tiempo seleccionado
    const now = new Date();
    let startDate: Date;

    switch (selectedTimeRange) {
      case '7d':
        startDate = subDays(now, 7);
        break;
      case '30d':
        startDate = subDays(now, 30);
        break;
      case '90d':
        startDate = subDays(now, 90);
        break;
      case '1y':
        startDate = subYears(now, 1);
        break;
      default:
        startDate = new Date(0); // Todos los datos
    }

    const filteredTransactions = sortedTransactions.filter(
      (transaction) => new Date(transaction.transactionDate) >= startDate
    );

    // Convertir a puntos de datos
    return filteredTransactions.map((transaction): ProcessedDataPoint => ({
      x: parseISO(transaction.transactionDate),
      y: transaction.balanceAfterTransaction,
      transaction
    }));
  }, [transactions, selectedTimeRange]);

  // Calcular estadísticas
  const stats = useMemo(() => {
    if (processedData.length === 0) {
      return {
        currentBalance: 0,
        change: 0,
        changePercent: 0,
        isPositive: true,
        highestBalance: 0,
        lowestBalance: 0
      };
    }

    const currentBalance = processedData[processedData.length - 1]?.y || 0;
    const previousBalance = processedData.length > 1 ? processedData[0]?.y || 0 : currentBalance;
    const change = currentBalance - previousBalance;
    const changePercent = previousBalance !== 0 ? (change / Math.abs(previousBalance)) * 100 : 0;
    
    const balances = processedData.map(point => point.y);
    const highestBalance = Math.max(...balances);
    const lowestBalance = Math.min(...balances);

    return {
      currentBalance,
      change,
      changePercent,
      isPositive: change >= 0,
      highestBalance,
      lowestBalance
    };
  }, [processedData]);

  // Configuración del gráfico
  const chartData = {
    datasets: [
      {
        label: 'Balance UDP',
        data: processedData,
        borderColor: stats.isPositive ? '#10B981' : '#EF4444',
        backgroundColor: stats.isPositive ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
        borderWidth: 2,
        fill: true,
        tension: 0.1,
        pointBackgroundColor: stats.isPositive ? '#10B981' : '#EF4444',
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
        pointHoverBackgroundColor: stats.isPositive ? '#059669' : '#DC2626',
      }
    ]
  };

  const options: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      title: {
        display: false
      },
      tooltip: {
        mode: 'nearest',
        intersect: false,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#ffffff',
        bodyColor: '#ffffff',
        borderColor: stats.isPositive ? '#10B981' : '#EF4444',
        borderWidth: 1,
        callbacks: {
          title: (context: TooltipItem<'line'>[]) => {
            const point = context[0];
            const dataPoint = processedData[point.dataIndex];
            return format(dataPoint.x, 'PPPp', { locale: es });
          },
          label: (context: TooltipItem<'line'>) => {
            const dataPoint = processedData[context.dataIndex];
            const transaction = dataPoint.transaction;
              return [
              `Balance: ₡${dataPoint.y.toLocaleString()}`,
              transaction ? `Transacción: ${transaction.transactionType}` : '',
              transaction ? `Monto: ₡${transaction.amount.toLocaleString()}` : '',
              transaction ? `Descripción: ${transaction.description}` : ''
            ].filter(Boolean);
          }
        }
      }
    },
    scales: {
      x: {
        type: 'time',
        time: {
          unit: selectedTimeRange === '7d' ? 'hour' : 
                selectedTimeRange === '30d' ? 'day' :
                selectedTimeRange === '90d' ? 'day' : 'month',
          displayFormats: {
            hour: 'HH:mm',
            day: 'MMM dd',
            month: 'MMM yyyy'
          }
        },
        grid: {
          color: 'rgba(156, 163, 175, 0.1)'
        },
        ticks: {
          color: '#6B7280'
        }
      },
      y: {
        beginAtZero: false,
        grid: {
          color: 'rgba(156, 163, 175, 0.1)'
        },        ticks: {
          color: '#6B7280',
          callback: function(value) {
            return '₡' + Number(value).toLocaleString();
          }
        }
      }
    },
    interaction: {
      mode: 'nearest',
      axis: 'x',
      intersect: false
    },
    onHover: (_, activeElements) => {
      if (activeElements.length > 0) {
        const pointIndex = activeElements[0].index;
        setHoveredPoint(processedData[pointIndex]);
      } else {
        setHoveredPoint(null);
      }
    }
  };

  const handleTimeRangeChange = (range: TimeRange) => {
    setSelectedTimeRange(range);
    
    if (onDateRangeChange && range !== 'all') {
      const now = new Date();
      let startDate: Date;
      
      switch (range) {
        case '7d':
          startDate = subDays(now, 7);
          break;
        case '30d':
          startDate = subDays(now, 30);
          break;
        case '90d':
          startDate = subDays(now, 90);
          break;
        case '1y':
          startDate = subYears(now, 1);
          break;
        default:
          return;
      }
      
      onDateRangeChange(
        format(startOfDay(startDate), "yyyy-MM-dd'T'HH:mm:ss"),
        format(endOfDay(now), "yyyy-MM-dd'T'HH:mm:ss")
      );
    }
  };

  if (loading) {
    return (
      <div className={`bg-white rounded-lg shadow-lg p-6 ${className}`}>
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded mb-4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-lg shadow-lg p-6 ${className}`}>
      {/* Header con estadísticas */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
          <div>
            <h3 className="text-xl font-bold text-gray-900 flex items-center">
              <FaChartLine className="mr-2 text-blue-600" />
              Balance UDP
            </h3>            <div className="flex items-center mt-2">
              <span className="text-2xl font-bold text-gray-900">
                ₡{stats.currentBalance.toLocaleString()}
              </span>
              <div className={`ml-3 flex items-center ${stats.isPositive ? 'text-green-600' : 'text-red-600'}`}>
                {stats.change === 0 ? (
                  <FaEquals className="mr-1" />
                ) : stats.isPositive ? (
                  <FaArrowUp className="mr-1" />
                ) : (
                  <FaArrowDown className="mr-1" />
                )}
                <span className="font-semibold">
                  ₡{Math.abs(stats.change).toLocaleString()} ({Math.abs(stats.changePercent).toFixed(2)}%)
                </span>
              </div>
            </div>
          </div>
            {/* Estadísticas adicionales */}
          <div className="flex flex-col text-sm text-gray-600 mt-4 sm:mt-0">
            <div>Máximo: ₡{stats.highestBalance.toLocaleString()}</div>
            <div>Mínimo: ₡{stats.lowestBalance.toLocaleString()}</div>
          </div>
        </div>

        {/* Selector de rango de tiempo */}
        <div className="flex flex-wrap gap-2">
          {[
            { value: '7d', label: '7D' },
            { value: '30d', label: '30D' },
            { value: '90d', label: '90D' },
            { value: '1y', label: '1A' },
            { value: 'all', label: 'Todo' }
          ].map((range) => (
            <button
              key={range.value}
              onClick={() => handleTimeRangeChange(range.value as TimeRange)}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                selectedTimeRange === range.value
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {range.label}
            </button>
          ))}
        </div>
      </div>

      {/* Gráfico */}
      <div className="h-64 sm:h-80">
        {processedData.length > 0 ? (
          <Line data={chartData} options={options} />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">
            <div className="text-center">
              <FaCalendarAlt className="mx-auto mb-2 text-3xl" />
              <p>No hay datos para el período seleccionado</p>
            </div>
          </div>
        )}
      </div>

      {/* Información del punto seleccionado */}
      {hoveredPoint && (
        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium text-gray-700">Fecha:</span>
              <div className="text-gray-900">
                {format(hoveredPoint.x, 'PPPp', { locale: es })}
              </div>
            </div>            <div>
              <span className="font-medium text-gray-700">Balance:</span>
              <div className="text-gray-900 font-semibold">
                ₡{hoveredPoint.y.toLocaleString()}
              </div>
            </div>
            {hoveredPoint.transaction && (
              <>
                <div>
                  <span className="font-medium text-gray-700">Tipo:</span>
                  <div className="text-gray-900">
                    {hoveredPoint.transaction.transactionType}
                  </div>
                </div>                <div>
                  <span className="font-medium text-gray-700">Monto:</span>
                  <div className={`font-semibold ${
                    hoveredPoint.transaction.amount >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    ₡{hoveredPoint.transaction.amount.toLocaleString()}
                  </div>
                </div>
                <div className="col-span-2">
                  <span className="font-medium text-gray-700">Descripción:</span>
                  <div className="text-gray-900">
                    {hoveredPoint.transaction.description}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default UDPBalanceChart;
