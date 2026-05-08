import { DocumentUploadForm } from "@/features/document-review/components/document-upload-form";

export function DocumentReviewPage() {
  return (
    <main className="document-review-page">
      <section className="hero-panel">
        <p className="eyebrow">Exigencia Zero</p>
        <h1>Analise sua nota devolutiva</h1>
        <p className="hero-copy">
          Envie um documento e confira o texto extraido antes da analise.
        </p>
      </section>

      <DocumentUploadForm />
    </main>
  );
}
