import React from "react";
import { SkillsAnalysis } from "../types";
import { Check, AlertCircle, PlusCircle, MessageSquare } from "lucide-react";

interface SkillsMatrixProps {
  skills: SkillsAnalysis;
}

export const SkillsMatrix: React.FC<SkillsMatrixProps> = ({ skills }) => {
  return (
    <div className="bg-white border border-slate-200/80 rounded-xl p-6 shadow-xs">
      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
        <div>
          <h3 className="text-sm font-bold text-slate-900">
            Skills & Keyword Alignment Matrix
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Cross-referenced against Job Description requirements
          </p>
        </div>
        <div className="text-xs font-mono text-slate-400">
          {skills.matchedSkills.length} Matched · {skills.missingCriticalSkills.length} Gaps
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-5">
        {/* Matched Skills */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800">
            <Check className="w-4 h-4 text-emerald-600" />
            <span>Verified Matched Hard Skills ({skills.matchedSkills.length})</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {skills.matchedSkills.length > 0 ? (
              skills.matchedSkills.map((skill) => (
                <div
                  key={skill}
                  className="px-2.5 py-1 bg-emerald-50/70 border border-emerald-200/60 rounded text-xs text-emerald-900 font-medium flex items-center gap-1.5"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  <span>{skill}</span>
                </div>
              ))
            ) : (
              <span className="text-xs text-slate-400 italic">No direct keyword matches detected.</span>
            )}
          </div>
        </div>

        {/* Missing Critical Skills */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-xs font-semibold text-rose-800">
            <AlertCircle className="w-4 h-4 text-rose-600" />
            <span>Missing / Unverified JD Requirements ({skills.missingCriticalSkills.length})</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {skills.missingCriticalSkills.length > 0 ? (
              skills.missingCriticalSkills.map((skill) => (
                <div
                  key={skill}
                  className="px-2.5 py-1 bg-rose-50/70 border border-rose-200/60 rounded text-xs text-rose-900 font-medium flex items-center gap-1.5"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                  <span>{skill}</span>
                </div>
              ))
            ) : (
              <span className="text-xs text-emerald-700 font-medium">All core job requirements satisfied.</span>
            )}
          </div>
        </div>

        {/* Transferable / Bonus Skills */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-xs font-semibold text-indigo-800">
            <PlusCircle className="w-4 h-4 text-indigo-600" />
            <span>Transferable & Additional Capabilities ({skills.transferableOrBonusSkills.length})</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {skills.transferableOrBonusSkills.length > 0 ? (
              skills.transferableOrBonusSkills.map((skill) => (
                <div
                  key={skill}
                  className="px-2.5 py-1 bg-indigo-50/60 border border-indigo-200/50 rounded text-xs text-indigo-900 font-medium flex items-center gap-1.5"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                  <span>{skill}</span>
                </div>
              ))
            ) : (
              <span className="text-xs text-slate-400 italic">No bonus skills flagged.</span>
            )}
          </div>
        </div>

        {/* Soft Skills & Interpersonal */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
            <MessageSquare className="w-4 h-4 text-slate-500" />
            <span>Observed Soft Skills & Working Style</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {skills.softSkillsObserved.length > 0 ? (
              skills.softSkillsObserved.map((skill) => (
                <div
                  key={skill}
                  className="px-2.5 py-1 bg-slate-100 border border-slate-200 rounded text-xs text-slate-700 font-medium"
                >
                  {skill}
                </div>
              ))
            ) : (
              <span className="text-xs text-slate-400 italic">Not explicitly noted in resume.</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
