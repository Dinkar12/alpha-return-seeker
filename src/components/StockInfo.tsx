
import React from "react";
import { ArrowUpIcon, ArrowDownIcon } from "lucide-react";
import { StockData, formatLargeNumber, formatPercentage } from "../utils/stockData";

interface StockInfoProps {
  stock: StockData;
}

const StockInfo: React.FC<StockInfoProps> = ({ stock }) => {
  const isPositive = stock.change >= 0;
  
  return (
    <div className="card-dashboard">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold">{stock.symbol}</h2>
          <p className="text-muted-foreground">{stock.name}</p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold">${stock.price.toFixed(2)}</div>
          <div className={`flex items-center justify-end ${isPositive ? "positive-value" : "negative-value"}`}>
            {isPositive ? (
              <ArrowUpIcon className="h-4 w-4 mr-1" />
            ) : (
              <ArrowDownIcon className="h-4 w-4 mr-1" />
            )}
            <span>{Math.abs(stock.change).toFixed(2)}</span>
            <span className="ml-1">({formatPercentage(stock.changePercent)})</span>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
        <div>
          <p className="text-xs text-muted-foreground">Market Cap</p>
          <p className="font-medium">{formatLargeNumber(stock.marketCap)}</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Volume</p>
          <p className="font-medium">{formatLargeNumber(stock.volume)}</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">P/E Ratio</p>
          <p className="font-medium">{stock.pe.toFixed(2)}</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">EPS</p>
          <p className="font-medium">${stock.eps.toFixed(2)}</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Dividend</p>
          <p className="font-medium">
            {stock.dividend ? `$${stock.dividend.toFixed(2)}` : 'N/A'}
          </p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Dividend Yield</p>
          <p className="font-medium">
            {stock.dividendYield ? `${(stock.dividendYield * 100).toFixed(2)}%` : 'N/A'}
          </p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Beta</p>
          <p className="font-medium">{stock.beta.toFixed(2)}</p>
        </div>
      </div>
    </div>
  );
};

export default StockInfo;
