import type { OcrAnalysisResult } from "@/lib/ocr/ocr-client";

export function normalizeAzureAnalyzeResult(result: {
  pages?: Array<{ lines?: Array<{ content?: string }> }>;
}): OcrAnalysisResult {
  const lines =
    result.pages?.flatMap((page) =>
      (page.lines ?? []).map((line) => line.content ?? "").filter(Boolean),
    ) ?? [];

  return {
    extractedText: lines.join("\n"),
    pageCount: result.pages?.length ?? 0,
    lineCount: lines.length,
  };
}
