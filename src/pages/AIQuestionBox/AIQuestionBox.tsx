import { useState } from "react";
import type { SubmitEvent } from "react";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import { ConceptLayout, ConceptExplanation } from "../../components/ConceptExplainer/ConceptExplainer";

function fakeAIResponse(question: string): Promise<string> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(`AI received your question: ${question}`);
    }, 1500);
  });
}

export default function AIQuestionBox() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: SubmitEvent) => {
    event.preventDefault();
    if (!question.trim() || isLoading) return;

    setIsLoading(true);
    setError(null);
    setAnswer(null);

    try {
      const response = await fakeAIResponse(question);
      setAnswer(response);
    } catch {
      setError("Something went wrong while contacting the AI. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ConceptLayout
      demo={
        <Stack component="form" onSubmit={handleSubmit} spacing={2}>
          <TextField
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Ask the AI a question..."
            multiline
            minRows={4}
            disabled={isLoading}
            fullWidth
          />

          <Button
            type="submit"
            variant="contained"
            disabled={isLoading || !question.trim()}
            sx={{ alignSelf: "flex-start" }}
          >
            Ask AI
          </Button>

          {isLoading && (
            <Stack direction="row" spacing={1} role="status" sx={{ alignItems: "center" }}>
              <CircularProgress size={18} />
              <Typography color="text.secondary">Thinking...</Typography>
            </Stack>
          )}

          {error && <Alert severity="error">{error}</Alert>}

          {answer && !isLoading && (
            <Paper variant="outlined" sx={{ p: 1.5, bgcolor: "grey.50" }}>
              {answer}
            </Paper>
          )}
        </Stack>
      }
      explanation={
        <ConceptExplanation
          title="AI Question Box"
          llmConcept={[
            "Async request lifecycle of an LLM call: a real model response is never instant, so the UI must represent waiting, success, and failure as distinct states.",
            "This mirrors calling any real LLM API (e.g. a chat completion endpoint), where the request can be slow or can fail outright.",
          ]}
          summary="A minimal async request/response UI pattern: user input goes out, a loading state covers the wait, and the result (or an error) replaces it."
          whatItDoes={[
            "Lets the user type a question into a controlled textarea.",
            "Shows a loading indicator while the simulated AI call is in flight.",
            "Displays the returned answer, or an error message if the call fails.",
          ]}
          principles={[
            "Single source of truth: question/answer/error/isLoading each live in their own useState slot.",
            "Controlled inputs: the textarea's value is always driven by React state, never the DOM.",
            "Disable-while-pending: the button and textarea are disabled during the request to prevent duplicate submits.",
          ]}
          howItWorks={[
            "handleSubmit prevents the native form submit, then guards against empty input or a request already in flight.",
            "It sets isLoading true and clears previous answer/error before awaiting fakeAIResponse(question).",
            "A try/catch/finally ensures isLoading is reset to false whether the call succeeds or fails.",
          ]}
        />
      }
    />
  );
}
