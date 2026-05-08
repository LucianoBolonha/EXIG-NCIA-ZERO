import { describe, expect, it } from "vitest";
import { validateUploadedFile } from "@/lib/files/file-validation";

describe("validateUploadedFile", () => {
  it("accepts supported pdf files", () => {
    const file = new File(["pdf"], "nota.pdf", { type: "application/pdf" });

    expect(() =>
      validateUploadedFile(file, { maxBytes: 5_000_000 }),
    ).not.toThrow();
  });

  it("rejects unsupported mime types", () => {
    const file = new File(["txt"], "nota.txt", { type: "text/plain" });

    expect(() =>
      validateUploadedFile(file, { maxBytes: 5_000_000 }),
    ).toThrowError(/formato nao suportado/i);
  });
});
