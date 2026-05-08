import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { DocumentUploadForm } from "@/features/document-review/components/document-upload-form";

describe("DocumentUploadForm", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("uploads a file and renders extracted text", async () => {
    const user = userEvent.setup();

    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          fileName: "nota.pdf",
          fileType: "application/pdf",
          status: "success",
          extractedText: "Texto extraido do cartorio",
          confidence: { level: "high", warning: null },
        }),
      }),
    );

    render(<DocumentUploadForm />);

    const input = screen.getByLabelText(/documento/i);
    await user.upload(
      input,
      new File(["conteudo"], "nota.pdf", { type: "application/pdf" }),
    );

    await user.click(
      screen.getByRole("button", { name: /processar documento/i }),
    );

    await waitFor(() => {
      expect(screen.getByText(/texto extraido do cartorio/i)).toBeInTheDocument();
    });
  });
});
