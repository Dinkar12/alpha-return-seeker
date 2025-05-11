
import React from "react";
import { StockData, formatPercentage } from "../utils/mockData";

interface FundamentalMetricsProps {
  stock: StockData;
}

interface MetricItemProps {
  label: string;
  value: string | number;
  description?: string;
  className?: string;
}

const MetricItem: React.FC<MetricItemProps> = ({ label, value, description, className }) => {
  return (
    <div className={`p-3 bg-secondary rounded-md ${className}`}>
      <div className="text-xs text-muted-foreground mb-1">{label}</div>
      <div className="text-lg font-medium">{value}</div>
      {description && <div className="text-xs text-muted-foreground mt-1">{description}</div>}
    </div>
  );
};

const FundamentalMetrics: React.FC<FundamentalMetricsProps> = ({ stock }) => {
  // Create additional calculated metrics
  const priceToSales = Math.random() * 10 + 2;
  const priceToBook = Math.random() * 8 + 1;
  const debtToEquity = Math.random() * 0.8;
  const quickRatio = Math.random() * 2 + 0.5;
  const roe = Math.random() * 25;
  const grossMargin = 35 + Math.random() * 25;
  const operatingMargin = 15 + Math.random() * 20;
  
  return (
    <div className="card-dashboard">
      <h2 className="text-lg font-semibold mb-4">Fundamental Analysis</h2>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <MetricItem 
          label="P/E Ratio" 
          value={stock.pe.toFixed(2)} 
          description={stock.pe > 20 ? "Above industry average" : "Below industry average"}
          className={stock.pe > 25 ? "border border-gain" : ""}
        />
        
        <MetricItem 
          label="EPS" 
          value={`$${stock.eps.toFixed(2)}`} 
          description="Earnings Per Share"
        />
        
        <MetricItem 
          label="P/S Ratio" 
          value={priceToSales.toFixed(2)} 
          description="Price to Sales"
        />
        
        <MetricItem 
          label="P/B Ratio" 
          value={priceToBook.toFixed(2)} 
          description="Price to Book"
        />
        
        <MetricItem 
          label="Debt/Equity" 
          value={debtToEquity.toFixed(2)} 
          className={debtToEquity > 0.5 ? "border border-loss" : ""}
        />
        
        <MetricItem 
          label="Quick Ratio" 
          value={quickRatio.toFixed(2)} 
          className={quickRatio < 1.0 ? "border border-loss" : ""}
        />
        
        <MetricItem 
          label="ROE" 
          value={`${roe.toFixed(2)}%`} 
          description="Return on Equity"
          className={roe > 15 ? "border border-gain" : ""}
        />
        
        <MetricItem 
          label="Dividend Yield" 
          value={stock.dividendYield ? `${(stock.dividendYield * 100).toFixed(2)}%` : 'N/A'} 
        />
        
        <MetricItem 
          label="Gross Margin" 
          value={`${grossMargin.toFixed(2)}%`} 
          className={grossMargin > 40 ? "border border-gain" : ""}
        />
        
        <MetricItem 
          label="Operating Margin" 
          value={`${operatingMargin.toFixed(2)}%`} 
          className={operatingMargin > 20 ? "border border-gain" : ""}
        />
        
        <MetricItem 
          label="Beta" 
          value={stock.beta.toFixed(2)} 
          description={stock.beta > 1 ? "Higher volatility than market" : "Lower volatility than market"}
          className={stock.beta > 1.5 ? "border border-loss" : stock.beta < 0.8 ? "border border-gain" : ""}
        />
      </div>
      
      <div className="mt-4">
        <h3 className="text-sm font-medium mb-2">Fundamental Health Score</h3>
        <div className="w-full bg-secondary rounded-full h-2.5">
          <div 
            className="bg-primary h-2.5 rounded-full" 
            style={{ width: `${65 + Math.random() * 20}%` }}
          ></div>
        </div>
        <div className="flex justify-between mt-1 text-xs text-muted-foreground">
          <span>Poor</span>
          <span>Average</span>
          <span>Excellent</span>
        </div>
      </div>
    </div>
  );
};

export default FundamentalMetrics;
