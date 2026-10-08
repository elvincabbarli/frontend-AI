import { useMemo, useState } from "react";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Slider from "@mui/material/Slider";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import { ConceptLayout, ConceptExplanation } from "../../components/ConceptExplainer/ConceptExplainer";

const TOKENS = ["React", "Angular", "Vue"] as const;
const BASE_PROBABILITIES = [0.6, 0.25, 0.15];
const HISTORY_LIMIT = 5;
const BULK_SAMPLE_COUNT = 100;

function computeProbabilities(temperature: number): number[] {
  if (temperature <= 0) {
    const maxProb = Math.max(...BASE_PROBABILITIES);
    const maxIndex = BASE_PROBABILITIES.indexOf(maxProb);
    return BASE_PROBABILITIES.map((_, i) => (i === maxIndex ? 1 : 0));
  }

  const scaled = BASE_PROBABILITIES.map((p) => Math.pow(p, 1 / temperature));
  const total = scaled.reduce((sum, value) => sum + value, 0);
  return scaled.map((value) => value / total);
}

function sampleIndex(probabilities: number[]): number {
  const roll = Math.random();
  let cumulative = 0;

  for (let i = 0; i < probabilities.length; i++) {
    cumulative += probabilities[i];
    if (roll < cumulative) return i;
  }

  return probabilities.length - 1;
}

export default function TemperatureExperiment() {
  const [temperature, setTemperature] = useState(1);
  const [history, setHistory] = useState<string[]>([]);
  const [bulkCounts, setBulkCounts] = useState<number[] | null>(null);

  const probabilities = useMemo(() => computeProbabilities(temperature), [temperature]);

  const handleGenerate = () => {
    const index = sampleIndex(probabilities);
    setHistory((prev) => [TOKENS[index], ...prev].slice(0, HISTORY_LIMIT));
    setBulkCounts(null);
  };

  const handleBulkSample = () => {
    const counts = TOKENS.map(() => 0);
    for (let i = 0; i < BULK_SAMPLE_COUNT; i++) {
      counts[sampleIndex(probabilities)] += 1;
    }
    setBulkCounts(counts);
  };

  return (
    <ConceptLayout
      demo={
        <Stack spacing={2.5}>
          <Stack spacing={0.5}>
            {TOKENS.map((token, i) => (
              <Stack
                key={token}
                direction="row"
                sx={{ justifyContent: "space-between", px: 1.5, py: 0.75, bgcolor: "grey.50", borderRadius: 1 }}
              >
                <Typography variant="body2">{token}</Typography>
                <Typography variant="body2">{(probabilities[i] * 100).toFixed(1)}%</Typography>
              </Stack>
            ))}
          </Stack>

          <Box>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Temperature: {temperature.toFixed(1)}
            </Typography>
            <Slider
              value={temperature}
              min={0}
              max={2}
              step={0.1}
              onChange={(_, value) => setTemperature(value as number)}
            />
          </Box>

          <Stack direction="row" spacing={1.5}>
            <Button type="button" variant="contained" onClick={handleGenerate}>
              Generate
            </Button>
            <Button type="button" variant="outlined" onClick={handleBulkSample}>
              Sample 100 tokens
            </Button>
          </Stack>

          {history.length > 0 && (
            <Paper variant="outlined" sx={{ p: 1.5 }}>
              <Typography variant="subtitle2" gutterBottom>
                Last {HISTORY_LIMIT} generated:
              </Typography>
              <Stack component="ul" spacing={0.25} sx={{ m: 0, pl: 2.5 }}>
                {history.map((token, i) => (
                  <Typography key={i} component="li" variant="body2">
                    {token}
                  </Typography>
                ))}
              </Stack>
            </Paper>
          )}

          {bulkCounts && (
            <Paper variant="outlined" sx={{ p: 1.5 }}>
              <Typography variant="subtitle2" gutterBottom>
                Frequency over {BULK_SAMPLE_COUNT} samples:
              </Typography>
              <Stack component="ul" spacing={0.25} sx={{ m: 0, pl: 2.5 }}>
                {TOKENS.map((token, i) => (
                  <Typography key={token} component="li" variant="body2">
                    {token}: {bulkCounts[i]} ({((bulkCounts[i] / BULK_SAMPLE_COUNT) * 100).toFixed(1)}%)
                  </Typography>
                ))}
              </Stack>
            </Paper>
          )}
        </Stack>
      }
      explanation={
        <ConceptExplanation
          title="Temperature Experiment"
          llmConcept={[
            "Sampling temperature: a decoding parameter that controls how random or deterministic the model's token choice is.",
            "Token-probability sampling: an LLM doesn't always pick the single highest-probability token — it samples from a probability distribution over candidates.",
          ]}
          summary="Shows how an LLM's 'temperature' setting reshapes a probability distribution before a token is sampled — the hotter the temperature, the flatter (more random) the choice."
          whatItDoes={[
            "Starts from fixed base probabilities (60% / 25% / 15%) for three tokens.",
            "Recalculates the effective probabilities whenever the temperature slider (0–2) moves.",
            "Samples one token per Generate click, keeping a rolling history of the last 5, plus a bulk 100-sample frequency check.",
          ]}
          principles={[
            "Derived state via useMemo: probabilities are recomputed only when temperature changes, not stored redundantly in their own state.",
            "Weighted random sampling: Math.random() plus a cumulative-distribution walk turns probabilities into an actual discrete choice.",
            "Law of large numbers as a sanity check: the bulk 100-sample run exists to visually confirm that observed frequencies converge toward the computed probabilities.",
          ]}
          howItWorks={[
            "computeProbabilities raises each base probability to the power of 1/temperature with Math.pow, then normalizes so they sum back to 1 — this is the classic temperature-scaling formula.",
            "temperature < 1 sharpens the distribution toward the most likely token; temperature > 1 flattens it toward uniform randomness; temperature = 0 is handled as a special case (always pick the argmax) to avoid a 0^Infinity divide-by-zero.",
            "sampleIndex draws one Math.random() value and walks the cumulative sum of probabilities until it 'lands' on a token — the same technique used to sample from any discrete distribution.",
          ]}
        />
      }
    />
  );
}
