import React from 'react';
import { X, Mail, Linkedin, Globe, Heart } from 'lucide-react';

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
  theme: 'light' | 'dark';
}

const AboutModal: React.FC<AboutModalProps> = ({ isOpen, onClose, theme }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className={`rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto ${
        theme === 'dark' ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
      }`}>
        <div className="p-6">
          {/* Header */}
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                <span className="text-2xl font-bold text-white">JB</span>
              </div>
              <div>
                <h2 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  About Bolt AI
                </h2>
                <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                  Created by Jaideep Balde
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className={`text-2xl ${theme === 'dark' ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-700'}`}
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Bio */}
          <div className={`rounded-lg p-6 mb-6 ${
            theme === 'dark' ? 'bg-gray-700 border border-gray-600' : 'bg-gray-50 border border-gray-200'
          }`}>
            <p className={`text-base leading-relaxed mb-4 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
              Hi, I'm <strong>Jaideep Balde</strong>, an engineering student passionate about combining technology, 
              finance, and AI to solve real-world problems.
            </p>
            <p className={`text-base leading-relaxed mb-4 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
              I created <strong>Bolt AI</strong> as a one-stop productivity and intelligence dashboard that integrates 
              the power of artificial intelligence with intuitive design. Whether you're a developer, trader, student, 
              or everyday user, Bolt AI is designed to help you organize, analyze, and act faster — all in one sleek, 
              responsive interface.
            </p>
            <p className={`text-base leading-relaxed ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
              🔍 My goal was simple: build something clean, smart, and useful — without relying on heavy frameworks 
              or backend dependencies. Just pure web tech that works instantly and beautifully across desktop and mobile.
            </p>
          </div>

          {/* Features */}
          <div className={`rounded-lg p-6 mb-6 ${
            theme === 'dark' ? 'bg-gray-700 border border-gray-600' : 'bg-gray-50 border border-gray-200'
          }`}>
            <h3 className={`text-lg font-semibold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              What Bolt AI Offers
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                  🧠 <strong>BoltCore AI</strong> - Multi-role chat assistant
                </div>
                <div className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                  🗓️ <strong>Smart Planner</strong> - AI-powered task management
                </div>
                <div className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                  📰 <strong>Live News</strong> - Global news with AI summaries
                </div>
                <div className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                  📈 <strong>Market Data</strong> - Real-time financial insights
                </div>
              </div>
              <div className="space-y-2">
                <div className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                  📂 <strong>File Intelligence</strong> - Document analysis
                </div>
                <div className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                  🔧 <strong>Toolbox</strong> - Productivity utilities
                </div>
                <div className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                  💡 <strong>Idea Lab</strong> - AI business idea generator
                </div>
                <div className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                  🎨 <strong>Modern UI</strong> - Dark/light themes
                </div>
              </div>
            </div>
          </div>

          {/* Contact */}
          <div className={`rounded-lg p-6 ${
            theme === 'dark' ? 'bg-gray-700 border border-gray-600' : 'bg-gray-50 border border-gray-200'
          }`}>
            <h3 className={`text-lg font-semibold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              Let's Connect
            </h3>
            <div className="space-y-3">
              <a
                href="mailto:jaydeepbalade15@gmail.com"
                className={`flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                  theme === 'dark'
                    ? 'hover:bg-gray-600 text-gray-300 hover:text-white'
                    : 'hover:bg-gray-200 text-gray-700 hover:text-gray-900'
                }`}
              >
                <Mail className="w-5 h-5 text-red-500" />
                <span>jaydeepbalade15@gmail.com</span>
              </a>
              
              <a
                href="https://linkedin.com/in/jaideep-balde-220a43204"
                target="_blank"
                rel="noopener noreferrer"
                className={`flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                  theme === 'dark'
                    ? 'hover:bg-gray-600 text-gray-300 hover:text-white'
                    : 'hover:bg-gray-200 text-gray-700 hover:text-gray-900'
                }`}
              >
                <Linkedin className="w-5 h-5 text-blue-500" />
                <span>linkedin.com/in/jaideep-balde-220a43204</span>
              </a>
              
              <a
                href="https://main-portfolio-jd.vercel.app"
                target="_blank"
                rel="noopener noreferrer"
                className={`flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                  theme === 'dark'
                    ? 'hover:bg-gray-600 text-gray-300 hover:text-white'
                    : 'hover:bg-gray-200 text-gray-700 hover:text-gray-900'
                }`}
              >
                <Globe className="w-5 h-5 text-green-500" />
                <span>main-portfolio-jd.vercel.app</span>
              </a>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center mt-6 pt-6 border-t border-gray-300 dark:border-gray-600">
            <p className={`text-sm flex items-center justify-center space-x-1 ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`}>
              <span>Made with</span>
              <Heart className="w-4 h-4 text-red-500" />
              <span>and</span>
              <span>💻</span>
              <span>by Jaideep Balde</span>
            </p>
            <p className={`text-xs mt-2 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
              © 2025 Bolt AI - All rights reserved
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutModal;