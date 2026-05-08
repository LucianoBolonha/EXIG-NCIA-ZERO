import { createProcessDocumentHandler } from "@/lib/http/create-process-document-handler";
import { AzureDocumentIntelligenceClient } from "@/lib/ocr/azure-document-intelligence-client";

const maxBytes = Number(process.env.MAX_UPLOAD_BYTES ?? "5000000");

export const POST = createProcessDocumentHandler({
  maxBytes,
  ocrClient: {
    async analyze(file) {
      return new AzureDocumentIntelligenceClient().analyze(file);
    },
  },
});
