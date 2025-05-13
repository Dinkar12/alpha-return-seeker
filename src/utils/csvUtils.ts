
export interface CSVData {
  headers: string[];
  rows: Record<string, string>[];
}

export const parseCSV = async (filePath: string): Promise<CSVData> => {
  try {
    const response = await fetch(filePath);
    if (!response.ok) {
      throw new Error(`Failed to load CSV file: ${response.status}`);
    }
    
    const csvText = await response.text();
    return parseCSVText(csvText);
  } catch (error) {
    console.error("Error parsing CSV:", error);
    return { headers: [], rows: [] };
  }
};

export const parseCSVText = (csvText: string): CSVData => {
  const lines = csvText.split('\n').filter(line => line.trim() !== '');
  
  if (lines.length === 0) {
    return { headers: [], rows: [] };
  }
  
  const headers = lines[0].split(',').map(header => header.trim());
  
  const rows = lines.slice(1).map(line => {
    const values = line.split(',');
    const row: Record<string, string> = {};
    
    headers.forEach((header, index) => {
      row[header] = values[index]?.trim() || '';
    });
    
    return row;
  });
  
  return { headers, rows };
};

export const convertToNumber = (value: string): number => {
  if (!value || value === '') return 0;
  return parseFloat(value);
};

export const detectCSVFormat = (data: any[]): 'historical' | 'prediction' | 'unknown' => {
  if (!data.length) return 'unknown';
  
  const firstRow = data[0];
  
  // Check for historical data format
  const historicalFields = ['date', 'open', 'high', 'low', 'close', 'volume'];
  const isHistorical = historicalFields.every(field => field in firstRow);
  
  if (isHistorical) return 'historical';
  
  // Check for prediction data format
  const predictionFields = ['date', 'predicted', 'lowerBound', 'upperBound'];
  const isPrediction = predictionFields.every(field => field in firstRow);
  
  if (isPrediction) return 'prediction';
  
  return 'unknown';
};
