
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
    const lines = csvText.split('\n').filter(line => line.trim() !== '');
    const headers = lines[0].split(',');
    
    const rows = lines.slice(1).map(line => {
      const values = line.split(',');
      const row: Record<string, string> = {};
      
      headers.forEach((header, index) => {
        row[header] = values[index] || '';
      });
      
      return row;
    });
    
    return { headers, rows };
  } catch (error) {
    console.error("Error parsing CSV:", error);
    return { headers: [], rows: [] };
  }
};

export const convertToNumber = (value: string): number => {
  if (!value || value === '') return 0;
  return parseFloat(value);
};
