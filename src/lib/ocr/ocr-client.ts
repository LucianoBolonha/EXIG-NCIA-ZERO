export interface OcrAnalysisResult {
  extractedText: string;
  pageCount: number;
  lineCount: number;
}

export interface OcrClient {
  analyze(file: File): Promise<OcrAnalysisResult>;
}
