
import { parseCSV, convertToNumber } from './csvUtils';

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

// Top 10 stock symbols
export const popularStocks = [
  "AAPL", "MSFT", "GOOGL", "AMZN", "TSLA", "META", "NVDA", "JPM", "V", "WMT"
];

// Function to load stock data from CSV
export const loadStockData = async (): Promise<Record<string, StockData>> => {
  const stockData: Record<string, StockData> = {};
  
  try {
    const { rows } = await parseCSV('/data/stocks.csv');
    
    // Filter only the top 10 stocks
    const topStocks = rows.filter(row => popularStocks.includes(row.symbol));
    
    topStocks.forEach(row => {
      const stock: StockData = {
        symbol: row.symbol,
        name: row.name,
        price: convertToNumber(row.price),
        change: convertToNumber(row.change),
        changePercent: convertToNumber(row.changePercent),
        marketCap: convertToNumber(row.marketCap),
        volume: convertToNumber(row.volume),
        pe: convertToNumber(row.pe),
        eps: convertToNumber(row.eps),
        dividend: convertToNumber(row.dividend),
        dividendYield: convertToNumber(row.dividendYield),
        beta: convertToNumber(row.beta),
      };
      
      stockData[row.symbol] = stock;
    });
    
  } catch (error) {
    console.error("Error loading stock data:", error);
  }
  
  return stockData;
};

// Load historical data for a specific stock
export const loadHistoricalData = async (symbol: string, days = 90): Promise<HistoricalPrice[]> => {
  try {
    const { rows } = await parseCSV(`/data/historical/${symbol}.csv`);
    
    return rows.slice(0, days).map(row => ({
      date: row.date,
      open: convertToNumber(row.open),
      high: convertToNumber(row.high),
      low: convertToNumber(row.low),
      close: convertToNumber(row.close),
      volume: convertToNumber(row.volume),
    }));
  } catch (error) {
    console.error(`Error loading historical data for ${symbol}:`, error);
    return [];
  }
};

// Load prediction data for a specific stock
export const loadPredictionData = async (symbol: string): Promise<PredictionData[]> => {
  try {
    const response = await fetch(`/data/predictions/${symbol}.csv`);
    if (!response.ok) {
      throw new Error(`Failed to load prediction data for ${symbol}: ${response.status}`);
    }
    
    const { rows } = await parseCSV(`/data/predictions/${symbol}.csv`);
    
    return rows.map(row => ({
      date: row.date,
      actual: row.actual ? convertToNumber(row.actual) : undefined,
      predicted: convertToNumber(row.predicted),
      lowerBound: convertToNumber(row.lowerBound),
      upperBound: convertToNumber(row.upperBound),
    }));
  } catch (error) {
    console.error(`Error loading prediction data for ${symbol}:`, error);
    return [];
  }
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
