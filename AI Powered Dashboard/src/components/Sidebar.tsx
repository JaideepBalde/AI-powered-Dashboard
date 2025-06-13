import React from 'react';
import { 
  MessageCircle, 
  Calendar, 
  Newspaper, 
  TrendingUp, 
  FileText, 
  Wrench, 
  Lightbulb,
  Moon,
  Sun,
  Info
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  setShowAbout: (show: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  activeTab, 
  setActiveTab, 
  theme, 
  toggleTheme,
  setShowAbout 
}) => {
  const menuItems = [
    { id: 'chat', icon: MessageCircle, label: 'BoltCore AI' },
    { id: 'planner', icon: Calendar, label: 'Day Planner' },
    { id: 'news', icon: Newspaper, label: 'Live News' },
    { id: 'market', icon: TrendingUp, label: 'Market Data' },
    { id: 'files', icon: FileText, label: 'File Intelligence' },
    { id: 'toolbox', icon: Wrench, label: 'Toolbox' },
    { id: 'ideas', icon: Lightbulb, label: 'Idea Lab' }
  ];

  return (
    <div className={`w-64 h-screen fixed left-0 top-0 z-40 ${
      theme === 'dark' 
        ? 'bg-gradient-to-b from-gray-900 via-purple-900 to-gray-900 border-r border-purple-500/20' 
        : 'bg-gradient-to-b from-white via-purple-50 to-white border-r border-purple-200'
    } transition-colors duration-300`}>
      <div className="p-6">
        {/* Logo */}
        <div className="flex items-center space-x-3 mb-8">
          <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
            <MessageCircle className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              Bolt AI
            </h1>
            <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
              by Jaideep Balde
            </p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                activeTab === item.id
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                  : theme === 'dark'
                  ? 'text-gray-300 hover:bg-purple-800/30 hover:text-white'
                  : 'text-gray-600 hover:bg-purple-100 hover:text-purple-700'
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </nav>

        {/* Footer Actions */}
        <div className="absolute bottom-6 left-6 right-6 space-y-2">
          <button
            onClick={toggleTheme}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
              theme === 'dark'
                ? 'text-gray-300 hover:bg-purple-800/30 hover:text-white'
                : 'text-gray-600 hover:bg-purple-100 hover:text-purple-700'
            }`}
          >
            {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            <span className="font-medium">{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
          </button>
          
          <button
            onClick={() => setShowAbout(true)}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
              theme === 'dark'
                ? 'text-gray-300 hover:bg-purple-800/30 hover:text-white'
                : 'text-gray-600 hover:bg-purple-100 hover:text-purple-700'
            }`}
          >
            <Info className="w-5 h-5" />
            <span className="font-medium">About</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;