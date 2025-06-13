// Mock AI service - replace with actual OpenAI API integration
export class AIService {
  private static mockResponses = {
    developer: "I'm here to help with your development questions. What coding challenge can I assist you with today?",
    therapist: "I'm here to listen and support you. How are you feeling today, and what would you like to talk about?",
    finance: "Let's discuss your financial goals and strategies. What aspect of finance or investing interests you?",
    student: "I'm here to help with your studies. What subject or topic would you like to explore together?",
    custom: "I'm ready to assist with your custom request. How can I help you today?"
  };

  static async getChatResponse(message: string, role: string): Promise<string> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const baseResponse = this.mockResponses[role as keyof typeof this.mockResponses] || this.mockResponses.custom;
    
    // Simple response logic based on message content
    if (message.toLowerCase().includes('hello') || message.toLowerCase().includes('hi')) {
      return `Hello! ${baseResponse}`;
    }
    
    if (message.toLowerCase().includes('help')) {
      return `Of course! ${baseResponse} Please let me know what specific help you need.`;
    }
    
    return `Thank you for your message: "${message}". ${baseResponse}`;
  }

  static async prioritizeTasks(tasks: any[]): Promise<any[]> {
    // Simple priority algorithm
    return [...tasks].sort((a, b) => {
      const tagPriority = { 'Work': 4, 'Health': 3, 'Personal': 2, 'Trading': 1 };
      return (tagPriority[b.tag] || 0) - (tagPriority[a.tag] || 0);
    });
  }

  static async summarizeText(text: string): Promise<string> {
    const sentences = text.split('.').filter(s => s.trim().length > 0);
    const summary = sentences.slice(0, 3).join('. ') + '.';
    return summary || 'Unable to generate summary for this content.';
  }

  static async analyzeFile(content: string): Promise<any> {
    const words = content.split(/\s+/).filter(w => w.length > 0);
    const wordCount = words.length;
    
    // Simple sentiment analysis
    const positiveWords = ['good', 'great', 'excellent', 'amazing', 'wonderful', 'fantastic'];
    const negativeWords = ['bad', 'terrible', 'awful', 'horrible', 'worst', 'hate'];
    
    const positiveCount = words.filter(w => positiveWords.includes(w.toLowerCase())).length;
    const negativeCount = words.filter(w => negativeWords.includes(w.toLowerCase())).length;
    
    let sentiment: 'positive' | 'negative' | 'neutral' = 'neutral';
    if (positiveCount > negativeCount) sentiment = 'positive';
    else if (negativeCount > positiveCount) sentiment = 'negative';
    
    // Extract keywords (words longer than 4 characters, frequent ones)
    const wordFreq: { [key: string]: number } = {};
    words.forEach(word => {
      const cleanWord = word.toLowerCase().replace(/[^\w]/g, '');
      if (cleanWord.length > 4) {
        wordFreq[cleanWord] = (wordFreq[cleanWord] || 0) + 1;
      }
    });
    
    const keywords = Object.entries(wordFreq)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([word]) => word);
    
    return {
      summary: await this.summarizeText(content),
      sentiment,
      wordCount,
      keywords,
      insights: [
        `Document contains ${wordCount} words`,
        `Sentiment analysis: ${sentiment}`,
        `Top themes: ${keywords.slice(0, 3).join(', ')}`
      ]
    };
  }

  static async generateIdea(keyword: string): Promise<any> {
    const businessIdeas = [
      `AI-powered ${keyword} optimization platform`,
      `Sustainable ${keyword} marketplace`,
      `Social ${keyword} community app`,
      `${keyword} analytics dashboard`,
      `Mobile ${keyword} assistant`
    ];
    
    const domains = [
      `${keyword.toLowerCase()}.ai`,
      `smart${keyword.toLowerCase()}.com`,
      `${keyword.toLowerCase()}hub.io`,
      `next${keyword.toLowerCase()}.app`,
      `${keyword.toLowerCase()}pro.net`
    ];
    
    const competitors = [
      `${keyword}Corp`,
      `Smart${keyword}`,
      `${keyword}Labs`,
      `Future${keyword}`,
      `${keyword}Tech`
    ];
    
    const colorPalettes = [
      ['#667eea', '#764ba2', '#f093fb'],
      ['#4facfe', '#00f2fe', '#43e97b'],
      ['#fa709a', '#fee140', '#f093fb'],
      ['#a8edea', '#fed6e3', '#ffecd2'],
      ['#667eea', '#764ba2', '#f093fb']
    ];
    
    return {
      businessIdea: businessIdeas[Math.floor(Math.random() * businessIdeas.length)],
      domains,
      competitors,
      colorPalette: colorPalettes[Math.floor(Math.random() * colorPalettes.length)]
    };
  }
}