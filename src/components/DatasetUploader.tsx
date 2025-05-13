
import React, { useState } from "react";
import { toast } from "@/components/ui/sonner";
import { Input } from "@/components/ui/input";
import { Upload, Database } from "lucide-react";
import { parseCSV } from "@/utils/csvUtils";
import { setCustomHistoricalData, setCustomPredictionData } from "@/utils/stockData";

interface DatasetUploaderProps {
  symbol: string;
  onDatasetUploaded: () => void;
}

const DatasetUploader: React.FC<DatasetUploaderProps> = ({ symbol, onDatasetUploaded }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [datasetType, setDatasetType] = useState<'historical' | 'prediction'>('historical');
  
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    setIsUploading(true);
    
    try {
      // Read the file as text
      const fileContent = await readFileAsText(file);
      
      // Parse the CSV content
      const parsedData = parseCSVString(fileContent);
      
      if (datasetType === 'historical') {
        // Process historical data
        if (isValidHistoricalData(parsedData)) {
          setCustomHistoricalData(symbol, parsedData);
          toast.success("Historical dataset uploaded successfully", {
            description: `${parsedData.length} data points loaded for ${symbol}`
          });
          onDatasetUploaded();
        } else {
          toast.error("Invalid historical data format", {
            description: "CSV must include date, open, high, low, close, and volume columns"
          });
        }
      } else {
        // Process prediction data
        if (isValidPredictionData(parsedData)) {
          setCustomPredictionData(symbol, parsedData);
          toast.success("Prediction dataset uploaded successfully", {
            description: `${parsedData.length} prediction points loaded for ${symbol}`
          });
          onDatasetUploaded();
        } else {
          toast.error("Invalid prediction data format", {
            description: "CSV must include date, actual/predicted, lowerBound, and upperBound columns"
          });
        }
      }
    } catch (error) {
      console.error("Error processing file:", error);
      toast.error("Failed to process file", {
        description: "Please check the file format and try again"
      });
    } finally {
      setIsUploading(false);
      // Reset the file input
      event.target.value = '';
    }
  };
  
  // Read file as text
  const readFileAsText = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          resolve(e.target.result as string);
        } else {
          reject(new Error("Failed to read file"));
        }
      };
      reader.onerror = () => reject(reader.error);
      reader.readAsText(file);
    });
  };
  
  // Parse CSV string
  const parseCSVString = (csvString: string) => {
    const lines = csvString.split('\n').filter(line => line.trim() !== '');
    const headers = lines[0].split(',').map(h => h.trim());
    
    const rows = lines.slice(1).map(line => {
      const values = line.split(',');
      const row: Record<string, string | number> = {};
      
      headers.forEach((header, index) => {
        // Convert numeric values
        const value = values[index]?.trim() || '';
        row[header] = isNaN(Number(value)) || value === '' ? value : Number(value);
      });
      
      return row;
    });
    
    return rows;
  };
  
  // Validate historical data format
  const isValidHistoricalData = (data: any[]) => {
    if (!data.length) return false;
    
    // Check if required fields exist
    const requiredFields = ['date', 'open', 'high', 'low', 'close', 'volume'];
    return requiredFields.every(field => field in data[0]);
  };
  
  // Validate prediction data format
  const isValidPredictionData = (data: any[]) => {
    if (!data.length) return false;
    
    // Check if required fields exist
    const requiredFields = ['date', 'predicted', 'lowerBound', 'upperBound'];
    return requiredFields.every(field => field in data[0]);
  };

  return (
    <div className="card-dashboard p-4">
      <h3 className="text-base font-medium mb-3 flex items-center">
        <Database className="h-4 w-4 mr-2 text-primary" />
        Upload Custom Dataset
      </h3>
      
      <div className="grid grid-cols-2 gap-4 mb-4">
        <button
          onClick={() => setDatasetType('historical')}
          className={`px-3 py-2 text-sm rounded-md ${
            datasetType === 'historical' 
              ? 'bg-primary text-primary-foreground' 
              : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
          }`}
        >
          Historical Data
        </button>
        <button
          onClick={() => setDatasetType('prediction')}
          className={`px-3 py-2 text-sm rounded-md ${
            datasetType === 'prediction' 
              ? 'bg-primary text-primary-foreground' 
              : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
          }`}
        >
          Prediction Data
        </button>
      </div>
      
      <div className="relative">
        <div className="flex items-center justify-center w-full">
          <label
            htmlFor="file-upload"
            className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-secondary/30 border-secondary hover:bg-secondary/20"
          >
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <Upload className="w-8 h-8 mb-3 text-primary" />
              <p className="mb-2 text-sm text-foreground">
                <span className="font-semibold">Click to upload</span> or drag and drop
              </p>
              <p className="text-xs text-muted-foreground">
                CSV file for {datasetType === 'historical' ? 'historical price data' : 'price predictions'}
              </p>
            </div>
            <Input
              id="file-upload"
              type="file"
              accept=".csv"
              className="hidden"
              onChange={handleFileUpload}
              disabled={isUploading}
            />
          </label>
        </div>
        {isUploading && (
          <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
          </div>
        )}
      </div>
      
      <div className="mt-4">
        <p className="text-xs text-muted-foreground">
          {datasetType === 'historical' ? (
            <>
              Upload CSV with columns: date, open, high, low, close, volume.
              <br />
              Example: 2025-04-11,185.23,187.67,184.89,187.45,59328000
            </>
          ) : (
            <>
              Upload CSV with columns: date, predicted, lowerBound, upperBound (optional: actual).
              <br />
              Example: 2025-04-12,188.76,186.89,190.63
            </>
          )}
        </p>
      </div>
    </div>
  );
};

export default DatasetUploader;
