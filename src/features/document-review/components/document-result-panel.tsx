import type { ProcessDocumentResult } from "@/features/document-review/contracts";

export function DocumentResultPanel({
  result,
}: {
  result: ProcessDocumentResult;
}) {
  return (
    <section className="result-panel" aria-live="polite">
      <div className="panel-heading">
        <p className="eyebrow">Conferencia</p>
        <h2>Texto extraido</h2>
        <p className="result-meta">
          {result.fileName} · {result.fileType}
        </p>
      </div>
      {result.confidence.warning ? (
        <p className="warning-banner">{result.confidence.warning}</p>
      ) : null}
      <pre>{result.extractedText}</pre>
    </section>
  );
}
