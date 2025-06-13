import { MarketData } from '../types';

export class MarketService {
  private static generateMockData(basePrice: number): number[] {
    const data = [];
    let price = basePrice;
    
    for (let i = 0; i < 30; i++) {
      const change = (Math.random() - 0.5) * 0.02 * price;
      price += change;
      data.push(Math.round(price * 100) / 100);
    }
    
    return data;
  }

  static async getMarketData(): Promise<MarketData[]> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const baseData = [
      { symbol: 'NIFTY50', name: 'Nifty 50', basePrice: 19500 },
      { symbol: 'SENSEX', name: 'BSE Sensex', basePrice: 65000 },
      { symbol: 'NASDAQ', name: 'NASDAQ', basePrice: 15000 },
      { symbol: 'DJI', name: 'Dow Jones', basePrice: 34000 },
      { symbol: 'USDINR', name: 'USD-INR', basePrice: 83.2 },
      { symbol: 'BTC', name: 'Bitcoin', basePrice: 42000 },
      { symbol: 'ETH', name: 'Ethereum', basePrice: 2500 }
    ];

    return baseData.map(item => {
      const data = this.generateMockData(item.basePrice);
      const currentPrice = data[data.length - 1];
      const previousPrice = data[data.length - 2];
      const change = currentPrice - previousPrice;
      const changePercent = (change / previousPrice) * 100;

      return {
        symbol: item.symbol,
        name: item.name,
        price: currentPrice,
        change,
        changePercent,
        data
      };
    });
  }
}