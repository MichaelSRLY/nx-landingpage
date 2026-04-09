import Papa from 'papaparse';

export interface ParsedFile {
  content: string;
  type: 'csv' | 'txt' | 'pdf';
  preview: { rows: number; columns: number; headers: string[] } | null;
}

export function parseFile(file: File): Promise<ParsedFile> {
  return new Promise((resolve, reject) => {
    const ext = file.name.split('.').pop()?.toLowerCase();

    if (ext === 'csv' || ext === 'tsv') {
      Papa.parse(file, {
        header: true,
        dynamicTyping: true,
        skipEmptyLines: true,
        complete: (result) => {
          const headers = result.meta.fields || [];
          // Convert back to CSV string for the API
          const csvString = Papa.unparse(result.data as Record<string, unknown>[]);
          resolve({
            content: csvString,
            type: 'csv',
            preview: {
              rows: (result.data as unknown[]).length,
              columns: headers.length,
              headers,
            },
          });
        },
        error: (err) => reject(new Error(`CSV parse error: ${err.message}`)),
      });
    } else if (ext === 'json') {
      const reader = new FileReader();
      reader.onload = () => {
        const text = reader.result as string;
        try {
          const data = JSON.parse(text);
          const arr = Array.isArray(data) ? data : [data];
          const csvString = Papa.unparse(arr);
          const headers = arr.length > 0 ? Object.keys(arr[0]) : [];
          resolve({
            content: csvString,
            type: 'csv',
            preview: { rows: arr.length, columns: headers.length, headers },
          });
        } catch {
          resolve({ content: text, type: 'txt', preview: null });
        }
      };
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsText(file);
    } else {
      // PDF, TXT, etc — send as raw text
      const reader = new FileReader();
      reader.onload = () => {
        const text = reader.result as string;
        const lines = text.split('\n').filter(Boolean);
        resolve({
          content: text,
          type: ext === 'pdf' ? 'pdf' : 'txt',
          preview: { rows: lines.length, columns: 0, headers: [] },
        });
      };
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsText(file);
    }
  });
}
