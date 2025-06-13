import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, MessageCircle, RefreshCw } from 'lucide-react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { MarketData as MarketDataType } from '../types';
import { MarketService } from '../services/marketService';
import { AIService } from '../services/aiService';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface MarketDataProps {
  theme: 'light' | 'dark';
}

const MarketData: React.FC<MarketDataProps> = ({ theme }) => {
  const [marketData, setMarketData] = useState<MarketDataType[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStock, setSelectedStock] = useState<MarketDataType | null>(null);
  const [aiExplanation, setAiExplanation] = useState<string>('');
  const [isGeneratingExplanation, setIsGeneratingExplanation] = useState(false);

  useEffect(() => {
    loadMarketData();
    const interval = setInterval(loadMarketData, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const loadMarketData = async () => {
    setLoading(true);
    try {
      const data = await MarketService.getMarketData();
      setMarketData(data);
    } catch (error) {
      console.error('Error loading market data:', error);
    } finally {
      setLoading(false);
    }
  };

  const explainTrend = async (stock: MarketDataType) => {
    setIsGeneratingExplanation(true);
    try {
      const trendDirection = stock.changePercent > 0 ? 'upward' : 'downward';
      const explanation = `${stock.name} is showing an ${trendDirection} trend with a ${Math.abs(stock.changePercent).toFixed(2)}% change. Current price: ${stock.price.toLocaleString()}. This movement could be influenced by market sentiment, economic indicators, or sector-specific news.`;
      setAiExplanation(explanation);
    } catch (error) {
      console.error('Error generating explanation:', error);
      setAiExplanation('Unable to generate explanation at this time.');
    } finally {
      setIsGeneratingExplanation(false);
    }
  };

  const getChartOptions = (stock: MarketDataType) => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: `${stock.name} - 30 Day Trend`,
        color: theme === 'dark' ? '#fff' : '#000',
      },
    },
    scales: {
      x: {
        display: false,
        grid: {
          color: theme === 'dark' ? '#374151' : '#e5e7eb',
        },
      },
      y: {
        grid: {
          color: theme === 'dark' ? '#374151' : '#e5e7eb',
        },
        ticks: {
          color: theme === 'dark' ? '#9ca3af' : '#6b7280',
        },
      },
    },
  });

  const getChartData = (stock: MarketDataType) => ({
    labels: Array.from({ length: stock.data.length }, (_, i) => i + 1),
    datasets: [
      {
        label: stock.name,
        data: stock.data,
        borderColor: stock.changePercent >= 0 ? '#10b981' : '#ef4444',
        backgroundColor: stock.changePercent >= 0 ? '#10b98110' : '#ef444410',
        borderWidth: 2,
        fill: true,
        tension: 0.4,
        pointRadius: 0,
        pointHoverRadius: 4,
      },
    ],
  });

  const formatCurrency = (value: number, symbol: string) => {
    if (symbol === 'USDINR') return `₹${value.toFixed(2)}`;
    if (symbol === 'BTC' || symbol === 'ETH') return `$${value.toLocaleString()}`;
    return value.toLocaleString();
  };

  return (
    <div className={`h-full ${theme === 'dark' ? 'bg-gray-900' : 'bg-white'}`}>
      {/* Header */}
      <div className={`border-b p-6 ${theme === 'dark' ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-gray-50'}`}>
        <div className="flex items-center justify-between">
          <h2 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            Market & Finance Snapshots
          </h2>
          <button
            onClick={loadMarketData}
            disabled={loading}
            className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg hover:from-blue-600 hover:to-cyan-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Market Data Grid */}
      <div className="p-6 overflow-y-auto" style={{ height: 'calc(100% - 100px)' }}>
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {marketData.map((stock) => (
              <div
                key={stock.symbol}
                className={`rounded-lg border p-6 transition-all duration-200 hover:shadow-lg cursor-pointer ${
                  theme === 'dark'
                    ? 'bg-gray-800 border-gray-700 hover:border-purple-500/50'
                    : 'bg-white border-gray-200 hover:border-purple-300'
                }`}
                onClick={() => setSelectedStock(stock)}
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className={`font-semibold text-lg ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                      {stock.symbol}
                    </h3>
                    <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                      {stock.name}
                    </p>
                  </div>
                  <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-sm ${
                    stock.changePercent >= 0
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                      : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                  }`}>
                    {stock.changePercent >= 0 ? (
                      <TrendingUp className="w-4 h-4" />
                    ) : (
                      <TrendingDown className="w-4 h-4" />
                    )}
                    <span>{Math.abs(stock.changePercent).toFixed(2)}%</span>
                  </div>
                </div>

                <div className="mb-4">
                  <div className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    {formatCurrency(stock.price, stock.symbol)}
                  </div>
                  <div className={`text-sm ${
                    stock.change >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                  }`}>
                    {stock.change >= 0 ? '+' : ''}{stock.change.toFixed(2)}
                  </div>
                </div>

                {/* Mini Chart */}
                <div className="h-20">
                  <Line
                    data={getChartData(stock)}
                    options={{
                      ...getChartOptions(stock),
                      plugins: { ...getChartOptions(stock).plugins, title: { display: false } }
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Stock Detail Modal */}
      {selectedStock && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className={`rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto ${
            theme === 'dark' ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
          }`}>
            <div className="p-6">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    {selectedStock.name}
                  </h2>
                  <p className={`text-lg ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                    {selectedStock.symbol}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedStock(null)}
                  className={`text-2xl ${theme === 'dark' ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-700'}`}
                >
                  ×
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <div className={`text-3xl font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    {formatCurrency(selectedStock.price, selectedStock.symbol)}
                  </div>
                  <div className={`flex items-center space-x-2 text-lg ${
                    selectedStock.change >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                  }`}>
                    {selectedStock.change >= 0 ? (
                      <TrendingUp className="w-5 h-5" />
                    ) : (
                      <TrendingDown className="w-5 h-5" />
                    )}
                    <span>
                      {selectedStock.change >= 0 ? '+' : ''}{selectedStock.change.toFixed(2)} 
                      ({selectedStock.changePercent >= 0 ? '+' : ''}{selectedStock.changePercent.toFixed(2)}%)
                    </span>
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={() => explainTrend(selectedStock)}
                    disabled={isGeneratingExplanation}
                    className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>{isGeneratingExplanation ? 'Analyzing...' : 'Explain This Trend'}</span>
                  </button>
                </div>
              </div>

              {/* Chart */}
              <div className="h-80 mb-6">
                <Line data={getChartData(selectedStock)} options={getChartOptions(selectedStock)} />
              </div>

              {/* AI Explanation */}
              {aiExplanation && (
                <div className={`rounded-lg p-4 ${
                  theme === 'dark' ? 'bg-gray-700 border border-gray-600' : 'bg-gray-50 border border-gray-200'
                }`}>
                  <h3 className={`font-semibold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    AI Market Analysis:
                  </h3>
                  <p className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                    {aiExplanation}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MarketData;