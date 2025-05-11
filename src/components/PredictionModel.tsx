
import React, { useState, useEffect } from "react";
import { 
  ComposedChart, Line, Area, XAxis, YAxis, CartesianGrid, Tooltip, 
  Legend, ResponsiveContainer, ReferenceLine 
} from "recharts";
import { PredictionData, loadPredictionData } from "../utils/stockData";

interface PredictionModelProps {
  symbol: string;
}

const PredictionModel: React.FC<PredictionModelProps> = ({ symbol }) => {
  const [predictionData, setPredictionData] = useState<PredictionData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const fetchPredictionData = async () => {
      setIsLoading(true);
      try {
        const data = await loadPredictionData(symbol);
        setPredictionData(data);
      } catch (error) {
        console.error(`Failed to load prediction data for ${symbol}:`, error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchPredictionData();
  }, [symbol]);
  
  // Find index where actual data ends and predictions begin
  const actualDataEndIndex = predictionData.findIndex(item => item.actual === undefined);
  const dateDivider = actualDataEndIndex !== -1 ? predictionData[actualDataEndIndex]?.date : null;
  
  // Calculate prediction metrics
  const lastActualPrice = predictionData[actualDataEndIndex - 1]?.actual || 0;
  const lastPredictedPrice = predictionData[predictionData.length - 1]?.predicted || 0;
  const priceChange = lastPredictedPrice - lastActualPrice;
  const percentChange = lastActualPrice ? (priceChange / lastActualPrice) * 100 : 0;
  
  // Format dates for x-axis
  const formatXAxis = (tickItem: string) => {
    const date = new Date(tickItem);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };
  
  if (isLoading) {
    return (
      <div className="card-dashboard h-[430px] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
        <span className="ml-2 text-sm text-muted-foreground">Loading prediction data...</span>
      </div>
    );
  }
  
  if (!predictionData.length) {
    return (
      <div className="card-dashboard h-[430px] flex items-center justify-center">
        <p className="text-muted-foreground">No prediction data available for {symbol}</p>
      </div>
    );
  }
  
  return (
    <div className="card-dashboard">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Price Prediction Model</h2>
        <div className="text-sm">
          <span className={percentChange >= 0 ? "positive-value" : "negative-value"}>
            {percentChange >= 0 ? '▲' : '▼'} {Math.abs(percentChange).toFixed(2)}%
          </span>
          <span className="text-muted-foreground ml-1">30-day forecast</span>
        </div>
      </div>
      
      <div className="h-[350px]">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={predictionData}
            margin={{
              top: 10,
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
              tickFormatter={(value) => `$${value.toFixed(0)}`}
              domain={['auto', 'auto']}
              tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
            />
            <Tooltip
              labelFormatter={(label) => new Date(label).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
              })}
              formatter={(value, name) => {
                if (typeof value === 'number') {
                  return [`$${value.toFixed(2)}`, name];
                }
                return [value, name];
              }}
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                borderColor: 'hsl(var(--border))',
                color: 'hsl(var(--card-foreground))',
              }}
            />
            <Legend />
            {dateDivider && (
              <ReferenceLine
                x={dateDivider}
                stroke="#f59e0b"
                label={{
                  value: "Today",
                  position: "insideTopLeft",
                  fill: "#f59e0b",
                  fontSize: 12
                }}
              />
            )}
            <Area
              type="monotone"
              dataKey="upperBound"
              fill="rgba(59, 130, 246, 0.1)"
              stroke="rgba(59, 130, 246, 0)"
              name="Uncertainty Range"
            />
            <Area
              type="monotone"
              dataKey="lowerBound"
              fill="rgba(59, 130, 246, 0)"
              stroke="rgba(59, 130, 246, 0)"
              name="Uncertainty Range"
            />
            <Line
              type="monotone"
              dataKey="actual"
              stroke="#22c55e"
              strokeWidth={2}
              name="Actual Price"
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="predicted"
              stroke="#3b82f6"
              strokeWidth={2}
              name="Predicted Price"
              dot={false}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
      
      <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-4">
        <div className="bg-secondary rounded-md p-3">
          <div className="text-xs text-muted-foreground">Model Confidence</div>
          <div className="text-lg font-medium">{(75 + Math.random() * 15).toFixed(1)}%</div>
        </div>
        <div className="bg-secondary rounded-md p-3">
          <div className="text-xs text-muted-foreground">30-Day Forecast</div>
          <div className={`text-lg font-medium ${percentChange >= 0 ? "positive-value" : "negative-value"}`}>
            ${lastPredictedPrice.toFixed(2)}
          </div>
        </div>
        <div className="bg-secondary rounded-md p-3 col-span-2 md:col-span-1">
          <div className="text-xs text-muted-foreground">Analysis Summary</div>
          <div className="text-sm mt-1">
            {percentChange > 5 ? (
              "Strong bullish trend expected"
            ) : percentChange > 0 ? (
              "Moderate upward movement likely"
            ) : percentChange > -5 ? (
              "Slight bearish trend expected"
            ) : (
              "Strong downward pressure predicted"
            )}
          </div>
        </div>
      </div>
      
      <div className="mt-6 text-xs text-muted-foreground">
        <p>This model uses data from CSV files. In a real application, machine learning algorithms would analyze fundamental metrics, technical indicators, and market sentiment to generate these predictions.</p>
      </div>
    </div>
  );
};

export default PredictionModel;
