import React from "react";
import { BreakdownScores, RecommendationVerdict } from "../types";
import { formatVerdict, getScoreTone } from "../utils/helpers";
import { Award, Briefcase, GraduationCap, Users, Wrench } from "lucide-react";

interface ScoreGaugeProps {
  score: number;
  verdict: RecommendationVerdict;
  verdictHeadline: string;
  verdictRationale: string;
  breakdown: BreakdownScores;
  marketSalaryBenchmark?: string;
}

export const ScoreGauge: React.FC<ScoreGaugeProps> = ({
  score,
  verdict,
  verdictHeadline,
  verdictRationale,
  breakdown,
  marketSalaryBenchmark,
}) => {
  const tone = getScoreTone(score);
  const verdictStyle = formatVerdict(verdict);

  // SVG Circular math
  const radius = 52;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  const breakdownMetrics = [
    {
      label: "Hard Technical Skills",
      score: breakdown.hardSkillsScore,
      icon: Wrench,
      weight: "40%",
    },
    {
      label: "Experience & Domain",
      score: breakdown.experienceRelevanceScore,
      icon: Briefcase,
      weight: "30%",
    },
    {
      label: "Seniority & Scope",
      score: breakdown.seniorityScore,
      icon: Award,
      weight: "15%",
    },
    {
      label: "Soft Skills & Team Fit",
      score: breakdown.softSkillsScore,
      icon: Users,
      weight: "10%",
    },
    {
      label: "Education & Certifications",
      score: breakdown.educationCertificationsScore,
      icon: GraduationCap,
      weight: "5%",
    },
  ];

  return (
    <div className="bg-white border border-slate-200/80 rounded-xl p-6 shadow-xs">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Left: Big Circular Radial Meter */}
        <div className="lg:col-span-4 flex flex-col items-center justify-center p-4 border-b lg:border-b-0 lg:border-r border-slate-100">
          <div className="relative w-36 h-36 flex items-center justify-center">
            <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 130 130">
              <circle
                cx="65"
                cy="65"
                r={radius}
                className="text-slate-100"
                strokeWidth="10"
                stroke="currentColor"
                fill="transparent"
              />
              <circle
                cx="65"
                cy="65"
                r={radius}
                stroke={tone.stroke}
                strokeWidth="10"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                fill="transparent"
                className="transition-all duration-1000 ease-out"
              />
            </svg>
            <div className="absolute flex flex-col items-center justify-center text-center">
              <span className="text-3xl font-extrabold text-slate-900 font-mono tracking-tight tabular-nums">
                {score}%
              </span>
              <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">
                Overall Match
              </span>
            </div>
          </div>

          <div
            className={`mt-4 px-3 py-1 rounded-md text-xs font-semibold border ${verdictStyle.bgColor} ${verdictStyle.textColor} ${verdictStyle.borderColor}`}
          >
            {verdictStyle.label}
          </div>

          {marketSalaryBenchmark && (
            <div className="mt-3 text-center">
              <span className="text-[11px] text-slate-400 block">Estimated Market Band</span>
              <span className="text-xs font-mono font-medium text-slate-700 tabular-nums">
                {marketSalaryBenchmark}
              </span>
            </div>
          )}
        </div>

        {/* Center: Verdict Headline & Rationale */}
        <div className="lg:col-span-4 flex flex-col justify-center">
          <div className="text-xs font-medium text-slate-400 uppercase tracking-wider">
            Analyst Verdict
          </div>
          <h2 className="text-base font-bold text-slate-900 mt-1 leading-snug">
            {verdictHeadline}
          </h2>
          <p className="text-xs text-slate-600 mt-2 leading-relaxed">
            {verdictRationale}
          </p>
        </div>

        {/* Right: Breakdown bars */}
        <div className="lg:col-span-4 space-y-3">
          <div className="flex items-center justify-between text-xs font-medium text-slate-400 uppercase tracking-wider mb-1">
            <span>Evaluation Criteria</span>
            <span>Score</span>
          </div>

          {breakdownMetrics.map((item) => {
            const Icon = item.icon;
            const barTone = getScoreTone(item.score);
            return (
              <div key={item.label} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 text-slate-700">
                    <Icon className="w-3.5 h-3.5 text-slate-400" />
                    <span className="font-medium truncate">{item.label}</span>
                    <span className="text-[11px] text-slate-400 font-mono">({item.weight})</span>
                  </div>
                  <span className="font-mono text-xs font-semibold text-slate-800 tabular-nums">
                    {item.score}%
                  </span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ${barTone.bg}`}
                    style={{ width: `${item.score}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
