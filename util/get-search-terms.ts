import * as fs from 'fs';
import * as Papa from 'papaparse';

export async function getSearchTermsFromCSV(filePath: string): Promise<string[]> {
  const csvData = fs.readFileSync(filePath, 'utf8');
  const results = Papa.parse(csvData, { header: true });
  return results.data.map((row: any) => row['searchTerm']); // Assuming the CSV column name is "searchTerm"
}