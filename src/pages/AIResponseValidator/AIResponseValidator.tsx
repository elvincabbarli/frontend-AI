import { useState } from "react";
import { z } from "zod";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import {
  ConceptLayout,
  ConceptExplanation,
} from "../../components/ConceptExplainer/ConceptExplainer";

type Product = {
  id: number;
  name: string;
  price: number;
  inStock: boolean;
};

function isProduct(data: unknown): data is Product {
  if (typeof data !== "object" || data === null) return false;
  const candidate = data as Record<string, unknown>;

  return (
    typeof candidate.id === "number" &&
    typeof candidate.name === "string" &&
    typeof candidate.price === "number" &&
    typeof candidate.inStock === "boolean"
  );
}

const productSchema = z.object({
  id: z.number(),
  name: z.string(),
  price: z.number(),
  inStock: z.boolean(),
});

type ValidationResult =
  | { status: "idle" }
  | { status: "valid"; product: Product }
  | { status: "invalid"; message: string };

const EXAMPLE_JSON = `{
  "id": 1,
  "name": "MacBook Pro",
  "price": 1999,
  "inStock": true
}`;

export default function AIResponseValidator() {
  const [jsonInput, setJsonInput] = useState(EXAMPLE_JSON);
  const [manualResult, setManualResult] = useState<ValidationResult>({
    status: "idle",
  });
  const [zodResult, setZodResult] = useState<ValidationResult>({
    status: "idle",
  });

  const parseInput = (): { data: unknown } | { error: string } => {
    try {
      return { data: JSON.parse(jsonInput) };
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Invalid JSON syntax";
      return { error: `JSON syntax error: ${message}` };
    }
  };

  const handleValidateManual = () => {
    const parsed = parseInput();
    if ("error" in parsed) {
      setManualResult({ status: "invalid", message: parsed.error });
      return;
    }

    if (isProduct(parsed.data)) {
      setManualResult({ status: "valid", product: parsed.data });
    } else {
      setManualResult({
        status: "invalid",
        message:
          "Data does not match the Product type (expected id: number, name: string, price: number, inStock: boolean).",
      });
    }
  };

  const handleValidateZod = () => {
    const parsed = parseInput();
    if ("error" in parsed) {
      setZodResult({ status: "invalid", message: parsed.error });
      return;
    }

    const result = productSchema.safeParse(parsed.data);
    if (result.success) {
      setZodResult({ status: "valid", product: result.data });
    } else {
      const message = result.error.issues
        .map((issue) => `${issue.path.join(".") || "value"}: ${issue.message}`)
        .join("; ");
      setZodResult({ status: "invalid", message });
    }
  };

  return (
    <ConceptLayout
      demo={
        <Stack spacing={2}>
          <TextField
            value={jsonInput}
            onChange={(e) => setJsonInput(e.target.value)}
            multiline
            minRows={10}
            spellCheck={false}
            fullWidth
            slotProps={{
              htmlInput: {
                style: { fontFamily: "monospace", fontSize: "0.9rem" },
              },
            }}
          />

          <Stack direction="row" spacing={1.5}>
            <Button
              type="button"
              variant="contained"
              onClick={handleValidateManual}
            >
              Validate (manual)
            </Button>
            <Button
              type="button"
              variant="outlined"
              onClick={handleValidateZod}
            >
              Validate (Zod)
            </Button>
          </Stack>

          <ValidationPanel title="Manual type guard" result={manualResult} />
          <ValidationPanel title="Zod schema" result={zodResult} />
        </Stack>
      }
      explanation={
        <ConceptExplanation
          title="AI Response Validator"
          llmConcept={[
            "Structured output reliability: LLMs often return JSON-like text that isn't guaranteed to match the schema an application expects.",
            "Runtime validation: TypeScript types disappear at compile time, so the actual response must be checked in code before it can be trusted.",
          ]}
          summary="TypeScript types vanish at runtime, so data coming back from an LLM (or any API) must be checked by actual code, not just a type annotation — this page shows two ways to do that check."
          whatItDoes={[
            "Parses raw JSON text typed into a textarea, catching syntax errors separately from type errors.",
            "Checks the parsed data against a Product shape using two different techniques side by side.",
            "Shows the resulting product fields on success, or a specific error message on failure.",
          ]}
          principles={[
            "Types are compile-time only: `Product` disappears after TypeScript compiles to JS, so matching it requires a runtime type guard or a schema library — never just a type assertion.",
            "Fail fast, fail specific: JSON.parse errors (bad syntax) are handled and reported separately from shape-mismatch errors (valid JSON, wrong structure).",
            "Two valid strategies for the same problem: a hand-written type guard is dependency-free and fully explicit; a schema library (Zod) trades a small dependency for richer, field-by-field error messages and less boilerplate as shapes grow.",
          ]}
          howItWorks={[
            "isProduct(data): data is Product is a type predicate — after it returns true, TypeScript narrows data to Product for the rest of that branch.",
            "productSchema.safeParse(data) never throws; it returns a discriminated result ({ success, data } or { success: false, error }), which is why its branches are handled without try/catch.",
            "Both paths reuse the same parseInput() JSON.parse wrapper, so the only difference between the two buttons is the validation strategy, not the parsing step.",
          ]}
        />
      }
    />
  );
}

function ValidationPanel({
  title,
  result,
}: {
  title: string;
  result: ValidationResult;
}) {
  if (result.status === "idle") return null;

  return (
    <Paper variant="outlined" sx={{ p: 1.5 }}>
      <Typography variant="subtitle2" gutterBottom>
        {title}
      </Typography>

      {result.status === "valid" && (
        <Stack component="dl" spacing={0.25} sx={{ m: 0 }}>
          <Stack direction="row" spacing={1}>
            <Typography
              variant="body2"
              component="dt"
              sx={{ fontWeight: 600, minWidth: 70 }}
            >
              ID
            </Typography>
            <Typography variant="body2" component="dd" sx={{ m: 0 }}>
              {result.product.id}
            </Typography>
          </Stack>
          <Stack direction="row" spacing={1}>
            <Typography
              variant="body2"
              component="dt"
              sx={{ fontWeight: 600, minWidth: 70 }}
            >
              Name
            </Typography>
            <Typography variant="body2" component="dd" sx={{ m: 0 }}>
              {result.product.name}
            </Typography>
          </Stack>
          <Stack direction="row" spacing={1}>
            <Typography
              variant="body2"
              component="dt"
              sx={{ fontWeight: 600, minWidth: 70 }}
            >
              Price
            </Typography>
            <Typography variant="body2" component="dd" sx={{ m: 0 }}>
              ${result.product.price}
            </Typography>
          </Stack>
          <Stack direction="row" spacing={1}>
            <Typography
              variant="body2"
              component="dt"
              sx={{ fontWeight: 600, minWidth: 70 }}
            >
              In stock
            </Typography>
            <Typography variant="body2" component="dd" sx={{ m: 0 }}>
              {result.product.inStock ? "Yes" : "No"}
            </Typography>
          </Stack>
        </Stack>
      )}

      {result.status === "invalid" && (
        <Alert severity="error">{result.message}</Alert>
      )}
    </Paper>
  );
}
