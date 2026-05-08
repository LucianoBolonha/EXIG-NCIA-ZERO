import { describe, expect, it } from "vitest";
import { buildConfidenceSignal } from "@/lib/confidence/build-confidence-signal";

describe("buildConfidenceSignal", () => {
  it("marks high confidence when text is long enough", () => {
    const result = buildConfidenceSignal({
      extractedText: "texto ".repeat(80),
      pageCount: 2,
      lineCount: 40,
    });

    expect(result.level).toBe("high");
  });

  it("marks low confidence when extracted text is empty", () => {
    const result = buildConfidenceSignal({
      extractedText: "",
      pageCount: 1,
      lineCount: 0,
    });

    expect(result.level).toBe("low");
    expect(result.warning).toMatch(/baixa confianca/i);
  });
});
