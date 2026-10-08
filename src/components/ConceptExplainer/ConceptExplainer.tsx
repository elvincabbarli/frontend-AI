import type { ReactNode } from "react";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";

interface ConceptLayoutProps {
  demo: ReactNode;
  explanation: ReactNode;
}

export function ConceptLayout({ demo, explanation }: ConceptLayoutProps) {
  return (
    <Stack direction={{ xs: "column", md: "row" }} spacing={4} sx={{ alignItems: "flex-start" }}>
      <Box sx={{ flex: "1 1 320px", minWidth: 260, maxWidth: 600 }}>{demo}</Box>

      <Divider
        orientation="vertical"
        flexItem
        sx={{ display: { xs: "none", md: "block" } }}
      />
      <Divider sx={{ display: { xs: "block", md: "none" }, width: "100%" }} />

      <Box sx={{ flex: "1 1 320px", minWidth: 260, maxWidth: 480 }}>{explanation}</Box>
    </Stack>
  );
}

interface ConceptExplanationProps {
  title: string;
  llmConcept: string[];
  summary: string;
  whatItDoes: string[];
  principles: string[];
  howItWorks: string[];
}

function ExplanationSection({ heading, items }: { heading: string; items: string[] }) {
  return (
    <Box component="section">
      <Typography
        variant="overline"
        color="primary"
        sx={{ display: "block", fontWeight: 700, lineHeight: 1.8 }}
      >
        {heading}
      </Typography>
      <Stack component="ul" spacing={0.6} sx={{ m: 0, pl: 2.5 }}>
        {items.map((item, i) => (
          <Typography key={i} component="li" variant="body2" sx={{ lineHeight: 1.5 }}>
            {item}
          </Typography>
        ))}
      </Stack>
    </Box>
  );
}

export function ConceptExplanation({
  title,
  llmConcept,
  summary,
  whatItDoes,
  principles,
  howItWorks,
}: ConceptExplanationProps) {
  return (
    <Stack spacing={2}>
      <Typography variant="h5" sx={{ fontWeight: 700 }}>
        {title}
      </Typography>
      <Typography color="text.secondary" sx={{ lineHeight: 1.5 }}>
        {summary}
      </Typography>

      <ExplanationSection heading="AI/LLM concept" items={llmConcept} />
      <ExplanationSection heading="What this does" items={whatItDoes} />
      <ExplanationSection heading="Principles" items={principles} />
      <ExplanationSection heading="How it works" items={howItWorks} />
    </Stack>
  );
}
