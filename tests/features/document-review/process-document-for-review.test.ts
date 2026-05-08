import { describe, expect, it, vi } from "vitest";
import { processDocumentForReview } from "@/features/document-review/process-document-for-review";

describe("processDocumentForReview", () => {
  it("returns success for a valid OCR result", async () => {
    const file = new File(["conteudo"], "nota.pdf", {
      type: "application/pdf",
    });

    const analyze = vi.fn().mockResolvedValue({
      extractedText: "texto ".repeat(80),
      pageCount: 1,
      lineCount: 20,
    });

    const result = await processDocumentForReview(file, {
      maxBytes: 5_000_000,
      ocrClient: { analyze },
    });

    expect(result.status).toBe("success");
    expect(result.fileName).toBe("nota.pdf");
  });
});
