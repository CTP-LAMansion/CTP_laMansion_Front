import React, { useMemo } from 'react';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title
} from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';
import { UDPBalanceTransaction } from '../services/udpBalanceService';
import { FaChartPie, FaChartBar, FaExchangeAlt } from 'react-icons/fa';

// Registrar componentes de Chart.js
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title
);

interface UDPBalanceAnalyticsProps {
  transactions: UDPBalanceTransaction[];
  className?: string;
}

const UDPBalanceAnalytics: React.FC<UDPBalanceAnalyticsProps> = ({
  transactions,
  className = ""
}) => {
  // Colores predefinidos para los tipos de transacción
  const colors = [
    '#3B82F6', // Blue
    '#10B981', // Green
    '#F59E0B', // Yellow
    '#EF4444', // Red
    '#8B5CF6', // Purple
    '#06B6D4', // Cyan
    '#84CC16', // Lime
    '#F97316', // Orange
    '#EC4899', // Pink
    '#6B7280'  // Gray
  ];

  // Procesar datos por tipo de transacción
  const typeAnalysis = useMemo(() => {
    if (!transactions || transactions.length === 0) return [];

    const typeMap = new Map<string, {
      count: number;
      totalAmount: number;
      amounts: number[];
    }>();

    transactions.forEach(transaction => {
      const type = transaction.transactionType;
      if (!typeMap.has(type)) {
        typeMap.set(type, {
          count: 0,
          totalAmount: 0,
          amounts: []
        });
      }

      const data = typeMap.get(type)!;
      data.count += 1;
      data.totalAmount += Math.abs(transaction.amount);
      data.amounts.push(Math.abs(transaction.amount));
    });

    return Array.from(typeMap.entries()).map(([type, data], index) => ({
      type,
      count: data.count,
      totalAmount: data.totalAmount,
      avgAmount: data.totalAmount / data.count,
      color: colors[index % colors.length]
    })).sort((a, b) => b.totalAmount - a.totalAmount);
  }, [transactions]);

  // Configuración del gráfico de pastel
  const pieData = {
    labels: typeAnalysis.map(item => item.type),
    datasets: [
      {
        label: 'Distribución por Tipo',
        data: typeAnalysis.map(item => item.totalAmount),
        backgroundColor: typeAnalysis.map(item => item.color),
        borderColor: typeAnalysis.map(item => item.color),
        borderWidth: 2,
        hoverBorderWidth: 3,
      }
    ]
  };

  // Configuración del gráfico de barras
  const barData = {
    labels: typeAnalysis.map(item => item.type),
    datasets: [
      {
        label: 'Cantidad de Transacciones',
        data: typeAnalysis.map(item => item.count),
        backgroundColor: typeAnalysis.map(item => item.color + '80'), // 50% opacity
        borderColor: typeAnalysis.map(item => item.color),
        borderWidth: 2,
        borderRadius: 4,
        borderSkipped: false,
      }
    ]
  };

  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right' as const,
        labels: {
          boxWidth: 12,
          padding: 10,
          font: {
            size: 11
          }
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#ffffff',
        bodyColor: '#ffffff',
        borderColor: '#374151',
        borderWidth: 1,
        callbacks: {
          label: (context: any) => {
            const item = typeAnalysis[context.dataIndex];
            const percentage = ((item.totalAmount / typeAnalysis.reduce((sum, t) => sum + t.totalAmount, 0)) * 100).toFixed(1);
            return [
              `${item.type}: ₡${item.totalAmount.toLocaleString()}`,
              `${percentage}% del total`,
              `${item.count} transacciones`
            ];
          }
        }
      }
    }
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#ffffff',
        bodyColor: '#ffffff',
        borderColor: '#374151',
        borderWidth: 1,
        callbacks: {
          label: (context: any) => {
            const item = typeAnalysis[context.dataIndex];
            return [
              `Transacciones: ${item.count}`,
              `Total: ₡${item.totalAmount.toLocaleString()}`,
              `Promedio: ₡${item.avgAmount.toLocaleString()}`
            ];
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
          stepSize: 1
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

  if (typeAnalysis.length === 0) {
    return (
      <div className={`bg-white rounded-xl shadow-sm border border-gray-100 p-8 ${className}`}>
        <div className="text-center">
          <FaChartBar className="mx-auto text-4xl text-gray-300 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Sin Datos de Análisis
          </h3>
          <p className="text-gray-600">
            No hay transacciones suficientes para generar análisis
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Estadísticas por tipo */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center mb-4">
          <FaExchangeAlt className="text-blue-600 mr-2" />
          <h3 className="text-lg font-semibold text-gray-900">
            Análisis por Tipo de Transacción
          </h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {typeAnalysis.map((item) => (
            <div key={item.type} className="bg-gray-50 rounded-lg p-4">              <div className="flex items-center mb-2">
                <div 
                  className="w-3 h-3 rounded-full mr-2 border-2"
                  data-color={item.color}
                  ref={(el) => {
                    if (el) {
                      el.style.backgroundColor = item.color;
                    }
                  }}
                />
                <span className="font-medium text-gray-900">{item.type}</span>
              </div>
              <div className="space-y-1 text-sm text-gray-600">
                <div>Transacciones: <span className="font-semibold">{item.count}</span></div>
                <div>Total: <span className="font-semibold">₡{item.totalAmount.toLocaleString()}</span></div>
                <div>Promedio: <span className="font-semibold">₡{item.avgAmount.toLocaleString()}</span></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gráfico de pastel */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">          <div className="flex items-center mb-4">
            <FaChartPie className="text-blue-600 mr-2" />
            <h3 className="text-lg font-semibold text-gray-900">
              Distribución por Monto
            </h3>
          </div>
          <div className="h-64">
            <Pie data={pieData} options={pieOptions} />
          </div>
        </div>

        {/* Gráfico de barras */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center mb-4">
            <FaChartBar className="text-blue-600 mr-2" />
            <h3 className="text-lg font-semibold text-gray-900">
              Cantidad de Transacciones
            </h3>
          </div>
          <div className="h-64">
            <Bar data={barData} options={barOptions} />
          </div>
        </div>
      </div>

      {/* Resumen estadístico */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Resumen Estadístico</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div>
            <div className="text-2xl font-bold text-blue-600">
              {typeAnalysis.length}
            </div>
            <div className="text-sm text-gray-600">Tipos Diferentes</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-green-600">
              ₡{typeAnalysis.reduce((sum, item) => sum + item.totalAmount, 0).toLocaleString()}
            </div>
            <div className="text-sm text-gray-600">Total Movido</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-purple-600">
              {typeAnalysis.reduce((sum, item) => sum + item.count, 0)}
            </div>
            <div className="text-sm text-gray-600">Total Transacciones</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-orange-600">
              ₡{(typeAnalysis.reduce((sum, item) => sum + item.totalAmount, 0) / typeAnalysis.reduce((sum, item) => sum + item.count, 0)).toLocaleString()}
            </div>
            <div className="text-sm text-gray-600">Promedio General</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UDPBalanceAnalytics;
