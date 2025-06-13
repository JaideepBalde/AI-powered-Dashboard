import { NewsArticle } from '../types';

export class NewsService {
  // Mock news data - replace with actual NewsAPI integration
  private static mockNews: { [key: string]: NewsArticle[] } = {
    world: [
      {
        title: "Global Economic Summit Addresses Climate Change",
        description: "World leaders gather to discuss economic implications of climate policies.",
        url: "https://example.com/news1",
        urlToImage: "https://images.pexels.com/photos/3183132/pexels-photo-3183132.jpeg",
        publishedAt: new Date().toISOString(),
        source: { name: "Global News" }
      },
      {
        title: "Technology Breakthrough in Renewable Energy",
        description: "Scientists announce major advancement in solar panel efficiency.",
        url: "https://example.com/news2",
        urlToImage: "https://images.pexels.com/photos/356036/pexels-photo-356036.jpeg",
        publishedAt: new Date(Date.now() - 3600000).toISOString(),
        source: { name: "Tech Today" }
      }
    ],
    finance: [
      {
        title: "Stock Markets Reach New Heights",
        description: "Major indices show strong performance amid positive economic data.",
        url: "https://example.com/finance1",
        urlToImage: "https://images.pexels.com/photos/590041/pexels-photo-590041.jpg",
        publishedAt: new Date().toISOString(),
        source: { name: "Finance Daily" }
      },
      {
        title: "Cryptocurrency Regulation Updates",
        description: "New guidelines released for digital asset trading platforms.",
        url: "https://example.com/finance2",
        urlToImage: "https://images.pexels.com/photos/844124/pexels-photo-844124.jpeg",
        publishedAt: new Date(Date.now() - 7200000).toISOString(),
        source: { name: "Crypto News" }
      }
    ],
    india: [
      {
        title: "India's Digital Infrastructure Expansion",
        description: "Government announces major investment in digital connectivity.",
        url: "https://example.com/india1",
        urlToImage: "https://images.pexels.com/photos/1098982/pexels-photo-1098982.jpeg",
        publishedAt: new Date().toISOString(),
        source: { name: "India Today" }
      }
    ],
    crypto: [
      {
        title: "Bitcoin Adoption Grows in Emerging Markets",
        description: "Developing countries show increased cryptocurrency usage.",
        url: "https://example.com/crypto1",
        urlToImage: "https://images.pexels.com/photos/844124/pexels-photo-844124.jpeg",
        publishedAt: new Date().toISOString(),
        source: { name: "Crypto Weekly" }
      }
    ],
    tech: [
      {
        title: "AI Revolution in Healthcare",
        description: "Machine learning models show promise in early disease detection.",
        url: "https://example.com/tech1",
        urlToImage: "https://images.pexels.com/photos/3183153/pexels-photo-3183153.jpeg",
        publishedAt: new Date().toISOString(),
        source: { name: "Tech Review" }
      }
    ]
  };

  static async getNews(category: string): Promise<NewsArticle[]> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return this.mockNews[category] || [];
  }
}