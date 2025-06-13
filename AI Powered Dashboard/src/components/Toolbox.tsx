import React, { useState, useEffect } from 'react';
import { Calculator, DollarSign, FileText, Timer, Play, Pause, Square, Save } from 'lucide-react';

interface ToolboxProps {
  theme: 'light' | 'dark';
}

const Toolbox: React.FC<ToolboxProps> = ({ theme }) => {
  const [activeTab, setActiveTab] = useState('currency');

  const tabs = [
    { id: 'currency', label: 'Currency', icon: DollarSign },
    { id: 'calculator', label: 'Calculator', icon: Calculator },
    { id: 'notes', label: 'Notes', icon: FileText },
    { id: 'timer', label: 'Timer', icon: Timer }
  ];

  return (
    <div className={`h-full ${theme === 'dark' ? 'bg-gray-900' : 'bg-white'}`}>
      {/* Header */}
      <div className={`border-b p-6 ${theme === 'dark' ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-gray-50'}`}>
        <h2 className={`text-2xl font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
          Productivity Toolbox
        </h2>
        
        {/* Tab Navigation */}
        <div className="flex flex-wrap gap-2">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                  : theme === 'dark'
                  ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="p-6 overflow-y-auto" style={{ height: 'calc(100% - 140px)' }}>
        {activeTab === 'currency' && <CurrencyConverter theme={theme} />}
        {activeTab === 'calculator' && <Calculator theme={theme} />}
        {activeTab === 'notes' && <NotePad theme={theme} />}
        {activeTab === 'timer' && <TimerStopwatch theme={theme} />}
      </div>
    </div>
  );
};

const CurrencyConverter: React.FC<{ theme: 'light' | 'dark' }> = ({ theme }) => {
  const [amount, setAmount] = useState('1');
  const [fromCurrency, setFromCurrency] = useState('USD');
  const [toCurrency, setToCurrency] = useState('INR');
  const [result, setResult] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const currencies = [
    { code: 'USD', name: 'US Dollar' },
    { code: 'EUR', name: 'Euro' },
    { code: 'GBP', name: 'British Pound' },
    { code: 'JPY', name: 'Japanese Yen' },
    { code: 'INR', name: 'Indian Rupee' },
    { code: 'CAD', name: 'Canadian Dollar' },
    { code: 'AUD', name: 'Australian Dollar' },
    { code: 'CNY', name: 'Chinese Yuan' }
  ];

  // Mock exchange rates
  const exchangeRates: { [key: string]: number } = {
    'USD-INR': 83.2,
    'EUR-USD': 1.08,
    'GBP-USD': 1.26,
    'JPY-USD': 0.0067,
    'CAD-USD': 0.74,
    'AUD-USD': 0.65,
    'CNY-USD': 0.14
  };

  const convertCurrency = async () => {
    setIsLoading(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    let rate = 1;
    
    if (fromCurrency === toCurrency) {
      rate = 1;
    } else {
      const directRate = exchangeRates[`${fromCurrency}-${toCurrency}`];
      const inverseRate = exchangeRates[`${toCurrency}-${fromCurrency}`];
      
      if (directRate) {
        rate = directRate;
      } else if (inverseRate) {
        rate = 1 / inverseRate;
      } else {
        // Convert through USD
        const fromToUsd = fromCurrency === 'USD' ? 1 : (exchangeRates[`${fromCurrency}-USD`] || 1);
        const usdToTarget = toCurrency === 'USD' ? 1 : (exchangeRates[`USD-${toCurrency}`] || 1);
        rate = fromToUsd * usdToTarget;
      }
    }
    
    setResult(parseFloat(amount) * rate);
    setIsLoading(false);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className={`rounded-lg border p-6 ${
        theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
      }`}>
        <h3 className={`text-lg font-semibold mb-6 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
          Currency Converter
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
              Amount
            </label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className={`w-full px-4 py-3 rounded-lg border ${
                theme === 'dark'
                  ? 'bg-gray-700 border-gray-600 text-white'
                  : 'bg-white border-gray-300 text-gray-900'
              }`}
              placeholder="Enter amount"
            />
          </div>
          
          <div>
            <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
              From Currency
            </label>
            <select
              value={fromCurrency}
              onChange={(e) => setFromCurrency(e.target.value)}
              className={`w-full px-4 py-3 rounded-lg border ${
                theme === 'dark'
                  ? 'bg-gray-700 border-gray-600 text-white'
                  : 'bg-white border-gray-300 text-gray-900'
              }`}
            >
              {currencies.map(currency => (
                <option key={currency.code} value={currency.code}>
                  {currency.code} - {currency.name}
                </option>
              ))}
            </select>
          </div>
        </div>
        
        <div className="mb-6">
          <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
            To Currency
          </label>
          <select
            value={toCurrency}
            onChange={(e) => setToCurrency(e.target.value)}
            className={`w-full px-4 py-3 rounded-lg border ${
              theme === 'dark'
                ? 'bg-gray-700 border-gray-600 text-white'
                : 'bg-white border-gray-300 text-gray-900'
            }`}
          >
            {currencies.map(currency => (
              <option key={currency.code} value={currency.code}>
                {currency.code} - {currency.name}
              </option>
            ))}
          </select>
        </div>
        
        <button
          onClick={convertCurrency}
          disabled={isLoading || !amount}
          className="w-full px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 mb-6"
        >
          {isLoading ? 'Converting...' : 'Convert Currency'}
        </button>
        
        {result !== null && (
          <div className={`rounded-lg p-4 text-center ${
            theme === 'dark' ? 'bg-gray-700 border border-gray-600' : 'bg-gray-50 border border-gray-200'
          }`}>
            <p className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              {parseFloat(amount).toLocaleString()} {fromCurrency} = {result.toLocaleString(undefined, { 
                minimumFractionDigits: 2, 
                maximumFractionDigits: 2 
              })} {toCurrency}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

const Calculator: React.FC<{ theme: 'light' | 'dark' }> = ({ theme }) => {
  const [display, setDisplay] = useState('0');
  const [previousValue, setPreviousValue] = useState<number | null>(null);
  const [operation, setOperation] = useState<string | null>(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);

  const inputNumber = (num: string) => {
    if (waitingForOperand) {
      setDisplay(String(num));
      setWaitingForOperand(false);
    } else {
      setDisplay(display === '0' ? String(num) : display + num);
    }
  };

  const inputOperation = (nextOperation: string) => {
    const inputValue = parseFloat(display);

    if (previousValue === null) {
      setPreviousValue(inputValue);
    } else if (operation) {
      const currentValue = previousValue || 0;
      const newValue = calculate(currentValue, inputValue, operation);

      setDisplay(String(newValue));
      setPreviousValue(newValue);
    }

    setWaitingForOperand(true);
    setOperation(nextOperation);
  };

  const calculate = (firstValue: number, secondValue: number, operation: string) => {
    switch (operation) {
      case '+':
        return firstValue + secondValue;
      case '-':
        return firstValue - secondValue;
      case '×':
        return firstValue * secondValue;
      case '÷':
        return firstValue / secondValue;
      default:
        return secondValue;
    }
  };

  const performCalculation = () => {
    const inputValue = parseFloat(display);

    if (previousValue !== null && operation) {
      const newValue = calculate(previousValue, inputValue, operation);
      setDisplay(String(newValue));
      setPreviousValue(null);
      setOperation(null);
      setWaitingForOperand(true);
    }
  };

  const clear = () => {
    setDisplay('0');
    setPreviousValue(null);
    setOperation(null);
    setWaitingForOperand(false);
  };

  const Button: React.FC<{ onClick: () => void; className?: string; children: React.ReactNode }> = ({ 
    onClick, 
    className = '', 
    children 
  }) => (
    <button
      onClick={onClick}
      className={`h-16 rounded-lg font-semibold text-lg transition-all duration-200 ${
        theme === 'dark'
          ? 'bg-gray-700 text-white hover:bg-gray-600'
          : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
      } ${className}`}
    >
      {children}
    </button>
  );

  return (
    <div className="max-w-md mx-auto">
      <div className={`rounded-lg border p-6 ${
        theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
      }`}>
        <h3 className={`text-lg font-semibold mb-6 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
          Calculator
        </h3>
        
        {/* Display */}
        <div className={`rounded-lg p-4 mb-4 text-right ${
          theme === 'dark' ? 'bg-gray-900 border border-gray-600' : 'bg-gray-50 border border-gray-200'
        }`}>
          <div className={`text-3xl font-mono ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            {display}
          </div>
        </div>
        
        {/* Buttons */}
        <div className="grid grid-cols-4 gap-3">
          <Button onClick={clear} className="col-span-2 bg-red-500 hover:bg-red-600 text-white">
            Clear
          </Button>
          <Button onClick={() => inputOperation('÷')} className="bg-orange-500 hover:bg-orange-600 text-white">
            ÷
          </Button>
          <Button onClick={() => inputOperation('×')} className="bg-orange-500 hover:bg-orange-600 text-white">
            ×
          </Button>
          
          <Button onClick={() => inputNumber('7')}>7</Button>
          <Button onClick={() => inputNumber('8')}>8</Button>
          <Button onClick={() => inputNumber('9')}>9</Button>
          <Button onClick={() => inputOperation('-')} className="bg-orange-500 hover:bg-orange-600 text-white">
            -
          </Button>
          
          <Button onClick={() => inputNumber('4')}>4</Button>
          <Button onClick={() => inputNumber('5')}>5</Button>
          <Button onClick={() => inputNumber('6')}>6</Button>
          <Button onClick={() => inputOperation('+')} className="bg-orange-500 hover:bg-orange-600 text-white">
            +
          </Button>
          
          <Button onClick={() => inputNumber('1')}>1</Button>
          <Button onClick={() => inputNumber('2')}>2</Button>
          <Button onClick={() => inputNumber('3')}>3</Button>
          <Button onClick={performCalculation} className="row-span-2 bg-blue-500 hover:bg-blue-600 text-white">
            =
          </Button>
          
          <Button onClick={() => inputNumber('0')} className="col-span-2">0</Button>
          <Button onClick={() => inputNumber('.')}>.</Button>
        </div>
      </div>
    </div>
  );
};

const NotePad: React.FC<{ theme: 'light' | 'dark' }> = ({ theme }) => {
  const [notes, setNotes] = useState(() => {
    const saved = localStorage.getItem('bolt-ai-notes');
    return saved || '';
  });

  const saveNotes = () => {
    localStorage.setItem('bolt-ai-notes', notes);
    
    const blob = new Blob([notes], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bolt-ai-notes-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  useEffect(() => {
    localStorage.setItem('bolt-ai-notes', notes);
  }, [notes]);

  return (
    <div className="max-w-4xl mx-auto">
      <div className={`rounded-lg border ${
        theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
      }`}>
        <div className={`flex items-center justify-between p-4 border-b ${
          theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
        }`}>
          <h3 className={`text-lg font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            Quick Notes
          </h3>
          <button
            onClick={saveNotes}
            className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-200"
          >
            <Save className="w-4 h-4" />
            <span>Save as .txt</span>
          </button>
        </div>
        
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Start typing your notes here..."
          className={`w-full h-96 p-4 resize-none focus:outline-none ${
            theme === 'dark'
              ? 'bg-gray-800 text-white placeholder-gray-400'
              : 'bg-white text-gray-900 placeholder-gray-500'
          }`}
        />
      </div>
    </div>
  );
};

const TimerStopwatch: React.FC<{ theme: 'light' | 'dark' }> = ({ theme }) => {
  const [mode, setMode] = useState<'timer' | 'stopwatch'>('timer');
  const [timeLeft, setTimeLeft] = useState(0);
  const [inputMinutes, setInputMinutes] = useState(5);
  const [isRunning, setIsRunning] = useState(false);
  const [stopwatchTime, setStopwatchTime] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isRunning) {
      interval = setInterval(() => {
        if (mode === 'timer') {
          setTimeLeft((time) => {
            if (time <= 1) {
              setIsRunning(false);
              // Play sound notification
              const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DvvmMeBC+H0OS5');
              audio.play().catch(() => {});
              return 0;
            }
            return time - 1;
          });
        } else {
          setStopwatchTime((time) => time + 1);
        }
      }, 1000);
    }
    
    return () => clearInterval(interval);
  }, [isRunning, mode]);

  const startTimer = () => {
    if (mode === 'timer' && timeLeft === 0) {
      setTimeLeft(inputMinutes * 60);
    }
    setIsRunning(true);
  };

  const pauseTimer = () => {
    setIsRunning(false);
  };

  const resetTimer = () => {
    setIsRunning(false);
    if (mode === 'timer') {
      setTimeLeft(0);
    } else {
      setStopwatchTime(0);
    }
  };

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hrs > 0) {
      return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="max-w-md mx-auto">
      <div className={`rounded-lg border p-6 ${
        theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
      }`}>
        {/* Mode Selector */}
        <div className="flex bg-gray-200 dark:bg-gray-700 rounded-lg p-1 mb-6">
          <button
            onClick={() => {
              setMode('timer');
              resetTimer();
            }}
            className={`flex-1 py-2 rounded-md text-sm font-medium transition-colors ${
              mode === 'timer'
                ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow'
                : 'text-gray-600 dark:text-gray-300'
            }`}
          >
            Timer
          </button>
          <button
            onClick={() => {
              setMode('stopwatch');
              resetTimer();
            }}
            className={`flex-1 py-2 rounded-md text-sm font-medium transition-colors ${
              mode === 'stopwatch'
                ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow'
                : 'text-gray-600 dark:text-gray-300'
            }`}
          >
            Stopwatch
          </button>
        </div>

        {/* Timer Setup */}
        {mode === 'timer' && !isRunning && timeLeft === 0 && (
          <div className="mb-6">
            <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
              Minutes
            </label>
            <input
              type="number"
              value={inputMinutes}
              onChange={(e) => setInputMinutes(Math.max(1, parseInt(e.target.value) || 1))}
              className={`w-full px-4 py-3 rounded-lg border ${
                theme === 'dark'
                  ? 'bg-gray-700 border-gray-600 text-white'
                  : 'bg-white border-gray-300 text-gray-900'
              }`}
              min="1"
            />
          </div>
        )}

        {/* Display */}
        <div className={`rounded-lg p-6 mb-6 text-center ${
          theme === 'dark' ? 'bg-gray-900 border border-gray-600' : 'bg-gray-50 border border-gray-200'
        }`}>
          <div className={`text-4xl font-mono font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            {formatTime(mode === 'timer' ? timeLeft : stopwatchTime)}
          </div>
        </div>

        {/* Controls */}
        <div className="flex justify-center space-x-4">
          {!isRunning ? (
            <button
              onClick={startTimer}
              className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg hover:from-green-600 hover:to-emerald-600 transition-all duration-200"
            >
              <Play className="w-5 h-5" />
              <span>Start</span>
            </button>
          ) : (
            <button
              onClick={pauseTimer}
              className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-lg hover:from-yellow-600 hover:to-orange-600 transition-all duration-200"
            >
              <Pause className="w-5 h-5" />
              <span>Pause</span>
            </button>
          )}
          
          <button
            onClick={resetTimer}
            className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-lg hover:from-red-600 hover:to-pink-600 transition-all duration-200"
          >
            <Square className="w-5 h-5" />
            <span>Reset</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Toolbox;