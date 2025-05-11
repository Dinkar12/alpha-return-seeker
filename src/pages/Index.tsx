
import { useState } from "react";
import DashboardLayout from "../components/DashboardLayout";
import StockSearch from "../components/StockSearch";
import StockInfo from "../components/StockInfo";
import TechnicalChart from "../components/TechnicalChart";
import FundamentalMetrics from "../components/FundamentalMetrics";
import PredictionModel from "../components/PredictionModel";
import { mockStocks } from "../utils/mockData";
import { toast } from "@/components/ui/sonner";
import { ShieldAlert } from "lucide-react";

const Index = () => {
  const [selectedStock, setSelectedStock] = useState("AAPL");
  
  const handleStockSelect = (symbol: string) => {
    if (mockStocks[symbol]) {
      setSelectedStock(symbol);
      toast.success(`${symbol} selected`, {
        description: `Now viewing data for ${mockStocks[symbol].name}`,
      });
    } else {
      toast.error("Stock not found", {
        description: "The selected stock is not available in our demo data.",
      });
    }
  };
  
  const currentStock = mockStocks[selectedStock];
  
  return (
    <DashboardLayout>
      <div className="bg-card border border-border rounded-md p-4 mb-6">
        <div className="flex items-center">
          <ShieldAlert className="h-5 w-5 text-amber-500 mr-2" />
          <div>
            <h2 className="text-sm font-medium">Disclaimer</h2>
            <p className="text-xs text-muted-foreground">
              This is a demo application using simulated data. Do not make investment decisions based on this information.
            </p>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-6">
        <div className="lg:col-span-1">
          <StockSearch onStockSelect={handleStockSelect} />
        </div>
        <div className="lg:col-span-3">
          {currentStock && <StockInfo stock={currentStock} />}
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="lg:col-span-1">
          <TechnicalChart symbol={selectedStock} />
        </div>
        <div className="lg:col-span-1">
          {currentStock && <FundamentalMetrics stock={currentStock} />}
        </div>
      </div>
      
      <div className="mb-6">
        <PredictionModel symbol={selectedStock} />
      </div>
    </DashboardLayout>
  );
};

export default Index;
