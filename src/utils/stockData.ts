
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

// Storage for custom uploaded data
const customHistoricalData: Record<string, HistoricalPrice[]> = {};
const customPredictionData: Record<string, PredictionData[]> = {};

// Set custom historical data
export const setCustomHistoricalData = (symbol: string, data: any[]) => {
  const formattedData: HistoricalPrice[] = data.map(row => ({
    date: String(row.date),
    open: Number(row.open),
    high: Number(row.high),
    low: Number(row.low),
    close: Number(row.close),
    volume: Number(row.volume),
  }));
  
  // Sort data chronologically (oldest first)
  const sortedData = formattedData.sort((a, b) => 
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );
  
  customHistoricalData[symbol] = sortedData;
};

// Set custom prediction data
export const setCustomPredictionData = (symbol: string, data: any[]) => {
  const formattedData: PredictionData[] = data.map(row => ({
    date: String(row.date),
    actual: row.actual !== undefined ? Number(row.actual) : undefined,
    predicted: Number(row.predicted),
    lowerBound: Number(row.lowerBound),
    upperBound: Number(row.upperBound),
  }));
  
  // Sort data chronologically (oldest first)
  const sortedData = formattedData.sort((a, b) => 
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );
  
  customPredictionData[symbol] = sortedData;
};

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
  // Check if we have custom data for this symbol
  if (customHistoricalData[symbol]) {
    console.log(`Using custom historical data for ${symbol}:`, customHistoricalData[symbol]);
    return customHistoricalData[symbol].slice(0, days);
  }
  
  try {
    const { rows } = await parseCSV(`/data/historical/${symbol}.csv`);
    
    const validRows = rows
      .filter(row => row.date && row.close) // Ensure we have necessary data
      .slice(0, days)
      .map(row => ({
        date: row.date,
        open: convertToNumber(row.open),
        high: convertToNumber(row.high),
        low: convertToNumber(row.low),
        close: convertToNumber(row.close),
        volume: convertToNumber(row.volume),
      }));
    
    // Sort data chronologically (oldest first)
    const sortedData = validRows.sort((a, b) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );
      
    return sortedData;
  } catch (error) {
    console.error(`Error loading historical data for ${symbol}:`, error);
    return [];
  }
};

// Load prediction data for a specific stock
export const loadPredictionData = async (symbol: string): Promise<PredictionData[]> => {
  // Check if we have custom data for this symbol
  if (customPredictionData[symbol]) {
    console.log(`Using custom prediction data for ${symbol}:`, customPredictionData[symbol]);
    return customPredictionData[symbol];
  }
  
  try {
    const response = await fetch(`/data/predictions/${symbol}.csv`);
    if (!response.ok) {
      throw new Error(`Failed to load prediction data for ${symbol}: ${response.status}`);
    }
    
    const { rows } = await parseCSV(`/data/predictions/${symbol}.csv`);
    
    const validData = rows
      .filter(row => row.date && (row.predicted !== undefined)) // Ensure we have necessary data
      .map(row => ({
        date: row.date,
        actual: row.actual && row.actual !== 'undefined' ? convertToNumber(row.actual) : undefined,
        predicted: convertToNumber(row.predicted),
        lowerBound: convertToNumber(row.lowerBound),
        upperBound: convertToNumber(row.upperBound),
      }));
    
    // Sort data chronologically (oldest first)
    const sortedData = validData.sort((a, b) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );
    
    return sortedData;
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
