import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import BoltCore from './components/BoltCore';
import DayPlanner from './components/DayPlanner';
import LiveNews from './components/LiveNews';
import MarketData from './components/MarketData';
import FileIntelligence from './components/FileIntelligence';
import Toolbox from './components/Toolbox';
import IdeaLab from './components/IdeaLab';
import AboutModal from './components/AboutModal';
import { useTheme } from './hooks/useTheme';
import { useLocalStorage } from './hooks/useLocalStorage';

function App() {
  const { theme, toggleTheme } = useTheme();
  const [activeTab, setActiveTab] = useLocalStorage('bolt-ai-active-tab', 'chat');
  const [showAbout, setShowAbout] = useState(false);

  const renderActiveComponent = () => {
    switch (activeTab) {
      case 'chat':
        return <BoltCore theme={theme} />;
      case 'planner':
        return <DayPlanner theme={theme} />;
      case 'news':
        return <LiveNews theme={theme} />;
      case 'market':
        return <MarketData theme={theme} />;
      case 'files':
        return <FileIntelligence theme={theme} />;
      case 'toolbox':
        return <Toolbox theme={theme} />;
      case 'ideas':
        return <IdeaLab theme={theme} />;
      default:
        return <BoltCore theme={theme} />;
    }
  };

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'} transition-colors duration-300`}>
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        theme={theme}
        toggleTheme={toggleTheme}
        setShowAbout={setShowAbout}
      />
      
      <main className="ml-64 h-screen">
        {renderActiveComponent()}
      </main>

      <AboutModal
        isOpen={showAbout}
        onClose={() => setShowAbout(false)}
        theme={theme}
      />

      {/* Footer */}
      <div className={`fixed bottom-4 right-4 text-xs ${
        theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
      }`}>
        © 2025 Bolt AI by Jaideep Balde
      </div>
    </div>
  );
}

export default App;