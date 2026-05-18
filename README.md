# MyDesk

MyDesk V1 is a private, local-first executive execution assistant for one senior healthcare, RWE, medical affairs, oncology, business strategy, and product user.

The V1 product standard is intentionally high:

- Private library: upload reusable decks, proposals, offering documents, templates, references, and prior work.
- Learning engine: infer company offerings, scope language, PPT theme, color palette, slide structures, strategy patterns, and executive phrasing from supplied material.
- Command interface: user delegates the serious business task once; MyDesk asks only when material information is missing.
- Output generator: create polished decks, proposals, memos, briefs, PRDs, and action documents without generic AI language or unsupported claims.
- Preview and download: show the final reviewed output and provide local download buttons for Word, PowerPoint, and Markdown/Text where relevant.
- History: save local run history and generated outputs for reuse.
- Error and quality checks: fail clearly when OpenAI is not configured or quality gates fail; never substitute fake placeholder content.

Primary V1 experience:

```text
Delegate -> Generate polished output -> Preview -> Download
```

V1 exclusions:

- No auth.
- No payment.
- No team sharing.
- No cloud database.
- No email delivery.
- No exposed internal plan/draft/critique workflow.
- No placeholder or fake fallback generation.

If OpenAI is not configured, generation and revision return a hard error. Local run history is stored as project JSON, final Markdown outputs are saved under `outputs`, and Word/PowerPoint exports are rendered from saved versions on download.

The operating brain is implemented in `lib/ai/platformRules.ts`, `lib/ai/systemPrompt.ts`, `lib/ai/taskClassifier.ts`, and `lib/ai/ruleChecks.ts`. Runtime memory and error history live in `MEMORY.md` and `ERRORS.md`.

## Setup

```bash
npm install
cp .env.example .env
```

Add your OpenAI key to `.env`:

```bash
OPENAI_API_KEY=your_key_here
OPENAI_MODEL=gpt-4.1-mini
```

Run locally:

```bash
npm run dev
```

Open `http://localhost:3000`.

## Local Storage

- Projects are stored in `data/projects`.
- Uploads are stored in `uploads`.
- Generated outputs are stored in `outputs`.

## Pipeline

The app preserves clean internal generation boundaries so PPTX, DOCX, and future product capabilities can scale without exposing the mechanics to the user:

Command intake -> structured generation plan -> draft -> critique and improvement -> quality gate -> preview -> download

Revision commands run through the same review discipline and store a new version.

# Remy
