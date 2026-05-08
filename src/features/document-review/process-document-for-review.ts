import type { ProcessDocumentResult } from "@/features/document-review/contracts";
import { OcrNoTextError } from "@/features/document-review/errors";
import { buildConfidenceSignal } from "@/lib/confidence/build-confidence-signal";
import { validateUploadedFile } from "@/lib/files/file-validation";
import type { OcrClient } from "@/lib/ocr/ocr-client";

export async function processDocumentForReview(
  file: File,
  deps: {
    maxBytes: number;
    ocrClient: OcrClient;
  },
): Promise<ProcessDocumentResult> {
  validateUploadedFile(file, { maxBytes: deps.maxBytes });

  const ocrResult = await deps.ocrClient.analyze(file);

  if (!ocrResult.extractedText.trim()) {
    throw new OcrNoTextError("Nao foi possivel extrair texto utilizavel.");
  }

  const confidence = buildConfidenceSignal(ocrResult);

  return {
    fileName: file.name,
    fileType: file.type,
    status: confidence.level === "high" ? "success" : "low_confidence",
    extractedText: ocrResult.extractedText,
    confidence,
  };
}
