"use client";

import { useState } from "react";
import type { ProcessDocumentResult } from "@/features/document-review/contracts";
import { DocumentResultPanel } from "@/features/document-review/components/document-result-panel";

type FormStatus = "idle" | "uploading" | "processing" | "success" | "error";

export function DocumentUploadForm() {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<FormStatus>("idle");
  const [result, setResult] = useState<ProcessDocumentResult | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!file) {
      setErrorMessage("Selecione um documento antes de continuar.");
      setStatus("error");
      return;
    }

    setErrorMessage(null);
    setResult(null);
    setStatus("uploading");

    const formData = new FormData();
    formData.set("file", file);

    setStatus("processing");

    const response = await fetch("/api/documents/process", {
      method: "POST",
      body: formData,
    });

    const body = await response.json();

    if (!response.ok) {
      setStatus("error");
      setErrorMessage(body.message);
      return;
    }

    setResult(body);
    setStatus("success");
  }

  return (
    <div className="review-shell">
      <form className="upload-panel" onSubmit={handleSubmit}>
        <div className="panel-heading">
          <p className="eyebrow">Pipeline documental</p>
          <h2>Envie o documento para leitura inicial</h2>
        </div>

        <label className="input-label" htmlFor="document">
          Documento
        </label>
        <input
          id="document"
          name="document"
          type="file"
          accept=".pdf,.png,.jpg,.jpeg"
          onChange={(event) => setFile(event.target.files?.[0] ?? null)}
        />

        <p className="support-copy">
          Envie um PDF, PNG ou JPG para extrair o texto do cartorio.
        </p>

        <button className="primary-action" type="submit">
          Processar documento
        </button>

        {status === "processing" ? (
          <p className="status-copy">Processando documento...</p>
        ) : null}

        {errorMessage ? <p className="error-banner">{errorMessage}</p> : null}
      </form>

      {result ? <DocumentResultPanel result={result} /> : null}
    </div>
  );
}
