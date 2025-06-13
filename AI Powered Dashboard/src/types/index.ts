export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  collapsed?: boolean;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  tag: 'Work' | 'Personal' | 'Trading' | 'Health';
  priority: number;
  completed: boolean;
  date: string;
  time: string;
}

export interface NewsArticle {
  title: string;
  description: string;
  url: string;
  urlToImage: string;
  publishedAt: string;
  source: {
    name: string;
  };
}

export interface MarketData {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  data: number[];
}

export interface FileAnalysis {
  summary: string;
  sentiment: 'positive' | 'negative' | 'neutral';
  wordCount: number;
  keywords: string[];
  insights: string[];
}

export interface IdeaResult {
  businessIdea: string;
  domains: string[];
  competitors: string[];
  colorPalette: string[];
}