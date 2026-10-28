import React from "react";
import {
  FileCheck2,
  Users2,
  FileSpreadsheet,
  BookmarkCheck,
  Sparkles,
  ChevronRight,
  Briefcase,
  Layers,
} from "lucide-react";
import { CandidatePreset, JobPreset } from "../types";

interface SidebarProps {
  currentView: "single" | "batch" | "jd-builder" | "saved";
  setCurrentView: (view: "single" | "batch" | "jd-builder" | "saved") => void;
  savedCount: number;
  presets: {
    roles: JobPreset[];
    candidates: CandidatePreset[];
  };
  onSelectCandidatePreset: (candidate: CandidatePreset) => void;
  onSelectRolePreset: (role: JobPreset) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  setCurrentView,
  savedCount,
  presets,
  onSelectCandidatePreset,
  onSelectRolePreset,
}) => {
  const navItems = [
    {
      id: "single" as const,
      label: "Single Match Analyzer",
      description: "Deep 1-on-1 resume against JD analysis",
      icon: FileCheck2,
    },
    {
      id: "batch" as const,
      label: "Batch Candidate Screen",
      description: "Rank & compare candidate pools",
      icon: Users2,
    },
    {
      id: "jd-builder" as const,
      label: "JD Architect & Benchmarks",
      description: "Draft & standardize job descriptions",
      icon: FileSpreadsheet,
    },
    {
      id: "saved" as const,
      label: "Saved Evaluations",
      description: "Archived reports & interview rubrics",
      icon: BookmarkCheck,
      badge: savedCount > 0 ? savedCount : undefined,
    },
  ];

  return (
    <aside className="w-72 bg-white border-r border-slate-200/80 flex flex-col shrink-0 h-screen sticky top-0 overflow-y-auto">
      {/* Brand Header */}
      <div className="p-5 border-b border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-sm">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base font-bold text-slate-900 tracking-tight leading-none">
              TalentMatch AI
            </h1>
            <p className="text-xs text-slate-500 mt-1">Resume & Profile Engine</p>
          </div>
        </div>
      </div>

      {/* Primary Navigation */}
      <div className="p-4 flex-1 space-y-1">
        <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-3 mb-2">
          Workflows
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setCurrentView(item.id)}
              className={`w-full flex items-start gap-3 px-3 py-2.5 rounded-lg text-left transition-colors ${
                isActive
                  ? "bg-indigo-50/80 text-indigo-950 font-medium border border-indigo-100/60"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              <Icon
                className={`w-5 h-5 mt-0.5 shrink-0 ${
                  isActive ? "text-indigo-600" : "text-slate-400"
                }`}
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="text-sm truncate">{item.label}</span>
                  {item.badge !== undefined && (
                    <span className="text-xs font-mono font-medium px-1.5 py-0.2 bg-slate-100 text-slate-700 rounded tabular-nums">
                      {item.badge}
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-400 truncate mt-0.5">
                  {item.description}
                </p>
              </div>
            </button>
          );
        })}

        {/* Quick Benchmarks & Presets Section */}
        <div className="pt-6">
          <div className="flex items-center justify-between px-3 mb-2">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Sample Candidates
            </span>
            <span className="text-xs text-slate-400 font-mono">1-Click</span>
          </div>

          <div className="space-y-1.5">
            {presets.candidates.map((cand) => (
              <button
                key={cand.id}
                onClick={() => {
                  onSelectCandidatePreset(cand);
                  if (currentView !== "single") setCurrentView("single");
                }}
                className="w-full text-left p-2.5 rounded-lg border border-slate-200/60 hover:border-indigo-300 hover:bg-indigo-50/30 transition-all flex items-center gap-2.5 group"
              >
                <img
                  src={cand.avatar}
                  alt={cand.name}
                  referrerPolicy="no-referrer"
                  className="w-8 h-8 rounded-full object-cover border border-slate-200 shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-semibold text-slate-800 truncate group-hover:text-indigo-600">
                    {cand.name}
                  </div>
                  <div className="text-[11px] text-slate-500 truncate">
                    {cand.currentTitle.split(" at ")[0]} · {cand.experienceYears}y exp
                  </div>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-600 transition-transform group-hover:translate-x-0.5" />
              </button>
            ))}
          </div>
        </div>

        {/* Quick Sample Roles */}
        <div className="pt-5">
          <div className="px-3 mb-2 flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Sample Job Roles
            </span>
            <Briefcase className="w-3.5 h-3.5 text-slate-400" />
          </div>

          <div className="space-y-1">
            {presets.roles.map((role) => (
              <button
                key={role.id}
                onClick={() => {
                  onSelectRolePreset(role);
                  if (currentView !== "single") setCurrentView("single");
                }}
                className="w-full text-left px-2.5 py-1.5 rounded-md text-xs text-slate-600 hover:text-indigo-700 hover:bg-slate-100 transition-colors truncate block"
                title={role.title}
              >
                {role.title}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Footer Info */}
      <div className="p-4 border-t border-slate-100 bg-slate-50/50">
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <Layers className="w-4 h-4 text-indigo-500" />
          <span>Gemini 3.8 Flash Engine</span>
        </div>
        <div className="text-[11px] text-slate-400 mt-1">
          Objective criteria-weighted scoring
        </div>
      </div>
    </aside>
  );
};
