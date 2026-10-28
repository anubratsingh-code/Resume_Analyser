import React, { useState } from "react";
import {
  Users2,
  Trophy,
  ArrowUpDown,
  CheckCircle,
  AlertCircle,
  ChevronRight,
  Download,
  Sparkles,
  Plus,
  Trash2,
} from "lucide-react";
import {
  BatchAnalysisResult,
  CandidatePreset,
  JobPreset,
  BatchCandidateRank,
} from "../types";
import { formatVerdict, getScoreTone } from "../utils/helpers";

interface BatchCompareViewProps {
  presets: {
    roles: JobPreset[];
    candidates: CandidatePreset[];
  };
  onSelectCandidateForSingleAnalysis: (candidate: CandidatePreset) => void;
}

export const BatchCompareView: React.FC<BatchCompareViewProps> = ({
  presets,
  onSelectCandidateForSingleAnalysis,
}) => {
  const [selectedRole, setSelectedRole] = useState<JobPreset>(presets.roles[0]);
  const [customJobDesc, setCustomJobDesc] = useState(presets.roles[0].description);
  const [candidatesToCompare, setCandidatesToCompare] = useState<
    Array<{ id: string; name: string; title: string; resumeText: string; avatar?: string }>
  >(
    presets.candidates.map((c) => ({
      id: c.id,
      name: c.name,
      title: c.currentTitle,
      resumeText: c.resumeText,
      avatar: c.avatar,
    }))
  );

  const [isLoading, setIsLoading] = useState(false);
  const [batchResult, setBatchResult] = useState<BatchAnalysisResult | null>(null);
  const [sortField, setSortField] = useState<"rank" | "overallMatchScore">("rank");
  const [selectedInspectCandidate, setSelectedInspectCandidate] =
    useState<BatchCandidateRank | null>(null);

  const handleRoleChange = (role: JobPreset) => {
    setSelectedRole(role);
    setCustomJobDesc(role.description);
  };

  const handleRunBatchScreening = async () => {
    if (candidatesToCompare.length === 0 || !customJobDesc.trim()) return;
    setIsLoading(true);
    setBatchResult(null);

    try {
      const res = await fetch("/api/batch-compare", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jobTitle: selectedRole.title,
          jobDescription: customJobDesc,
          candidates: candidatesToCompare,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Batch screening failed");
      }

      const data: BatchAnalysisResult = await res.json();
      setBatchResult(data);
    } catch (e: any) {
      alert(e.message || "An error occurred during batch screening");
    } finally {
      setIsLoading(false);
    }
  };

  const removeCandidate = (id: string) => {
    setCandidatesToCompare((prev) => prev.filter((c) => c.id !== id));
  };

  const addCandidate = () => {
    const newId = `custom-${Date.now()}`;
    setCandidatesToCompare((prev) => [
      ...prev,
      {
        id: newId,
        name: `Applicant ${prev.length + 1}`,
        title: "Software Engineer",
        resumeText: `Name: Applicant ${prev.length + 1}\nExperience: 4 years with JavaScript, Node.js, and SQL.`,
      },
    ]);
  };

  const exportCsv = () => {
    if (!batchResult) return;
    const headers = [
      "Rank",
      "Candidate Name",
      "Overall Score",
      "Verdict",
      "Skills Score",
      "Experience Score",
      "Primary Strength",
      "Primary Risk",
    ];
    const rows = batchResult.rankedCandidates.map((c) => [
      c.rank,
      `"${c.name}"`,
      `${c.overallMatchScore}%`,
      `"${c.recommendationVerdict}"`,
      `${c.skillsScore}%`,
      `${c.experienceScore}%`,
      `"${c.primaryStrength.replace(/"/g, '""')}"`,
      `"${c.primaryRisk.replace(/"/g, '""')}"`,
    ]);
    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `candidate_leaderboard_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Configuration Header Box */}
      <div className="bg-white border border-slate-200/80 rounded-xl p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-slate-100 gap-3">
          <div>
            <h2 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <Users2 className="w-5 h-5 text-indigo-600" />
              <span>Multi-Candidate Screening & Leaderboard</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Rank, evaluate, and stack-rank multiple candidate profiles against a single benchmark role
            </p>
          </div>

          <button
            onClick={handleRunBatchScreening}
            disabled={isLoading || candidatesToCompare.length === 0}
            className="px-5 py-2 rounded-lg bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-700 transition-colors flex items-center gap-2 self-start md:self-auto disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Screening Candidate Pool...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Run Batch Stack-Rank</span>
              </>
            )}
          </button>
        </div>

        {/* Target Role & Candidate Setup */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-5">
          {/* Target Role selection */}
          <div className="lg:col-span-6 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Benchmark Job Description
              </label>
              <div className="flex items-center gap-1">
                {presets.roles.map((r) => (
                  <button
                    key={r.id}
                    onClick={() => handleRoleChange(r)}
                    className={`text-[11px] px-2 py-0.5 rounded transition-colors ${
                      selectedRole.id === r.id
                        ? "bg-indigo-50 text-indigo-700 font-semibold border border-indigo-200/60"
                        : "text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    {r.title.split(" (")[0].split(" - ")[0]}
                  </button>
                ))}
              </div>
            </div>

            <textarea
              rows={6}
              value={customJobDesc}
              onChange={(e) => setCustomJobDesc(e.target.value)}
              className="w-full p-3 text-xs text-slate-700 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 font-mono leading-relaxed"
              placeholder="Job Description to screen candidates against..."
            />
          </div>

          {/* Candidates in Cohort */}
          <div className="lg:col-span-6 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Candidate Cohort ({candidatesToCompare.length})
              </label>
              <button
                onClick={addCandidate}
                className="text-[11px] text-indigo-600 hover:text-indigo-800 font-semibold flex items-center gap-1"
              >
                <Plus className="w-3 h-3" />
                <span>Add Candidate</span>
              </button>
            </div>

            <div className="space-y-2 max-h-[160px] overflow-y-auto pr-1">
              {candidatesToCompare.map((cand) => (
                <div
                  key={cand.id}
                  className="flex items-center justify-between p-2.5 rounded-lg border border-slate-200/80 bg-slate-50/60 text-xs"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    {cand.avatar ? (
                      <img
                        src={cand.avatar}
                        alt={cand.name}
                        className="w-6 h-6 rounded-full object-cover shrink-0"
                      />
                    ) : (
                      <div className="w-6 h-6 rounded-full bg-slate-200 text-slate-700 font-bold text-[10px] flex items-center justify-center shrink-0">
                        {cand.name.slice(0, 2)}
                      </div>
                    )}
                    <div className="min-w-0">
                      <div className="font-semibold text-slate-800 truncate">
                        {cand.name}
                      </div>
                      <div className="text-[11px] text-slate-500 truncate">
                        {cand.title}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => removeCandidate(cand.id)}
                    className="text-slate-400 hover:text-rose-600 p-1 rounded"
                    title="Remove candidate from batch"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Results Section */}
      {batchResult && (
        <div className="space-y-6">
          {/* Executive Summary & Cohort Trends */}
          <div className="bg-white border border-slate-200/80 rounded-xl p-6 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-amber-500" />
                <h3 className="text-sm font-bold text-slate-900">
                  Cohort Evaluation & Comparative Analysis
                </h3>
              </div>

              <button
                onClick={exportCsv}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export CSV</span>
              </button>
            </div>

            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="bg-indigo-50/50 p-4 rounded-lg border border-indigo-100/70">
                <div className="font-bold text-indigo-950 uppercase tracking-wider text-[11px] mb-1">
                  Top Recommendation Summary
                </div>
                <p className="text-indigo-900 leading-relaxed">
                  {batchResult.comparativeSummary}
                </p>
              </div>

              <div className="bg-slate-50 p-4 rounded-lg border border-slate-200/60">
                <div className="font-bold text-slate-800 uppercase tracking-wider text-[11px] mb-1">
                  Cohort Observations & Skill Gaps
                </div>
                <p className="text-slate-600 leading-relaxed">
                  {batchResult.cohortObservations}
                </p>
              </div>
            </div>
          </div>

          {/* Leaderboard Table */}
          <div className="bg-white border border-slate-200/80 rounded-xl overflow-hidden shadow-xs">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900">
                Ranked Candidate Leaderboard
              </h3>
              <div className="text-xs text-slate-400 font-mono">
                Sorted by Fit Quality
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-slate-50/80 text-slate-500 font-medium border-b border-slate-100">
                    <th className="py-3 px-4 w-16">Rank</th>
                    <th className="py-3 px-4">Candidate Profile</th>
                    <th className="py-3 px-4">Overall Fit</th>
                    <th className="py-3 px-4">Skills %</th>
                    <th className="py-3 px-4">Exp %</th>
                    <th className="py-3 px-4">Verdict & Primary Rationale</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {batchResult.rankedCandidates.map((cand) => {
                    const verdictStyle = formatVerdict(cand.recommendationVerdict);
                    const tone = getScoreTone(cand.overallMatchScore);
                    const matchedPreset = presets.candidates.find(
                      (p) => p.name.toLowerCase() === cand.name.toLowerCase()
                    );

                    return (
                      <tr
                        key={cand.name}
                        className="hover:bg-slate-50/60 transition-colors"
                      >
                        {/* Rank */}
                        <td className="py-3.5 px-4 font-mono font-bold text-slate-800">
                          {cand.rank === 1 ? (
                            <span className="inline-flex items-center gap-1 text-amber-600">
                              <Trophy className="w-3.5 h-3.5" /> #1
                            </span>
                          ) : (
                            `#${cand.rank}`
                          )}
                        </td>

                        {/* Name */}
                        <td className="py-3.5 px-4">
                          <div className="font-semibold text-slate-900">
                            {cand.name}
                          </div>
                          <div className="text-[11px] text-slate-500 line-clamp-1 max-w-[200px]">
                            {cand.primaryStrength}
                          </div>
                        </td>

                        {/* Overall Score */}
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-2">
                            <span
                              className={`font-mono font-bold text-sm tabular-nums ${tone.text}`}
                            >
                              {cand.overallMatchScore}%
                            </span>
                            <span
                              className={`text-[10px] font-semibold px-1.5 py-0.5 rounded border ${verdictStyle.bgColor} ${verdictStyle.textColor} ${verdictStyle.borderColor}`}
                            >
                              {verdictStyle.label}
                            </span>
                          </div>
                        </td>

                        {/* Skills */}
                        <td className="py-3.5 px-4 font-mono tabular-nums text-slate-700">
                          {cand.skillsScore}%
                        </td>

                        {/* Experience */}
                        <td className="py-3.5 px-4 font-mono tabular-nums text-slate-700">
                          {cand.experienceScore}%
                        </td>

                        {/* Verdict & Key Risk */}
                        <td className="py-3.5 px-4 max-w-xs">
                          <div className="text-slate-700 line-clamp-1 font-medium">
                            {cand.verdictHeadline}
                          </div>
                          <div className="text-[11px] text-rose-600 line-clamp-1 mt-0.5 flex items-center gap-1">
                            <AlertCircle className="w-3 h-3 shrink-0" />
                            <span>Risk: {cand.primaryRisk}</span>
                          </div>
                        </td>

                        {/* Actions */}
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => setSelectedInspectCandidate(cand)}
                              className="px-2.5 py-1 rounded border border-slate-200 text-xs font-medium text-slate-700 hover:bg-slate-100 transition-colors"
                            >
                              Inspect
                            </button>
                            {matchedPreset && (
                              <button
                                onClick={() =>
                                  onSelectCandidateForSingleAnalysis(matchedPreset)
                                }
                                className="px-2.5 py-1 rounded bg-indigo-50 text-indigo-700 border border-indigo-200/70 text-xs font-medium hover:bg-indigo-100 transition-colors flex items-center gap-1"
                                title="Run full single match report"
                              >
                                <span>Deep Dive</span>
                                <ChevronRight className="w-3 h-3" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Quick Inspect Modal */}
          {selectedInspectCandidate && (
            <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-xl border border-slate-200 max-w-lg w-full p-6 shadow-xl">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div>
                    <h3 className="text-base font-bold text-slate-900">
                      {selectedInspectCandidate.name} — Detailed Screening Card
                    </h3>
                    <p className="text-xs text-slate-500">
                      Rank #{selectedInspectCandidate.rank} · {selectedInspectCandidate.overallMatchScore}% Match
                    </p>
                  </div>
                  <button
                    onClick={() => setSelectedInspectCandidate(null)}
                    className="text-slate-400 hover:text-slate-600 text-sm font-mono p-1"
                  >
                    ✕
                  </button>
                </div>

                <div className="mt-4 space-y-3.5 text-xs">
                  <div>
                    <span className="font-semibold text-slate-800 block mb-1">
                      Headline Assessment:
                    </span>
                    <p className="text-slate-600 bg-slate-50 p-2.5 rounded border border-slate-100">
                      {selectedInspectCandidate.verdictHeadline}
                    </p>
                  </div>

                  <div>
                    <span className="font-semibold text-slate-800 block mb-1">
                      Top Matched Skills:
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {selectedInspectCandidate.topMatchedSkills.map((s) => (
                        <span
                          key={s}
                          className="px-2 py-0.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded font-medium"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <span className="font-semibold text-slate-800 block mb-1">
                      Missing Critical Skills:
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {selectedInspectCandidate.missingKeySkills.map((s) => (
                        <span
                          key={s}
                          className="px-2 py-0.5 bg-rose-50 text-rose-800 border border-rose-200 rounded font-medium"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <span className="font-semibold text-slate-800 block mb-0.5">
                      Interview Recommendation:
                    </span>
                    <p className="text-indigo-900 font-medium">
                      {selectedInspectCandidate.interviewRecommendation}
                    </p>
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-100 flex justify-end">
                  <button
                    onClick={() => setSelectedInspectCandidate(null)}
                    className="px-4 py-1.5 rounded-lg bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
