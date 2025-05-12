
import React, { useState, useEffect } from "react";
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, Legend, Area, AreaChart 
} from "recharts";
import { HistoricalPrice, loadHistoricalData } from "../utils/stockData";
import { AlertTriangle } from "lucide-react";

interface TechnicalChartProps {
  symbol: string;
}

type TimeRange = '1M' | '3M' | '6M' | '1Y' | 'All';

const TechnicalChart: React.FC<TechnicalChartProps> = ({ symbol }) => {
  const [timeRange, setTimeRange] = useState<TimeRange>('3M');
  const [showingMA, setShowingMA] = useState(true);
  const [historicalData, setHistoricalData] = useState<HistoricalPrice[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Define days for each time range
  const rangeDays = {
    '1M': 30,
    '3M': 90,
    '6M': 180,
    '1Y': 365,
    'All': 365 * 2
  };
  
  // Load historical data when symbol or timeRange changes
  useEffect(() => {
    const fetchHistoricalData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await loadHistoricalData(symbol, rangeDays[timeRange]);
        
        // Check if data is valid and complete
        if (data.length > 0 && data[0].date && data[0].close) {
          // Sort data to ensure chronological order (oldest first)
          const sortedData = [...data].sort((a, b) => 
            new Date(a.date).getTime() - new Date(b.date).getTime()
          );
          
          console.log(`Loaded ${sortedData.length} historical records for ${symbol}`, sortedData);
          setHistoricalData(sortedData);
          setError(null);
        } else {
          console.error(`Invalid or empty historical data for ${symbol}`);
          setHistoricalData([]);
          setError(`No valid historical data available for ${symbol}`);
        }
      } catch (error) {
        console.error(`Failed to load historical data for ${symbol}:`, error);
        setError(`Failed to load historical data for ${symbol}`);
        setHistoricalData([]);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchHistoricalData();
  }, [symbol, timeRange]);
  
  // Calculate moving averages
  const calculateMA = (data: HistoricalPrice[], period: number) => {
    return data.map((item, index) => {
      if (index < period - 1) {
        return {
          date: item.date,
          value: null
        };
      }
      
      let sum = 0;
      for (let i = 0; i < period; i++) {
        sum += data[index - i].close;
      }
      
      return {
        date: item.date,
        value: sum / period
      };
    });
  };
  
  const ma20Data = historicalData.length ? calculateMA(historicalData, 20) : [];
  const ma50Data = historicalData.length ? calculateMA(historicalData, 50) : [];
  
  // Custom tooltip formatter
  const formatTooltip = (value: number) => {
    return [`$${value.toFixed(2)}`, "Price"];
  };
  
  // Calculate min and max for y-axis domain
  const prices = historicalData.map(d => d.close);
  const minPrice = prices.length ? Math.min(...prices) * 0.95 : 0;
  const maxPrice = prices.length ? Math.max(...prices) * 1.05 : 0;
  
  // Format dates for x-axis
  const formatXAxis = (tickItem: string) => {
    const date = new Date(tickItem);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };
  
  if (isLoading) {
    return (
      <div className="card-dashboard h-[480px] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
        <span className="ml-2 text-sm text-muted-foreground">Loading chart data...</span>
      </div>
    );
  }
  
  if (error || !historicalData.length) {
    return (
      <div className="card-dashboard h-[480px] flex items-center justify-center flex-col">
        <AlertTriangle className="h-12 w-12 text-amber-500 mb-4" />
        <p className="text-muted-foreground">{error || `No historical data available for ${symbol}`}</p>
      </div>
    );
  }
  
  return (
    <div className="card-dashboard">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold">Price Chart</h2>
        <div className="flex space-x-2">
          {(['1M', '3M', '6M', '1Y', 'All'] as TimeRange[]).map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-3 py-1 text-xs rounded-md ${
                timeRange === range 
                  ? 'bg-primary text-primary-foreground' 
                  : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
              }`}
            >
              {range}
            </button>
          ))}
        </div>
      </div>
      
      <div className="h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={historicalData}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis 
              dataKey="date" 
              tickFormatter={formatXAxis}
              tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
            />
            <YAxis 
              domain={[minPrice, maxPrice]}
              tickFormatter={(value) => `$${value.toFixed(0)}`}
              tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
            />
            <Tooltip 
              formatter={formatTooltip} 
              labelFormatter={(label) => new Date(label).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
              })}
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                borderColor: 'hsl(var(--border))',
                color: 'hsl(var(--card-foreground))',
              }}
            />
            <Legend />
            <Area 
              type="monotone" 
              dataKey="close" 
              name="Price" 
              stroke="#3b82f6" 
              fill="rgba(59, 130, 246, 0.1)" 
              activeDot={{ r: 6 }} 
            />
            
            {showingMA && (
              <>
                <Line 
                  type="monotone" 
                  data={ma20Data} 
                  dataKey="value" 
                  name="MA20" 
                  stroke="#22c55e" 
                  dot={false}
                  strokeWidth={2}
                />
                <Line 
                  type="monotone" 
                  data={ma50Data} 
                  dataKey="value" 
                  name="MA50" 
                  stroke="#f59e0b" 
                  dot={false}
                  strokeWidth={2}
                />
              </>
            )}
          </AreaChart>
        </ResponsiveContainer>
      </div>
      
      <div className="mt-4 flex justify-between">
        <div className="flex items-center">
          <button
            onClick={() => setShowingMA(!showingMA)}
            className={`px-3 py-1 text-xs rounded-md ${
              showingMA ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'
            }`}
          >
            {showingMA ? 'Hide Moving Averages' : 'Show Moving Averages'}
          </button>
        </div>
        <div className="text-xs text-muted-foreground">
          Data is retrieved from CSV files
        </div>
      </div>
    </div>
  );
};

export default TechnicalChart;
