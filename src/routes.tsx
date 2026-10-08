import type { ReactNode } from "react";
import Home from "./pages/Home/Home";
import AIQuestionBox from "./pages/AIQuestionBox/AIQuestionBox";
import PromptAnalyzer from "./pages/PromptAnalyzer/PromptAnalyzer";
import InferenceMonitor from "./pages/InferenceMonitor/InferenceMonitor";
import TemperatureExperiment from "./pages/TemperatureExperiment/TemperatureExperiment";
import AIResponseValidator from "./pages/AIResponseValidator/AIResponseValidator";

export interface AppRoute {
  path: string;
  label: string;
  element: ReactNode;
  group?: string;
}

export const routes: AppRoute[] = [
  { path: "/", label: "Home", element: <Home /> },
  {
    path: "/ai-question-box",
    label: "AI Question Box",
    element: <AIQuestionBox />,
    group: "LLM Fundamentals",
  },
  {
    path: "/prompt-analyzer",
    label: "Prompt Analyzer",
    element: <PromptAnalyzer />,
    group: "LLM Fundamentals",
  },
  {
    path: "/inference-monitor",
    label: "Inference Monitor",
    element: <InferenceMonitor />,
    group: "LLM Fundamentals",
  },
  {
    path: "/temperature-experiment",
    label: "Temperature Experiment",
    element: <TemperatureExperiment />,
    group: "LLM Fundamentals",
  },
  {
    path: "/ai-response-validator",
    label: "AI Response Validator",
    element: <AIResponseValidator />,
    group: "LLM Fundamentals",
  },
];
