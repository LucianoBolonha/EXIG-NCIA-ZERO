# Document Pipeline Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Construir o primeiro slice web do Exigencia Zero para upload de `PDF`/`PNG`/`JPG`, processamento com Azure AI Document Intelligence e conferência do texto extraído.

**Architecture:** O projeto será um app `Next.js` full-stack com `App Router`, mantendo a UI, a rota HTTP e a lógica de domínio separadas. O OCR ficará atrás de um adapter isolado e injetável, permitindo testes sem dependência da Azure e futura extração para backend dedicado.

**Tech Stack:** `Next.js`, `React`, `TypeScript`, `ESLint`, `Vitest`, `Testing Library`, `@azure/ai-form-recognizer`, `AzureKeyCredential`

---

## File Structure

### New files

- `package.json` — scripts, dependências e metadados do app.
- `tsconfig.json` — configuração TypeScript com alias `@/*`.
- `next.config.ts` — configuração básica do Next.js.
- `next-env.d.ts` — tipos do Next.js.
- `eslint.config.mjs` — lint do projeto.
- `vitest.config.ts` — configuração do runner de testes.
- `vitest.setup.ts` — setup global do Testing Library.
- `src/app/layout.tsx` — layout raiz do app.
- `src/app/globals.css` — estilos globais.
- `src/app/page.tsx` — página principal do slice.
- `src/app/api/documents/process/route.ts` — rota de upload e processamento.
- `src/features/document-review/components/document-review-page.tsx` — container visual da página.
- `src/features/document-review/components/document-upload-form.tsx` — formulário client-side de upload.
- `src/features/document-review/components/document-result-panel.tsx` — painel de conferência do OCR.
- `src/features/document-review/contracts.ts` — tipos do domínio.
- `src/features/document-review/errors.ts` — erros do domínio.
- `src/features/document-review/process-document-for-review.ts` — caso de uso principal.
- `src/lib/files/file-validation.ts` — validação de tipo e tamanho.
- `src/lib/confidence/build-confidence-signal.ts` — heurística de baixa confiança.
- `src/lib/ocr/ocr-client.ts` — contrato do adapter de OCR.
- `src/lib/ocr/azure-document-intelligence-client.ts` — implementação Azure.
- `src/lib/ocr/normalize-azure-result.ts` — normalização da resposta da Azure.
- `src/lib/env.ts` — leitura e validação de variáveis de ambiente.
- `src/lib/http/create-process-document-handler.ts` — fábrica da rota com injeção de dependências.
- `.env.example` — variáveis necessárias para rodar localmente.
- `tests/app/home-page.test.tsx` — teste da página principal.
- `tests/lib/files/file-validation.test.ts` — testes de validação de arquivo.
- `tests/lib/confidence/build-confidence-signal.test.ts` — testes da heurística.
- `tests/lib/ocr/normalize-azure-result.test.ts` — testes de normalização.
- `tests/features/document-review/process-document-for-review.test.ts` — testes do caso de uso.
- `tests/app/api/process-document-route.test.ts` — testes da rota.
- `tests/features/document-review/document-upload-form.test.tsx` — testes da UI client-side.

### Modified files

- `.gitignore` — incluir artefatos do Next.js e cobertura, se faltar algo após o scaffold.
- `README.md` — instruções curtas para setup local do slice.

---

### Task 1: Bootstrap do app Next.js e harness de testes

**Files:**
- Create: `package.json`
- Create: `tsconfig.json`
- Create: `next.config.ts`
- Create: `next-env.d.ts`
- Create: `eslint.config.mjs`
- Create: `vitest.config.ts`
- Create: `vitest.setup.ts`
- Create: `src/app/layout.tsx`
- Create: `src/app/globals.css`
- Create: `src/app/page.tsx`
- Test: `tests/app/home-page.test.tsx`

- [ ] **Step 1: Write the failing test**

```tsx
import { render, screen } from "@testing-library/react";
import HomePage from "@/app/page";

describe("HomePage", () => {
  it("renders the upload flow shell", () => {
    render(<HomePage />);

    expect(
      screen.getByRole("heading", {
        name: /analise sua nota devolutiva/i,
      }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", { name: /selecionar documento/i }),
    ).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- tests/app/home-page.test.tsx`

Expected: FAIL com erro de módulo ausente, por exemplo `Cannot find module '@/app/page'`.

- [ ] **Step 3: Write minimal implementation**

Criar a base do projeto com este núcleo:

```json
{
  "name": "exigencia-zero",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "eslint .",
    "test": "vitest run"
  },
  "dependencies": {
    "@azure/ai-form-recognizer": "^5.1.0",
    "@azure/core-auth": "^1.9.0",
    "next": "^16.0.0",
    "react": "^19.0.0",
    "react-dom": "^19.0.0"
  },
  "devDependencies": {
    "@testing-library/jest-dom": "^6.6.3",
    "@testing-library/react": "^16.0.1",
    "@testing-library/user-event": "^14.5.2",
    "@types/node": "^22.10.1",
    "@types/react": "^19.0.2",
    "@types/react-dom": "^19.0.2",
    "@vitejs/plugin-react": "^4.3.4",
    "eslint": "^9.17.0",
    "eslint-config-next": "^16.0.0",
    "jsdom": "^25.0.1",
    "typescript": "^5.7.2",
    "vitest": "^2.1.8"
  }
}
```

```tsx
// src/app/page.tsx
export default function HomePage() {
  return (
    <main>
      <h1>Analise sua nota devolutiva</h1>
      <button type="button">Selecionar documento</button>
    </main>
  );
}
```

```tsx
// src/app/layout.tsx
import "./globals.css";
import type { ReactNode } from "react";

export default function RootLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
```

```ts
// vitest.config.ts
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "node:path";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    setupFiles: ["./vitest.setup.ts"],
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
```

```ts
// vitest.setup.ts
import "@testing-library/jest-dom/vitest";
```

Depois instalar dependências:

```bash
npm install
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- tests/app/home-page.test.tsx`

Expected: PASS com `1 passed`.

- [ ] **Step 5: Commit**

```bash
git add package.json tsconfig.json next.config.ts next-env.d.ts eslint.config.mjs vitest.config.ts vitest.setup.ts src/app/layout.tsx src/app/globals.css src/app/page.tsx tests/app/home-page.test.tsx
git commit -m "chore: bootstrap next app and test harness"
```

---

### Task 2: Regras puras de validação e confiança

**Files:**
- Create: `src/features/document-review/contracts.ts`
- Create: `src/features/document-review/errors.ts`
- Create: `src/lib/files/file-validation.ts`
- Create: `src/lib/confidence/build-confidence-signal.ts`
- Test: `tests/lib/files/file-validation.test.ts`
- Test: `tests/lib/confidence/build-confidence-signal.test.ts`

- [ ] **Step 1: Write the failing tests**

```ts
// tests/lib/files/file-validation.test.ts
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
```

```ts
// tests/lib/confidence/build-confidence-signal.test.ts
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
```

- [ ] **Step 2: Run tests to verify they fail**

Run:

```bash
npm test -- tests/lib/files/file-validation.test.ts tests/lib/confidence/build-confidence-signal.test.ts
```

Expected: FAIL com mensagens como `Cannot find module '@/lib/files/file-validation'`.

- [ ] **Step 3: Write minimal implementation**

```ts
// src/features/document-review/contracts.ts
export type ConfidenceLevel = "high" | "low";

export interface ConfidenceSignal {
  level: ConfidenceLevel;
  warning: string | null;
}

export interface ProcessDocumentResult {
  fileName: string;
  fileType: string;
  status: "success" | "low_confidence";
  extractedText: string;
  confidence: ConfidenceSignal;
}
```

```ts
// src/features/document-review/errors.ts
export class UnsupportedFileTypeError extends Error {}
export class EmptyFileError extends Error {}
export class FileTooLargeError extends Error {}
export class OcrProcessingError extends Error {}
export class OcrNoTextError extends Error {}
```

```ts
// src/lib/files/file-validation.ts
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
```

```ts
// src/lib/confidence/build-confidence-signal.ts
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
```

- [ ] **Step 4: Run tests to verify they pass**

Run:

```bash
npm test -- tests/lib/files/file-validation.test.ts tests/lib/confidence/build-confidence-signal.test.ts
```

Expected: PASS com `4 passed`.

- [ ] **Step 5: Commit**

```bash
git add src/features/document-review/contracts.ts src/features/document-review/errors.ts src/lib/files/file-validation.ts src/lib/confidence/build-confidence-signal.ts tests/lib/files/file-validation.test.ts tests/lib/confidence/build-confidence-signal.test.ts
git commit -m "feat: add file validation and confidence rules"
```

---

### Task 3: Adapter do Azure e caso de uso de processamento

**Files:**
- Create: `src/lib/ocr/ocr-client.ts`
- Create: `src/lib/ocr/normalize-azure-result.ts`
- Create: `src/lib/ocr/azure-document-intelligence-client.ts`
- Create: `src/lib/env.ts`
- Create: `src/features/document-review/process-document-for-review.ts`
- Create: `.env.example`
- Test: `tests/lib/ocr/normalize-azure-result.test.ts`
- Test: `tests/features/document-review/process-document-for-review.test.ts`

- [ ] **Step 1: Write the failing tests**

```ts
// tests/lib/ocr/normalize-azure-result.test.ts
import { describe, expect, it } from "vitest";
import { normalizeAzureAnalyzeResult } from "@/lib/ocr/normalize-azure-result";

describe("normalizeAzureAnalyzeResult", () => {
  it("joins line content into a single extracted text", () => {
    const result = normalizeAzureAnalyzeResult({
      pages: [{ lines: [{ content: "Linha 1" }, { content: "Linha 2" }] }],
    });

    expect(result.extractedText).toBe("Linha 1\nLinha 2");
    expect(result.lineCount).toBe(2);
  });
});
```

```ts
// tests/features/document-review/process-document-for-review.test.ts
import { describe, expect, it, vi } from "vitest";
import { processDocumentForReview } from "@/features/document-review/process-document-for-review";

describe("processDocumentForReview", () => {
  it("returns success for a valid OCR result", async () => {
    const file = new File(["conteudo"], "nota.pdf", {
      type: "application/pdf",
    });

    const analyze = vi.fn().mockResolvedValue({
      extractedText: "texto ".repeat(80),
      pageCount: 1,
      lineCount: 20,
    });

    const result = await processDocumentForReview(file, {
      maxBytes: 5_000_000,
      ocrClient: { analyze },
    });

    expect(result.status).toBe("success");
    expect(result.fileName).toBe("nota.pdf");
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run:

```bash
npm test -- tests/lib/ocr/normalize-azure-result.test.ts tests/features/document-review/process-document-for-review.test.ts
```

Expected: FAIL com módulos ausentes.

- [ ] **Step 3: Write minimal implementation**

```ts
// src/lib/ocr/ocr-client.ts
export interface OcrAnalysisResult {
  extractedText: string;
  pageCount: number;
  lineCount: number;
}

export interface OcrClient {
  analyze(file: File): Promise<OcrAnalysisResult>;
}
```

```ts
// src/lib/ocr/normalize-azure-result.ts
import type { OcrAnalysisResult } from "@/lib/ocr/ocr-client";

export function normalizeAzureAnalyzeResult(result: {
  pages?: Array<{ lines?: Array<{ content?: string }> }>;
}): OcrAnalysisResult {
  const lines =
    result.pages?.flatMap((page) =>
      (page.lines ?? []).map((line) => line.content ?? "").filter(Boolean),
    ) ?? [];

  return {
    extractedText: lines.join("\n"),
    pageCount: result.pages?.length ?? 0,
    lineCount: lines.length,
  };
}
```

```ts
// src/features/document-review/process-document-for-review.ts
import type { ProcessDocumentResult } from "@/features/document-review/contracts";
import { OcrNoTextError } from "@/features/document-review/errors";
import { buildConfidenceSignal } from "@/lib/confidence/build-confidence-signal";
import { validateUploadedFile } from "@/lib/files/file-validation";
import type { OcrClient } from "@/lib/ocr/ocr-client";

export async function processDocumentForReview(
  file: File,
  deps: {
    maxBytes: number;
    ocrClient: OcrClient;
  },
): Promise<ProcessDocumentResult> {
  validateUploadedFile(file, { maxBytes: deps.maxBytes });

  const ocrResult = await deps.ocrClient.analyze(file);

  if (!ocrResult.extractedText.trim()) {
    throw new OcrNoTextError("Nao foi possivel extrair texto utilizavel.");
  }

  const confidence = buildConfidenceSignal(ocrResult);

  return {
    fileName: file.name,
    fileType: file.type,
    status: confidence.level === "high" ? "success" : "low_confidence",
    extractedText: ocrResult.extractedText,
    confidence,
  };
}
```

```ts
// src/lib/env.ts
export function getRequiredEnv(name: string): string {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing required env var: ${name}`);
  }

  return value;
}
```

```ts
// src/lib/ocr/azure-document-intelligence-client.ts
import { AzureKeyCredential } from "@azure/core-auth";
import { DocumentAnalysisClient } from "@azure/ai-form-recognizer";
import { getRequiredEnv } from "@/lib/env";
import { normalizeAzureAnalyzeResult } from "@/lib/ocr/normalize-azure-result";
import type { OcrClient } from "@/lib/ocr/ocr-client";

export class AzureDocumentIntelligenceClient implements OcrClient {
  private client = new DocumentAnalysisClient(
    getRequiredEnv("AZURE_DOCUMENT_INTELLIGENCE_ENDPOINT"),
    new AzureKeyCredential(
      getRequiredEnv("AZURE_DOCUMENT_INTELLIGENCE_KEY"),
    ),
  );

  async analyze(file: File) {
    const arrayBuffer = await file.arrayBuffer();
    const poller = await this.client.beginAnalyzeDocument(
      "prebuilt-read",
      Buffer.from(arrayBuffer),
    );
    const result = await poller.pollUntilDone();

    return normalizeAzureAnalyzeResult(result);
  }
}
```

```env
# .env.example
AZURE_DOCUMENT_INTELLIGENCE_ENDPOINT=https://your-resource.cognitiveservices.azure.com/
AZURE_DOCUMENT_INTELLIGENCE_KEY=your-key
MAX_UPLOAD_BYTES=5000000
```

- [ ] **Step 4: Run tests to verify they pass**

Run:

```bash
npm test -- tests/lib/ocr/normalize-azure-result.test.ts tests/features/document-review/process-document-for-review.test.ts
```

Expected: PASS com `2 passed`.

- [ ] **Step 5: Commit**

```bash
git add src/lib/ocr/ocr-client.ts src/lib/ocr/normalize-azure-result.ts src/lib/ocr/azure-document-intelligence-client.ts src/lib/env.ts src/features/document-review/process-document-for-review.ts .env.example tests/lib/ocr/normalize-azure-result.test.ts tests/features/document-review/process-document-for-review.test.ts
git commit -m "feat: add azure ocr adapter and document processing use case"
```

---

### Task 4: Rota HTTP para upload e tratamento de erros

**Files:**
- Create: `src/lib/http/create-process-document-handler.ts`
- Create: `src/app/api/documents/process/route.ts`
- Test: `tests/app/api/process-document-route.test.ts`

- [ ] **Step 1: Write the failing test**

```ts
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

    const request = new Request("http://localhost/api/documents/process", {
      method: "POST",
      body: formData,
    });

    const response = await handler(request);
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.fileName).toBe("nota.pdf");
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- tests/app/api/process-document-route.test.ts`

Expected: FAIL com `Cannot find module '@/lib/http/create-process-document-handler'`.

- [ ] **Step 3: Write minimal implementation**

```ts
// src/lib/http/create-process-document-handler.ts
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
```

```ts
// src/app/api/documents/process/route.ts
import { AzureDocumentIntelligenceClient } from "@/lib/ocr/azure-document-intelligence-client";
import { createProcessDocumentHandler } from "@/lib/http/create-process-document-handler";

const maxBytes = Number(process.env.MAX_UPLOAD_BYTES ?? "5000000");

export const POST = createProcessDocumentHandler({
  maxBytes,
  ocrClient: new AzureDocumentIntelligenceClient(),
});
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- tests/app/api/process-document-route.test.ts`

Expected: PASS com `1 passed`.

- [ ] **Step 5: Commit**

```bash
git add src/lib/http/create-process-document-handler.ts src/app/api/documents/process/route.ts tests/app/api/process-document-route.test.ts
git commit -m "feat: add document processing route"
```

---

### Task 5: UI client-side do fluxo de upload e conferência

**Files:**
- Create: `src/features/document-review/components/document-review-page.tsx`
- Create: `src/features/document-review/components/document-upload-form.tsx`
- Create: `src/features/document-review/components/document-result-panel.tsx`
- Modify: `src/app/page.tsx`
- Test: `tests/features/document-review/document-upload-form.test.tsx`
- Test: `tests/app/home-page.test.tsx`

- [ ] **Step 1: Write the failing tests**

```tsx
// tests/features/document-review/document-upload-form.test.tsx
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { DocumentUploadForm } from "@/features/document-review/components/document-upload-form";

describe("DocumentUploadForm", () => {
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
```

```tsx
// tests/app/home-page.test.tsx
import { render, screen } from "@testing-library/react";
import HomePage from "@/app/page";

describe("HomePage", () => {
  it("renders upload instructions and submit action", () => {
    render(<HomePage />);

    expect(screen.getByText(/envie um pdf, png ou jpg/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /processar documento/i }),
    ).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run:

```bash
npm test -- tests/features/document-review/document-upload-form.test.tsx tests/app/home-page.test.tsx
```

Expected: FAIL porque o formulário e os textos ainda não existem.

- [ ] **Step 3: Write minimal implementation**

```tsx
// src/features/document-review/components/document-result-panel.tsx
import type { ProcessDocumentResult } from "@/features/document-review/contracts";

export function DocumentResultPanel({
  result,
}: {
  result: ProcessDocumentResult;
}) {
  return (
    <section>
      <h2>Texto extraido</h2>
      {result.confidence.warning ? <p>{result.confidence.warning}</p> : null}
      <pre>{result.extractedText}</pre>
    </section>
  );
}
```

```tsx
// src/features/document-review/components/document-upload-form.tsx
"use client";

import { useState } from "react";
import type { ProcessDocumentResult } from "@/features/document-review/contracts";
import { DocumentResultPanel } from "@/features/document-review/components/document-result-panel";

export function DocumentUploadForm() {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<
    "idle" | "uploading" | "processing" | "success" | "error"
  >("idle");
  const [result, setResult] = useState<ProcessDocumentResult | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!file) {
      setErrorMessage("Selecione um documento antes de continuar.");
      return;
    }

    setErrorMessage(null);
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
    <form onSubmit={handleSubmit}>
      <label htmlFor="document">Documento</label>
      <input
        id="document"
        name="document"
        type="file"
        accept=".pdf,.png,.jpg,.jpeg"
        onChange={(event) => setFile(event.target.files?.[0] ?? null)}
      />
      <p>Envie um PDF, PNG ou JPG para extrair o texto do cartorio.</p>
      <button type="submit">Processar documento</button>
      {status === "processing" ? <p>Processando documento...</p> : null}
      {errorMessage ? <p>{errorMessage}</p> : null}
      {result ? <DocumentResultPanel result={result} /> : null}
    </form>
  );
}
```

```tsx
// src/features/document-review/components/document-review-page.tsx
import { DocumentUploadForm } from "@/features/document-review/components/document-upload-form";

export function DocumentReviewPage() {
  return (
    <main>
      <h1>Analise sua nota devolutiva</h1>
      <p>Envie um documento e confira o texto extraido antes da analise.</p>
      <DocumentUploadForm />
    </main>
  );
}
```

```tsx
// src/app/page.tsx
import { DocumentReviewPage } from "@/features/document-review/components/document-review-page";

export default function HomePage() {
  return <DocumentReviewPage />;
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run:

```bash
npm test -- tests/features/document-review/document-upload-form.test.tsx tests/app/home-page.test.tsx
```

Expected: PASS com `2 passed`.

- [ ] **Step 5: Commit**

```bash
git add src/features/document-review/components/document-review-page.tsx src/features/document-review/components/document-upload-form.tsx src/features/document-review/components/document-result-panel.tsx src/app/page.tsx tests/features/document-review/document-upload-form.test.tsx tests/app/home-page.test.tsx
git commit -m "feat: add upload and review interface"
```

---

### Task 6: Fechamento do slice, ajustes de DX e verificação final

**Files:**
- Modify: `.gitignore`
- Modify: `README.md`
- Modify: `src/app/globals.css`
- Test: `tests/app/home-page.test.tsx`
- Test: `tests/app/api/process-document-route.test.ts`
- Test: `tests/features/document-review/process-document-for-review.test.ts`

- [ ] **Step 1: Write the failing test**

Adicionar um teste de regressão no arquivo da rota para garantir baixa confiança visível:

```ts
it("returns low_confidence payload when text is weak", async () => {
  const handler = createProcessDocumentHandler({
    maxBytes: 5_000_000,
    ocrClient: {
      analyze: vi.fn().mockResolvedValue({
        extractedText: "curto",
        pageCount: 1,
        lineCount: 1,
      }),
    },
  });

  const formData = new FormData();
  formData.set(
    "file",
    new File(["conteudo"], "nota.jpg", { type: "image/jpeg" }),
  );

  const response = await handler(
    new Request("http://localhost/api/documents/process", {
      method: "POST",
      body: formData,
    }),
  );
  const body = await response.json();

  expect(response.status).toBe(200);
  expect(body.status).toBe("low_confidence");
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- tests/app/api/process-document-route.test.ts`

Expected: FAIL até a rota refletir corretamente o status de baixa confiança.

- [ ] **Step 3: Write minimal implementation**

Garantir estes ajustes finais:

```md
# README.md

## Desenvolvimento local

1. Copie `.env.example` para `.env.local`
2. Preencha as credenciais da Azure
3. Instale dependencias com `npm install`
4. Rode `npm run dev`
5. Execute testes com `npm test`
```

```gitignore
.next/
coverage/
```

```css
/* src/app/globals.css */
:root {
  font-family: Arial, sans-serif;
  color: #1f2937;
  background: #f7f4ee;
}

body {
  margin: 0;
}

main {
  max-width: 900px;
  margin: 0 auto;
  padding: 48px 24px 80px;
}

form,
section {
  display: grid;
  gap: 16px;
}

pre {
  white-space: pre-wrap;
  border: 1px solid #d6d3d1;
  padding: 16px;
  border-radius: 12px;
  background: #fffdf8;
}
```

- [ ] **Step 4: Run tests to verify it passes**

Run:

```bash
npm test
npm run build
```

Expected:

- `npm test`: PASS com toda a suíte verde.
- `npm run build`: PASS com build de produção concluído sem erro.

- [ ] **Step 5: Commit**

```bash
git add .gitignore README.md src/app/globals.css tests/app/api/process-document-route.test.ts
git commit -m "chore: finalize first document pipeline slice"
```

---

## Self-Review

### Spec coverage

- Upload de `PDF`/`PNG`/`JPG`: coberto nas Tasks 2, 4 e 5.
- Azure AI Document Intelligence: coberto na Task 3.
- Tela de conferência do texto: coberta na Task 5.
- Estados de `idle`, `uploading`, `processing`, `success`, `error`: cobertos na Task 5.
- Baixa confiança: coberta nas Tasks 2, 3 e 6.
- Tratamento de erros principais: coberto na Task 4.
- Testes unitários, integração e UI: cobertos nas Tasks 1 a 6.

### Placeholder scan

- Nenhum `TBD`, `TODO` ou referência vaga foi deixado no plano.

### Type consistency

- `ProcessDocumentResult`, `OcrClient`, `buildConfidenceSignal`, `processDocumentForReview` e `createProcessDocumentHandler` usam nomes consistentes ao longo do plano.
