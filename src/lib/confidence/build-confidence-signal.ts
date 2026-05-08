import type { ConfidenceSignal } from "@/features/document-review/contracts";

export function buildConfidenceSignal(input: {
  extractedText: string;
  pageCount: number;
  lineCount: number;
}): ConfidenceSignal {
  const normalizedLength = input.extractedText.trim().length;

  if (normalizedLength < 120 || input.lineCount < 3) {
    return {
      level: "low",
      warning:
        "Baixa confianca na leitura. Revise o texto extraido antes de prosseguir.",
    };
  }

  return {
    level: "high",
    warning: null,
  };
}
