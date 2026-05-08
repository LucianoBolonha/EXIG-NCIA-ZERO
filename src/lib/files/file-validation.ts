import {
  EmptyFileError,
  FileTooLargeError,
  UnsupportedFileTypeError,
} from "@/features/document-review/errors";

const SUPPORTED_TYPES = new Set([
  "application/pdf",
  "image/png",
  "image/jpeg",
]);

export function validateUploadedFile(
  file: File,
  options: { maxBytes: number },
) {
  if (!SUPPORTED_TYPES.has(file.type)) {
    throw new UnsupportedFileTypeError("Formato nao suportado.");
  }

  if (file.size === 0) {
    throw new EmptyFileError("Arquivo vazio.");
  }

  if (file.size > options.maxBytes) {
    throw new FileTooLargeError("Arquivo acima do limite permitido.");
  }
}
