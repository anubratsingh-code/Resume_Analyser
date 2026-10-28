import React from "react";
import { Download, RotateCcw, Sparkles } from "lucide-react";
import { AnalysisResult } from "../types";
import { exportAnalysisAsMarkdown } from "../utils/helpers";

interface HeaderProps {
  currentView: "single" | "batch" | "jd-builder" | "saved";
  analysis: AnalysisResult | null;
  onReset: () => void;
  onSaveReport?: () => void;
  isSaved?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  currentView,
  analysis,
  onReset,
  onSaveReport,
  isSaved,
}) => {
  const getBreadcrumb = () => {
    switch (currentView) {
      case "single":
        return {
          section: "Candidate Screening",
          title: analysis ? `${analysis.candidateName} Match Analysis` : "New Profile Evaluation",
        };
      case "batch":
        return {
          section: "Candidate Screening",
          title: "Multi-Candidate Leaderboard & Comparison",
        };
      case "jd-builder":
        return {
          section: "Role Engineering",
          title: "Job Description Architect & Benchmarks",
        };
      case "saved":
        return {
          section: "Talent Repository",
          title: "Archived Candidate Evaluations",
        };
    }
  };

  const breadcrumb = getBreadcrumb();

  return (
    <header className="h-16 bg-white border-b border-slate-200/80 px-6 flex items-center justify-between gap-8 sticky top-0 z-10">
      {/* Zone 1: Breadcrumb Context */}
      <div className="flex items-center gap-2 text-sm">
        <span className="text-slate-400 font-medium">{breadcrumb.section}</span>
        <span className="text-slate-300 font-mono">/</span>
        <span className="text-slate-800 font-semibold truncate max-w-md">
          {breadcrumb.title}
        </span>
      </div>

      {/* Zone 2: Metric highlight or helper status */}
      <div className="hidden md:flex items-center gap-6 text-xs text-slate-500 font-medium">
        <span>Strict JD Keyword & Track-Record Verification</span>
        <span aria-hidden="true" className="text-slate-300">·</span>
        <span>Bias-Reduced Objective Scoring</span>
      </div>

      {/* Zone 3: Action Buttons */}
      <div className="flex items-center gap-2 shrink-0">
        {analysis && currentView === "single" && (
          <>
            <button
              onClick={() => exportAnalysisAsMarkdown(analysis)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors whitespace-nowrap"
              title="Download Markdown Report"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Report</span>
            </button>

            {onSaveReport && (
              <button
                onClick={onSaveReport}
                disabled={isSaved}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap ${
                  isSaved
                    ? "bg-slate-100 text-slate-400 cursor-default"
                    : "bg-indigo-50 border border-indigo-200 text-indigo-700 hover:bg-indigo-100"
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                <span>{isSaved ? "Saved to Archive" : "Save Evaluation"}</span>
              </button>
            )}
          </>
        )}

        <button
          onClick={onReset}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors whitespace-nowrap"
          title="Reset Inputs"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset</span>
        </button>
      </div>
    </header>
  );
};
