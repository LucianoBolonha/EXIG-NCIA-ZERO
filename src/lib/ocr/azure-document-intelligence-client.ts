import { DocumentAnalysisClient } from "@azure/ai-form-recognizer";
import { AzureKeyCredential } from "@azure/core-auth";
import { getRequiredEnv } from "@/lib/env";
import { normalizeAzureAnalyzeResult } from "@/lib/ocr/normalize-azure-result";
import type { OcrClient } from "@/lib/ocr/ocr-client";

export class AzureDocumentIntelligenceClient implements OcrClient {
  private client = new DocumentAnalysisClient(
    getRequiredEnv("AZURE_DOCUMENT_INTELLIGENCE_ENDPOINT"),
    new AzureKeyCredential(getRequiredEnv("AZURE_DOCUMENT_INTELLIGENCE_KEY")),
  );

  async analyze(file: File) {
    const arrayBuffer = await file.arrayBuffer();
    const poller = await this.client.beginAnalyzeDocument(
      "prebuilt-read",
      Buffer.from(arrayBuffer),
    );
    const result = await poller.pollUntilDone();

    return normalizeAzureAnalyzeResult(result);
  }
}
