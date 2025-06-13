import React, { useState, useEffect } from 'react';
import { ExternalLink, MessageCircle, Eye } from 'lucide-react';
import { NewsArticle } from '../types';
import { NewsService } from '../services/newsService';
import { AIService } from '../services/aiService';

interface LiveNewsProps {
  theme: 'light' | 'dark';
}

const LiveNews: React.FC<LiveNewsProps> = ({ theme }) => {
  const [activeTab, setActiveTab] = useState('world');
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedArticle, setSelectedArticle] = useState<NewsArticle | null>(null);
  const [aiSummary, setAiSummary] = useState<string>('');
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);

  const tabs = [
    { id: 'world', label: 'World', color: 'from-blue-500 to-blue-600' },
    { id: 'finance', label: 'Finance', color: 'from-green-500 to-green-600' },
    { id: 'india', label: 'India', color: 'from-orange-500 to-orange-600' },
    { id: 'crypto', label: 'Crypto', color: 'from-yellow-500 to-yellow-600' },
    { id: 'tech', label: 'Tech', color: 'from-purple-500 to-purple-600' }
  ];

  useEffect(() => {
    loadNews(activeTab);
  }, [activeTab]);

  const loadNews = async (category: string) => {
    setLoading(true);
    try {
      const articles = await NewsService.getNews(category);
      setNews(articles);
    } catch (error) {
      console.error('Error loading news:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateSummary = async (article: NewsArticle) => {
    setIsGeneratingSummary(true);
    try {
      const summary = await AIService.summarizeText(article.description);
      setAiSummary(summary);
    } catch (error) {
      console.error('Error generating summary:', error);
      setAiSummary('Unable to generate summary at this time.');
    } finally {
      setIsGeneratingSummary(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className={`h-full ${theme === 'dark' ? 'bg-gray-900' : 'bg-white'}`}>
      {/* Header */}
      <div className={`border-b p-6 ${theme === 'dark' ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-gray-50'}`}>
        <h2 className={`text-2xl font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
          Live Global News
        </h2>
        
        {/* Tabs */}
        <div className="flex flex-wrap gap-2">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-full transition-all duration-200 ${
                activeTab === tab.id
                  ? `bg-gradient-to-r ${tab.color} text-white shadow-lg`
                  : theme === 'dark'
                  ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* News Content */}
      <div className="p-6 overflow-y-auto" style={{ height: 'calc(100% - 140px)' }}>
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {news.map((article, index) => (
              <div
                key={index}
                className={`rounded-lg border overflow-hidden transition-all duration-200 hover:shadow-lg ${
                  theme === 'dark'
                    ? 'bg-gray-800 border-gray-700 hover:border-purple-500/50'
                    : 'bg-white border-gray-200 hover:border-purple-300'
                }`}
              >
                {article.urlToImage && (
                  <img
                    src={article.urlToImage}
                    alt={article.title}
                    className="w-full h-48 object-cover"
                  />
                )}
                
                <div className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      theme === 'dark' ? 'bg-purple-900 text-purple-300' : 'bg-purple-100 text-purple-700'
                    }`}>
                      {article.source.name}
                    </span>
                    <span className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                      {formatDate(article.publishedAt)}
                    </span>
                  </div>
                  
                  <h3 className={`font-semibold mb-2 line-clamp-2 ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>
                    {article.title}
                  </h3>
                  
                  <p className={`text-sm mb-4 line-clamp-3 ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                  }`}>
                    {article.description}
                  </p>
                  
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setSelectedArticle(article)}
                      className={`flex items-center space-x-1 px-3 py-2 rounded-lg text-sm transition-colors ${
                        theme === 'dark'
                          ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      <Eye className="w-4 h-4" />
                      <span>Read More</span>
                    </button>
                    
                    <a
                      href={article.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-1 px-3 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg text-sm hover:from-purple-600 hover:to-pink-600 transition-all duration-200"
                    >
                      <ExternalLink className="w-4 h-4" />
                      <span>Source</span>
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Article Modal */}
      {selectedArticle && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className={`rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto ${
            theme === 'dark' ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
          }`}>
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <h2 className={`text-xl font-bold pr-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  {selectedArticle.title}
                </h2>
                <button
                  onClick={() => setSelectedArticle(null)}
                  className={`text-2xl ${theme === 'dark' ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-700'}`}
                >
                  ×
                </button>
              </div>
              
              {selectedArticle.urlToImage && (
                <img
                  src={selectedArticle.urlToImage}
                  alt={selectedArticle.title}
                  className="w-full h-64 object-cover rounded-lg mb-4"
                />
              )}
              
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <span className={`text-sm px-3 py-1 rounded-full ${
                    theme === 'dark' ? 'bg-purple-900 text-purple-300' : 'bg-purple-100 text-purple-700'
                  }`}>
                    {selectedArticle.source.name}
                  </span>
                  <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                    {formatDate(selectedArticle.publishedAt)}
                  </span>
                </div>
                
                <button
                  onClick={() => generateSummary(selectedArticle)}
                  disabled={isGeneratingSummary}
                  className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>{isGeneratingSummary ? 'Summarizing...' : 'Summarize with AI'}</span>
                </button>
              </div>
              
              <p className={`text-base mb-6 leading-relaxed ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                {selectedArticle.description}
              </p>
              
              {aiSummary && (
                <div className={`rounded-lg p-4 mb-4 ${
                  theme === 'dark' ? 'bg-gray-700 border border-gray-600' : 'bg-gray-50 border border-gray-200'
                }`}>
                  <h3 className={`font-semibold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    AI Summary:
                  </h3>
                  <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                    {aiSummary}
                  </p>
                </div>
              )}
              
              <div className="flex items-center justify-end space-x-4">
                <a
                  href={selectedArticle.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg hover:from-blue-600 hover:to-cyan-600 transition-all duration-200"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>Read Full Article</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LiveNews;