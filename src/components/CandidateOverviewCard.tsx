import React from "react";
import { AnalysisResult } from "../types";
import { MapPin, Mail, Clock, Briefcase, UserCheck } from "lucide-react";

interface CandidateOverviewCardProps {
  analysis: AnalysisResult;
}

export const CandidateOverviewCard: React.FC<CandidateOverviewCardProps> = ({
  analysis,
}) => {
  return (
    <div className="bg-white border border-slate-200/80 rounded-xl p-6 shadow-xs">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-5 border-b border-slate-100">
        <div className="flex items-center gap-4">
          {analysis.avatar ? (
            <img
              src={analysis.avatar}
              alt={analysis.candidateName}
              referrerPolicy="no-referrer"
              className="w-16 h-16 rounded-xl object-cover border border-slate-200 shadow-xs"
            />
          ) : (
            <div className="w-16 h-16 rounded-xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-700 font-bold text-xl shadow-xs">
              {analysis.candidateName
                .split(" ")
                .map((n) => n[0])
                .join("")
                .slice(0, 2)
                .toUpperCase() || "CP"}
            </div>
          )}

          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                {analysis.candidateName}
              </h2>
              <span className="text-xs text-slate-400 font-mono">
                Candidate Profile
              </span>
            </div>
            <p className="text-xs font-medium text-slate-600 mt-0.5">
              {analysis.candidateTitle || "Professional Applicant"}
            </p>

            <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-slate-500 font-mono">
              {analysis.candidateLocation && (
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  {analysis.candidateLocation}
                </span>
              )}
              {analysis.candidateEmail && (
                <span className="flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  {analysis.candidateEmail}
                </span>
              )}
              <span className="flex items-center gap-1 tabular-nums">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                {analysis.totalExperienceYears} Years Track Record
              </span>
            </div>
          </div>
        </div>

        <div className="text-right sm:self-auto self-start bg-slate-50 p-3 rounded-lg border border-slate-200/60 text-xs">
          <div className="text-[11px] text-slate-400 font-mono uppercase tracking-wider">
            Target Job Opening
          </div>
          <div className="font-semibold text-slate-900 mt-0.5 max-w-[240px] truncate">
            {analysis.targetJobTitle || "Target Role"}
          </div>
          <div className="text-[11px] text-slate-400 mt-1 font-mono">
            {analysis.analyzedAt || new Date().toLocaleDateString()}
          </div>
        </div>
      </div>

      {/* Executive Summary */}
      <div className="mt-4">
        <div className="text-xs font-semibold text-slate-800 uppercase tracking-wider mb-1 flex items-center gap-1.5">
          <UserCheck className="w-3.5 h-3.5 text-indigo-600" />
          <span>Executive Background Synopsis</span>
        </div>
        <p className="text-xs text-slate-600 leading-relaxed">
          {analysis.summary}
        </p>
      </div>
    </div>
  );
};
