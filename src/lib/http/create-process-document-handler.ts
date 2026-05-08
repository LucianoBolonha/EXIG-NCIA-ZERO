import {
  EmptyFileError,
  FileTooLargeError,
  OcrNoTextError,
  OcrProcessingError,
  UnsupportedFileTypeError,
} from "@/features/document-review/errors";
import { processDocumentForReview } from "@/features/document-review/process-document-for-review";
import type { OcrClient } from "@/lib/ocr/ocr-client";

export function createProcessDocumentHandler(deps: {
  maxBytes: number;
  ocrClient: OcrClient;
}) {
  return async function POST(request: Request) {
    try {
      const formData = await request.formData();
      const file = formData.get("file");

      if (!(file instanceof File)) {
        return Response.json(
          { message: "Envie um arquivo valido." },
          { status: 400 },
        );
      }

      const result = await processDocumentForReview(file, deps);

      return Response.json(result, { status: 200 });
    } catch (error) {
      if (
        error instanceof UnsupportedFileTypeError ||
        error instanceof EmptyFileError ||
        error instanceof FileTooLargeError
      ) {
        return Response.json({ message: error.message }, { status: 400 });
      }

      if (error instanceof OcrNoTextError) {
        return Response.json({ message: error.message }, { status: 422 });
      }

      if (error instanceof OcrProcessingError) {
        return Response.json(
          { message: "Falha ao processar o OCR. Tente novamente." },
          { status: 502 },
        );
      }

      return Response.json(
        { message: "Erro interno ao processar o documento." },
        { status: 500 },
      );
    }
  };
}
