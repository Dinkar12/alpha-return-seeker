
import React, { useState } from "react";
import { Search } from "lucide-react";
import { popularStocks, mockStocks } from "../utils/mockData";

interface StockSearchProps {
  onStockSelect: (symbol: string) => void;
}

const StockSearch: React.FC<StockSearchProps> = ({ onStockSelect }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isInputFocused, setIsInputFocused] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim() && mockStocks[searchQuery.toUpperCase()]) {
      onStockSelect(searchQuery.toUpperCase());
      setSearchQuery("");
    }
  };

  const filteredStocks = searchQuery 
    ? Object.values(mockStocks).filter(stock => 
        stock.symbol.toUpperCase().includes(searchQuery.toUpperCase()) || 
        stock.name.toUpperCase().includes(searchQuery.toUpperCase())
      ).slice(0, 5)
    : [];

  return (
    <div className="w-full card-dashboard">
      <h2 className="text-lg font-semibold mb-4">Search Stocks</h2>
      <form onSubmit={handleSearch} className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={() => setIsInputFocused(true)}
          onBlur={() => setTimeout(() => setIsInputFocused(false), 200)}
          placeholder="Enter stock symbol or name..."
          className="w-full bg-secondary pl-9 pr-4 py-2 rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
        />
        {isInputFocused && filteredStocks.length > 0 && (
          <div className="absolute z-10 mt-1 w-full rounded-md bg-card border border-border shadow-lg">
            <ul className="py-1 max-h-60 overflow-auto">
              {filteredStocks.map((stock) => (
                <li 
                  key={stock.symbol}
                  onClick={() => {
                    onStockSelect(stock.symbol);
                    setSearchQuery("");
                  }}
                  className="px-3 py-2 hover:bg-secondary cursor-pointer flex justify-between"
                >
                  <div className="flex items-center">
                    <span className="font-medium">{stock.symbol}</span>
                    <span className="ml-2 text-muted-foreground text-sm">{stock.name}</span>
                  </div>
                  <span className={stock.change >= 0 ? "positive-value" : "negative-value"}>
                    ${stock.price.toFixed(2)}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </form>

      <div className="mt-6">
        <h3 className="text-sm font-medium text-muted-foreground mb-2">Popular Stocks</h3>
        <div className="flex flex-wrap gap-2">
          {popularStocks.slice(0, 8).map((symbol) => (
            <button
              key={symbol}
              onClick={() => onStockSelect(symbol)}
              className="px-3 py-1.5 bg-secondary hover:bg-secondary/80 rounded-md text-sm transition-colors"
            >
              {symbol}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StockSearch;
