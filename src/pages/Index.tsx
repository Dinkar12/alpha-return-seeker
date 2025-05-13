
import { useState, useEffect } from "react";
import DashboardLayout from "../components/DashboardLayout";
import StockSearch from "../components/StockSearch";
import StockInfo from "../components/StockInfo";
import TechnicalChart from "../components/TechnicalChart";
import FundamentalMetrics from "../components/FundamentalMetrics";
import PredictionModel from "../components/PredictionModel";
import DatasetUploader from "../components/DatasetUploader";
import { loadStockData, StockData } from "../utils/stockData";
import { toast } from "@/components/ui/sonner";
import { ShieldAlert } from "lucide-react";

const Index = () => {
  const [selectedStock, setSelectedStock] = useState("AAPL");
  const [stocks, setStocks] = useState<Record<string, StockData>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  
  // Load stock data on component mount
  useEffect(() => {
    const fetchStockData = async () => {
      setIsLoading(true);
      try {
        const data = await loadStockData();
        setStocks(data);
      } catch (error) {
        console.error("Failed to load stock data:", error);
        toast.error("Failed to load stock data", {
          description: "Please try refreshing the page.",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchStockData();
  }, []);
  
  const handleStockSelect = (symbol: string) => {
    if (stocks[symbol]) {
      setSelectedStock(symbol);
      toast.success(`${symbol} selected`, {
        description: `Now viewing data for ${stocks[symbol].name}`,
      });
    } else {
      toast.error("Stock not found", {
        description: "The selected stock is not available in our data.",
      });
    }
  };
  
  const handleDatasetUploaded = () => {
    // Trigger a refresh of the charts
    setRefreshTrigger(prev => prev + 1);
  };
  
  const currentStock = stocks[selectedStock];
  
  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-[80vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading stock data...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }
  
  return (
    <DashboardLayout>
      <div className="bg-card border border-border rounded-md p-4 mb-6">
        <div className="flex items-center">
          <ShieldAlert className="h-5 w-5 text-amber-500 mr-2" />
          <div>
            <h2 className="text-sm font-medium">Disclaimer</h2>
            <p className="text-xs text-muted-foreground">
              This application uses sample data for demonstration purposes. Do not make investment decisions based on this information.
            </p>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-6">
        <div className="lg:col-span-1">
          <StockSearch stocks={stocks} onStockSelect={handleStockSelect} />
        </div>
        <div className="lg:col-span-3">
          {currentStock && <StockInfo stock={currentStock} />}
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="lg:col-span-1">
          <TechnicalChart symbol={selectedStock} key={`chart-${selectedStock}-${refreshTrigger}`} />
        </div>
        <div className="lg:col-span-1">
          {currentStock && <FundamentalMetrics stock={currentStock} />}
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-6">
        <div className="lg:col-span-3">
          <PredictionModel symbol={selectedStock} key={`prediction-${selectedStock}-${refreshTrigger}`} />
        </div>
        <div className="lg:col-span-1">
          <DatasetUploader symbol={selectedStock} onDatasetUploaded={handleDatasetUploaded} />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Index;
