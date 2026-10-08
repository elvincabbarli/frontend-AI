import { useState } from "react";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import { ConceptLayout, ConceptExplanation } from "../../components/ConceptExplainer/ConceptExplainer";

function simulateInference(prompt: string): Promise<string> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(`Generated response for: ${prompt}`);
    }, 2000);
  });
}

export default function InferenceMonitor() {
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState<string | null>(null);
  const [elapsedSeconds, setElapsedSeconds] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerate = async () => {
    if (!prompt.trim() || isLoading) return;

    setIsLoading(true);
    setResponse(null);
    setElapsedSeconds(null);

    const start = performance.now();
    const result = await simulateInference(prompt);
    const elapsed = (performance.now() - start) / 1000;

    setResponse(result);
    setElapsedSeconds(elapsed);
    setIsLoading(false);
  };

  return (
    <ConceptLayout
      demo={
        <Stack spacing={2}>
          <TextField
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Enter a prompt..."
            multiline
            minRows={4}
            disabled={isLoading}
            fullWidth
          />

          <Button
            type="button"
            variant="contained"
            onClick={handleGenerate}
            disabled={isLoading || !prompt.trim()}
            sx={{ alignSelf: "flex-start" }}
          >
            Generate
          </Button>

          {isLoading && (
            <Stack direction="row" spacing={1} role="status" sx={{ alignItems: "center" }}>
              <CircularProgress size={18} />
              <Typography color="text.secondary">Running inference...</Typography>
            </Stack>
          )}

          {response && !isLoading && (
            <Paper variant="outlined" sx={{ p: 1.5, bgcolor: "grey.50" }}>
              <Stack spacing={0.5}>
                <Typography>{response}</Typography>
                {elapsedSeconds !== null && (
                  <Typography variant="body2" color="text.secondary">
                    Elapsed: {elapsedSeconds.toFixed(2)}s
                  </Typography>
                )}
              </Stack>
            </Paper>
          )}
        </Stack>
      }
      explanation={
        <ConceptExplanation
          title="Inference Monitor"
          llmConcept={[
            "Inference latency: the time an LLM takes to generate a response, a core metric for real-world UX, cost, and performance monitoring.",
          ]}
          summary="Wraps an async 'model call' with real wall-clock timing, the same way you'd instrument a real LLM API call to track latency."
          whatItDoes={[
            "Sends a prompt to a simulated inference function and shows a loading state while it runs.",
            "Measures exactly how long the call took, in seconds.",
            "Displays the generated response together with its elapsed time.",
          ]}
          principles={[
            "Measure, don't guess: timing is captured around the actual await, not estimated or hardcoded.",
            "Prevent duplicate work: the Generate button and textarea are disabled while a request is already in flight.",
            "Separation of concerns: simulateInference only produces a result; timing and UI state are the component's responsibility, not the fake API's.",
          ]}
          howItWorks={[
            "performance.now() is read immediately before the await and again right after it resolves — both as high-resolution millisecond timestamps.",
            "performance.now() is preferred over Date.now() here because it's monotonic (never jumps backward) and has sub-millisecond precision, which matters for latency measurements.",
            "The millisecond difference is divided by 1000 to display elapsed time in seconds with toFixed(2).",
          ]}
        />
      }
    />
  );
}
