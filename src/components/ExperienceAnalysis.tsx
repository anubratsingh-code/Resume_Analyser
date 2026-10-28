import React from "react";
import { ExperienceComparison } from "../types";
import {
  CheckCircle2,
  AlertTriangle,
  Star,
  Compass,
  Lightbulb,
} from "lucide-react";

interface ExperienceAnalysisProps {
  comparison: ExperienceComparison;
  keyStrengths: string[];
  redFlagsOrRisks: string[];
  actionableSuggestions: string[];
}

export const ExperienceAnalysis: React.FC<ExperienceAnalysisProps> = ({
  comparison,
  keyStrengths,
  redFlagsOrRisks,
  actionableSuggestions,
}) => {
  return (
    <div className="space-y-6">
      {/* Experience Level & Track Record Box */}
      <div className="bg-white border border-slate-200/80 rounded-xl p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-slate-100 gap-3">
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              Experience Level & Scope Alignment
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Benchmarking responsibilities, scale, and organizational seniority
            </p>
          </div>

          <div className="flex items-center gap-3 text-xs bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200/60 font-mono">
            <div>
              <span className="text-slate-400">Candidate: </span>
              <span className="font-semibold text-slate-800">
                {comparison.candidateLevel}
              </span>
            </div>
            <span className="text-slate-300">vs</span>
            <div>
              <span className="text-slate-400">Target Role: </span>
              <span className="font-semibold text-indigo-700">
                {comparison.requiredLevel}
              </span>
            </div>
          </div>
        </div>

        <p className="text-xs text-slate-600 mt-4 leading-relaxed bg-slate-50/50 p-3.5 rounded-lg border border-slate-200/50">
          <strong className="text-slate-800">Seniority Verdict: </strong>
          {comparison.levelFitExplanation}
        </p>

        {/* Quantified Matched Achievements */}
        <div className="mt-5">
          <div className="text-xs font-semibold text-slate-800 mb-2.5 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Quantified Achievements Validating JD Requirements</span>
          </div>

          <div className="space-y-2">
            {comparison.keyAchievementsMatched.map((ach, idx) => (
              <div
                key={idx}
                className="text-xs text-slate-700 bg-emerald-50/30 border border-emerald-100 rounded-lg p-3 flex items-start gap-2.5"
              >
                <span className="font-mono text-emerald-700 font-bold shrink-0 mt-0.5">
                  0{idx + 1}.
                </span>
                <span className="leading-relaxed">{ach}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Experience Gaps if any */}
        {comparison.experienceGaps && comparison.experienceGaps.length > 0 && (
          <div className="mt-5">
            <div className="text-xs font-semibold text-slate-800 mb-2 flex items-center gap-2">
              <Compass className="w-4 h-4 text-amber-600" />
              <span>Domain & Experience Gaps</span>
            </div>
            <ul className="space-y-1.5 pl-1">
              {comparison.experienceGaps.map((gap, idx) => (
                <li key={idx} className="text-xs text-slate-600 flex items-start gap-2">
                  <span className="text-amber-500 font-bold leading-none mt-1">·</span>
                  <span>{gap}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Two Column Grid: Strengths vs Risks */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Key Strengths */}
        <div className="bg-white border border-slate-200/80 rounded-xl p-5 shadow-xs">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <Star className="w-4 h-4 text-amber-500 fill-amber-400" />
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Primary Competitive Strengths
            </h4>
          </div>

          <ul className="mt-3.5 space-y-2.5">
            {keyStrengths.map((str, idx) => (
              <li
                key={idx}
                className="text-xs text-slate-700 flex items-start gap-2 leading-relaxed"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0 mt-1.5" />
                <span>{str}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Risk Flags & Considerations */}
        <div className="bg-white border border-slate-200/80 rounded-xl p-5 shadow-xs">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <AlertTriangle className="w-4 h-4 text-rose-500" />
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Scrutiny Flags & Hiring Risks
            </h4>
          </div>

          <ul className="mt-3.5 space-y-2.5">
            {redFlagsOrRisks.length > 0 ? (
              redFlagsOrRisks.map((risk, idx) => (
                <li
                  key={idx}
                  className="text-xs text-slate-700 flex items-start gap-2 leading-relaxed bg-rose-50/40 p-2.5 rounded border border-rose-100/70"
                >
                  <span className="text-rose-600 font-bold shrink-0">!</span>
                  <span>{risk}</span>
                </li>
              ))
            ) : (
              <li className="text-xs text-emerald-700 italic">
                No notable employment gaps or conflicting credentials detected.
              </li>
            )}
          </ul>
        </div>
      </div>

      {/* Actionable Advice & Upskilling Suggestions */}
      {actionableSuggestions && actionableSuggestions.length > 0 && (
        <div className="bg-indigo-50/40 border border-indigo-100 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-3">
            <Lightbulb className="w-4 h-4 text-indigo-600" />
            <h4 className="text-xs font-bold text-indigo-950 uppercase tracking-wider">
              Targeted Profile Improvement & Interview Preparation
            </h4>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {actionableSuggestions.map((sugg, idx) => (
              <div
                key={idx}
                className="text-xs text-indigo-900 bg-white/80 border border-indigo-200/60 rounded-lg p-3 leading-relaxed"
              >
                <span className="font-semibold text-indigo-600">Tip #{idx + 1}: </span>
                {sugg}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
