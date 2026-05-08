import { describe, expect, it, vi } from "vitest";
import { createProcessDocumentHandler } from "@/lib/http/create-process-document-handler";

describe("POST /api/documents/process", () => {
  it("returns 200 with normalized payload for a valid file", async () => {
    const handler = createProcessDocumentHandler({
      maxBytes: 5_000_000,
      ocrClient: {
        analyze: vi.fn().mockResolvedValue({
          extractedText: "texto ".repeat(80),
          pageCount: 1,
          lineCount: 20,
        }),
      },
    });

    const formData = new FormData();
    formData.set(
      "file",
      new File(["conteudo"], "nota.pdf", { type: "application/pdf" }),
    );

    const request = {
      formData: async () => formData,
    } as Request;

    const response = await handler(request);
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.fileName).toBe("nota.pdf");
  });
});
