# React AI Practice Playground

An interactive React application for learning the fundamentals of large language
model (LLM) applications. Each lesson pairs a small working UI with an
explanation of the concept behind it, so the project can be used as a hands-on
frontend and AI study guide.

> This is an educational playground. It does not connect to a real AI provider:
> request and inference examples use local simulations in the browser.

## What you can explore

The navigation drawer and home page link to the following lessons:

- **AI Question Box** - demonstrates the asynchronous request lifecycle with
  loading, success, and error states.
- **Prompt Analyzer** - estimates token usage, tracks a 500-token budget, warns
  when a prompt reaches 80% of the budget, and prevents over-budget submission.
- **Inference Monitor** - simulates generation and measures the elapsed
  inference time with `performance.now()`.
- **Temperature Experiment** - visualizes temperature-based probability
  scaling, weighted token sampling, recent samples, and a 100-token frequency
  experiment.
- **AI Response Validator** - parses JSON and compares manual runtime
  validation with a Zod schema for a structured `Product` response.

The explanations shown beside each demo cover the relevant LLM concept, what
the demo does, the implementation principles, and the step-by-step behavior.

## Tech stack

- React 19 and TypeScript
- Vite
- Material UI (MUI)
- React Router
- Zod for runtime schema validation

## Getting started

### Prerequisites

- Node.js and npm

### Install dependencies

```bash
npm install
```

### Start the development server

```bash
npm run dev
```

Vite will print the local URL in the terminal. Open that URL in a browser and
select a lesson from the navigation drawer.

## Available scripts

| Command           | Purpose                                              |
| ----------------- | ---------------------------------------------------- |
| `npm run dev`     | Start the Vite development server                    |
| `npm run build`   | Type-check the project and create a production build |
| `npm run lint`    | Run ESLint                                           |
| `npm run preview` | Serve the production build locally                   |

## Project structure

```text
src/
├── components/
│   └── ConceptExplainer/       # Shared lesson layout and explanations
├── layout/
│   ├── AppLayout.tsx           # App bar, navigation drawer, and page shell
│   └── Drawer.tsx
├── pages/
│   ├── AIQuestionBox/          # Async request state demo
│   ├── AIResponseValidator/    # Manual and Zod response validation
│   ├── Home/                   # Lesson index
│   ├── InferenceMonitor/       # Inference latency demo
│   ├── PromptAnalyzer/         # Token budget demo
│   └── TemperatureExperiment/  # Probability sampling demo
├── routes.tsx                  # Route and navigation definitions
├── App.tsx                     # Router composition
└── main.tsx                    # React, MUI, and browser-router entry point
```

Lessons are intentionally self-contained. To add another concept, create a
page under `src/pages`, compose it with `ConceptLayout` and
`ConceptExplanation`, and add its route to `src/routes.tsx`.

## Design notes and limitations

- All state is local to the browser; there is no backend, authentication, or
  persistence layer.
- AI Question Box and Inference Monitor use delayed mock functions instead of
  network requests.
- Prompt token counts are estimates based on four characters per token, not
  counts from a model-specific tokenizer.
- Temperature sampling uses a small fixed probability distribution for
  visualization rather than a real model's logits.
- The response validator demonstrates JSON parsing and runtime checks, but it
  does not call an AI service or guarantee that a production API response is
  safe to use.

## Production build

Build the application with:

```bash
npm run build
```

The generated static assets are written to `dist/`. Preview the build locally
with:

```bash
npm run preview
```
