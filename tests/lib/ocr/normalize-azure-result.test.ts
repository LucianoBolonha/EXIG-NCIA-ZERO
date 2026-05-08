import { describe, expect, it } from "vitest";
import { normalizeAzureAnalyzeResult } from "@/lib/ocr/normalize-azure-result";

describe("normalizeAzureAnalyzeResult", () => {
  it("joins line content into a single extracted text", () => {
    const result = normalizeAzureAnalyzeResult({
      pages: [{ lines: [{ content: "Linha 1" }, { content: "Linha 2" }] }],
    });

    expect(result.extractedText).toBe("Linha 1\nLinha 2");
    expect(result.lineCount).toBe(2);
  });
});
