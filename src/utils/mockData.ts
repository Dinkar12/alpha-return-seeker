
// Mock stock data for demonstration purposes

export interface StockData {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  marketCap: number;
  volume: number;
  pe: number;
  eps: number;
  dividend: number;
  dividendYield: number;
  beta: number;
}

export interface HistoricalPrice {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface PredictionData {
  date: string;
  actual?: number;
  predicted: number;
  lowerBound: number;
  upperBound: number;
}

// Popular stock symbols
export const popularStocks = [
  "AAPL", "MSFT", "GOOGL", "AMZN", "TSLA", "META", "NVDA", "JPM", "V", "WMT"
];

// Mock stock data
export const mockStocks: Record<string, StockData> = {
  "AAPL": {
    symbol: "AAPL",
    name: "Apple Inc.",
    price: 187.45,
    change: 1.23,
    changePercent: 0.66,
    marketCap: 2940000000000,
    volume: 59328000,
    pe: 30.8,
    eps: 6.08,
    dividend: 0.96,
    dividendYield: 0.51,
    beta: 1.28
  },
  "MSFT": {
    symbol: "MSFT",
    name: "Microsoft Corporation",
    price: 418.32,
    change: -2.15,
    changePercent: -0.51,
    marketCap: 3110000000000,
    volume: 21472000,
    pe: 35.9,
    eps: 11.65,
    dividend: 3.00,
    dividendYield: 0.72,
    beta: 0.95
  },
  "GOOGL": {
    symbol: "GOOGL",
    name: "Alphabet Inc.",
    price: 172.92,
    change: 0.87,
    changePercent: 0.51,
    marketCap: 2140000000000,
    volume: 19876000,
    pe: 26.4,
    eps: 6.55,
    dividend: 0,
    dividendYield: 0,
    beta: 1.06
  },
  "AMZN": {
    symbol: "AMZN",
    name: "Amazon.com, Inc.",
    price: 186.21,
    change: -0.43,
    changePercent: -0.23,
    marketCap: 1920000000000,
    volume: 35621000,
    pe: 52.3,
    eps: 3.56,
    dividend: 0,
    dividendYield: 0,
    beta: 1.22
  },
  "TSLA": {
    symbol: "TSLA",
    name: "Tesla, Inc.",
    price: 177.58,
    change: 4.32,
    changePercent: 2.49,
    marketCap: 565000000000,
    volume: 108532000,
    pe: 50.7,
    eps: 3.50,
    dividend: 0,
    dividendYield: 0,
    beta: 2.01
  }
};

// Generate mock historical data
export const generateHistoricalData = (symbol: string, days = 90): HistoricalPrice[] => {
  const data: HistoricalPrice[] = [];
  const currentStock = mockStocks[symbol];
  
  if (!currentStock) return data;
  
  let currentPrice = currentStock.price * 0.7; // Start at 70% of current price for a trend
  const volatility = currentStock.beta * 0.01;
  
  for (let i = days; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    
    // Simulate price movement with some randomness
    const dailyChange = (Math.random() - 0.5) * volatility * currentPrice;
    const open = currentPrice;
    const close = currentPrice + dailyChange;
    const high = Math.max(open, close) * (1 + Math.random() * 0.02);
    const low = Math.min(open, close) * (1 - Math.random() * 0.02);
    const volume = Math.floor(currentStock.volume * (0.5 + Math.random()));
    
    data.push({
      date: date.toISOString().split('T')[0],
      open,
      high,
      low,
      close,
      volume
    });
    
    currentPrice = close;
  }
  
  return data;
};

// Generate mock prediction data
export const generatePredictionData = (symbol: string, days = 30): PredictionData[] => {
  const historicalData = generateHistoricalData(symbol);
  const predictions: PredictionData[] = [];
  const currentStock = mockStocks[symbol];
  
  if (!historicalData.length || !currentStock) return predictions;
  
  // Use last 30 days as actual data
  const actualData = historicalData.slice(-30);
  
  // Create prediction data with upper and lower bounds
  for (let i = 0; i < actualData.length; i++) {
    const item = actualData[i];
    const errorMargin = currentStock.beta * 0.02 * item.close;
    
    predictions.push({
      date: item.date,
      actual: item.close,
      predicted: item.close * (1 + (Math.random() * 0.04 - 0.02)),
      lowerBound: item.close - errorMargin,
      upperBound: item.close + errorMargin
    });
  }
  
  // Add future predictions (no actual data)
  const lastPrice = actualData[actualData.length - 1].close;
  const growthTrend = currentStock.changePercent / 100;
  let predictedPrice = lastPrice;
  
  for (let i = 1; i <= days; i++) {
    const date = new Date();
    date.setDate(date.getDate() + i);
    
    // Apply growth trend with some noise
    predictedPrice = predictedPrice * (1 + growthTrend + (Math.random() * 0.02 - 0.01));
    const errorMargin = currentStock.beta * 0.04 * predictedPrice * Math.sqrt(i/10);
    
    predictions.push({
      date: date.toISOString().split('T')[0],
      predicted: predictedPrice,
      lowerBound: predictedPrice - errorMargin,
      upperBound: predictedPrice + errorMargin
    });
  }
  
  return predictions;
};

// Format large numbers to human-readable form
export const formatLargeNumber = (num: number): string => {
  if (num >= 1e12) {
    return (num / 1e12).toFixed(2) + "T";
  } else if (num >= 1e9) {
    return (num / 1e9).toFixed(2) + "B";
  } else if (num >= 1e6) {
    return (num / 1e6).toFixed(2) + "M";
  } else {
    return num.toLocaleString();
  }
};

// Format percentage values
export const formatPercentage = (value: number): string => {
  const formattedValue = value.toFixed(2) + "%";
  return value >= 0 ? "+" + formattedValue : formattedValue;
};
