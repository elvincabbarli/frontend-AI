import { useState } from "react";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import LinearProgress from "@mui/material/LinearProgress";
import Typography from "@mui/material/Typography";
import { ConceptLayout, ConceptExplanation } from "../../components/ConceptExplainer/ConceptExplainer";

const TOKEN_BUDGET = 500;
const WARNING_THRESHOLD = 0.8;
const CHARS_PER_TOKEN = 4;

function estimateTokenCount(text: string): number {
  if (!text) return 0;
  return Math.ceil(text.length / CHARS_PER_TOKEN);
}

export default function PromptAnalyzer() {
  const [prompt, setPrompt] = useState("");

  const charCount = prompt.length;
  const tokenCount = estimateTokenCount(prompt);
  const remainingTokens = TOKEN_BUDGET - tokenCount;
  const usagePercent = Math.min((tokenCount / TOKEN_BUDGET) * 100, 100);
  const isOverBudget = tokenCount > TOKEN_BUDGET;
  const isNearBudget = !isOverBudget && tokenCount >= TOKEN_BUDGET * WARNING_THRESHOLD;

  return (
    <ConceptLayout
      demo={
        <Stack spacing={2}>
          <TextField
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Type your prompt..."
            multiline
            minRows={6}
            fullWidth
          />

          <Stack direction="row" spacing={3} sx={{ flexWrap: "wrap" }}>
            <Typography variant="body2">Characters: {charCount}</Typography>
            <Typography variant="body2">Estimated tokens: {tokenCount}</Typography>
            <Typography variant="body2">Remaining budget: {remainingTokens}</Typography>
          </Stack>

          <LinearProgress
            variant="determinate"
            value={usagePercent}
            color={isOverBudget ? "error" : isNearBudget ? "warning" : "primary"}
            sx={{ height: 8, borderRadius: 4 }}
          />

          {isNearBudget && (
            <Alert severity="warning">
              Warning: approaching the {TOKEN_BUDGET}-token budget.
            </Alert>
          )}

          {isOverBudget && (
            <Alert severity="error">
              Prompt exceeds the {TOKEN_BUDGET}-token budget by {Math.abs(remainingTokens)} tokens.
            </Alert>
          )}

          <Button
            type="button"
            variant="contained"
            disabled={isOverBudget || !prompt.trim()}
            sx={{ alignSelf: "flex-start" }}
          >
            Submit
          </Button>
        </Stack>
      }
      explanation={
        <ConceptExplanation
          title="Prompt Analyzer"
          llmConcept={[
            "Tokenization: LLMs are billed and limited in tokens, not characters, so counting characters alone isn't enough to reason about cost or limits.",
            "Context window / token budget: every model has a maximum number of tokens it can accept per request, and prompts must stay within that budget.",
          ]}
          summary="Gives instant, local feedback on how 'expensive' a prompt is before it's ever sent to a real model, using a cheap heuristic instead of a real tokenizer."
          whatItDoes={[
            "Counts characters and estimates tokens as the user types.",
            "Tracks a fixed 500-token budget and shows the remaining headroom.",
            "Warns at 80% usage and blocks submission once the budget is exceeded.",
          ]}
          principles={[
            "Derived state over duplicated state: tokenCount, remainingTokens, usagePercent, isNearBudget and isOverBudget are all computed on every render from the single prompt string — none of them live in their own useState.",
            "Progressive disclosure: warning and error banners only render when their condition is true (conditional rendering), so the UI stays quiet until something needs attention.",
            "Approximation over precision: no tokenizer library is used; a 4-characters-per-token heuristic is a common, fast stand-in for real LLM tokenization.",
          ]}
          howItWorks={[
            "estimateTokenCount divides string length by 4 and rounds up with Math.ceil, giving a conservative (never-under) estimate.",
            "usagePercent is clamped to 100 with Math.min so the progress bar never overflows visually.",
            "isNearBudget / isOverBudget are plain boolean comparisons against TOKEN_BUDGET and WARNING_THRESHOLD, driving both the banner text and the progress bar's color class.",
          ]}
        />
      }
    />
  );
}
