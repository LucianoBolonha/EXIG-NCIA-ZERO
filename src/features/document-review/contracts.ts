export type ConfidenceLevel = "high" | "low";

export interface ConfidenceSignal {
  level: ConfidenceLevel;
  warning: string | null;
}

export interface ProcessDocumentResult {
  fileName: string;
  fileType: string;
  status: "success" | "low_confidence";
  extractedText: string;
  confidence: ConfidenceSignal;
}
