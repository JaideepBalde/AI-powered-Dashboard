import React, { useState } from 'react';
import { Lightbulb, Sparkles, Globe, Users, Palette } from 'lucide-react';
import { IdeaResult } from '../types';
import { AIService } from '../services/aiService';

interface IdeaLabProps {
  theme: 'light' | 'dark';
}

const IdeaLab: React.FC<IdeaLabProps> = ({ theme }) => {
  const [keyword, setKeyword] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState<IdeaResult | null>(null);

  const generateIdea = async () => {
    if (!keyword.trim()) return;
    
    setIsGenerating(true);
    try {
      const ideaResult = await AIService.generateIdea(keyword.trim());
      setResult(ideaResult);
    } catch (error) {
      console.error('Error generating idea:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      alert('Copied to clipboard!');
    });
  };

  return (
    <div className={`h-full ${theme === 'dark' ? 'bg-gray-900' : 'bg-white'}`}>
      {/* Header */}
      <div className={`border-b p-6 ${theme === 'dark' ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-gray-50'}`}>
        <h2 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
          AI-Powered Idea Lab
        </h2>
        <p className={`mt-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
          Transform your keywords into business opportunities with AI intelligence
        </p>
      </div>

      <div className="p-6 overflow-y-auto" style={{ height: 'calc(100% - 120px)' }}>
        <div className="max-w-4xl mx-auto">
          {/* Input Section */}
          <div className={`rounded-lg border p-6 mb-6  ${
            theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
          }`}>
            <div className="flex items-center space-x-3 mb-4">
              <Lightbulb className="w-6 h-6 text-yellow-500" />
              <h3 className={`text-lg font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                Enter Your Keyword
              </h3>
            </div>
            
            <div className="flex space-x-4">
              <input
                type="text"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && generateIdea()}
                placeholder="e.g., fitness, education, sustainability..."
                className={`flex-1 px-4 py-3 rounded-lg border ${
                  theme === 'dark'
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                }`}
              />
              <button
                onClick={generateIdea}
                disabled={!keyword.trim() || isGenerating}
                className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                <Sparkles className="w-5 h-5" />
                <span>{isGenerating ? 'Generating...' : 'Generate Ideas'}</span>
              </button>
            </div>
          </div>

          {/* Loading State */}
          {isGenerating && (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-500 mx-auto mb-4"></div>
              <p className={`text-lg ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                AI is crafting your ideas...
              </p>
              <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                Analyzing market trends and opportunities
              </p>
            </div>
          )}

          {/* Results */}
          {result && !isGenerating && (
            <div className="space-y-6">
              {/* Business Idea */}
              <div className={`rounded-lg border p-6 ${
                theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
              }`}>
                <div className="flex items-center space-x-3 mb-4">
                  <Lightbulb className="w-6 h-6 text-yellow-500" />
                  <h3 className={`text-lg font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    Business Idea
                  </h3>
                </div>
                <div className={`rounded-lg p-4 ${
                  theme === 'dark' ? 'bg-gray-700 border border-gray-600' : 'bg-gray-50 border border-gray-200'
                }`}>
                  <p className={`text-lg ${theme === 'dark' ? 'text-gray-100' : 'text-gray-800'}`}>
                    {result.businessIdea}
                  </p>
                  <button
                    onClick={() => copyToClipboard(result.businessIdea)}
                    className={`mt-3 text-sm px-3 py-1 rounded ${
                      theme === 'dark'
                        ? 'bg-purple-900 text-purple-300 hover:bg-purple-800'
                        : 'bg-purple-100 text-purple-700 hover:bg-purple-200'
                    } transition-colors`}
                  >
                    Copy Idea
                  </button>
                </div>
              </div>

              {/* Domain Suggestions */}
              <div className={`rounded-lg border p-6 ${
                theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
              }`}>
                <div className="flex items-center space-x-3 mb-4">
                  <Globe className="w-6 h-6 text-blue-500" />
                  <h3 className={`text-lg font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    Domain Suggestions
                  </h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {result.domains.map((domain, index) => (
                    <div
                      key={index}
                      className={`rounded-lg p-3 cursor-pointer transition-all duration-200 ${
                        theme === 'dark'
                          ? 'bg-gray-700 border border-gray-600 hover:border-blue-500'
                          : 'bg-gray-50 border border-gray-200 hover:border-blue-300'
                      }`}
                      onClick={() => copyToClipboard(domain)}
                    >
                      <p className={`font-mono text-sm ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`}>
                        {domain}
                      </p>
                    </div>
                  ))}
                </div>
                <p className={`text-xs mt-3 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                  Click any domain to copy to clipboard
                </p>
              </div>

              {/* Competitors */}
              <div className={`rounded-lg border p-6 ${
                theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
              }`}>
                <div className="flex items-center space-x-3 mb-4">
                  <Users className="w-6 h-6 text-green-500" />
                  <h3 className={`text-lg font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    Potential Competitors
                  </h3>
                </div>
                <div className="flex flex-wrap gap-3">
                  {result.competitors.map((competitor, index) => (
                    <span
                      key={index}
                      className={`px-4 py-2 rounded-full text-sm cursor-pointer transition-all duration-200 ${
                        theme === 'dark'
                          ? 'bg-green-900 text-green-300 hover:bg-green-800'
                          : 'bg-green-100 text-green-700 hover:bg-green-200'
                      }`}
                      onClick={() => copyToClipboard(competitor)}
                    >
                      {competitor}
                    </span>
                  ))}
                </div>
              </div>

              {/* Color Palette */}
              <div className={`rounded-lg border p-6 ${
                theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
              }`}>
                <div className="flex items-center space-x-3 mb-4">
                  <Palette className="w-6 h-6 text-pink-500" />
                  <h3 className={`text-lg font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    Design Color Palette
                  </h3>
                </div>
                <div className="flex space-x-4">
                  {result.colorPalette.map((color, index) => (
                    <div
                      key={index}
                      className="flex flex-col items-center cursor-pointer group"
                      onClick={() => copyToClipboard(color)}
                    >
                      <div
                        className="w-16 h-16 rounded-lg shadow-lg group-hover:scale-110 transition-transform duration-200"
                        style={{ backgroundColor: color }}
                      ></div>
                      <span className={`text-xs mt-2 font-mono ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                        {color}
                      </span>
                    </div>
                  ))}
                </div>
                <p className={`text-xs mt-3 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                  Click any color to copy hex code
                </p>
              </div>

              {/* Generate Another */}
              <div className="text-center">
                <button
                  onClick={() => {
                    setResult(null);
                    setKeyword('');
                  }}
                  className={`px-6 py-3 rounded-lg transition-colors ${
                    theme === 'dark'
                      ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  Generate Another Idea
                </button>
              </div>
            </div>
          )}

          {/* Empty State */}
          {!result && !isGenerating && (
            <div className={`text-center py-12 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
              <Lightbulb className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p className="text-lg">Ready to spark innovation?</p>
              <p className="text-sm">Enter a keyword above to generate business ideas, domains, and more!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default IdeaLab;