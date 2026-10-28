import React, { useState } from "react";
import { SavedReview, AnalysisResult } from "../types";
import { formatVerdict, getScoreTone, exportAnalysisAsMarkdown } from "../utils/helpers";
import {
  BookmarkCheck,
  Search,
  Trash2,
  Download,
  Eye,
  ExternalLink,
} from "lucide-react";

interface SavedReviewsViewProps {
  savedReviews: SavedReview[];
  onDeleteReview: (id: string) => void;
  onOpenAnalysis: (analysis: AnalysisResult) => void;
}

export const SavedReviewsView: React.FC<SavedReviewsViewProps> = ({
  savedReviews,
  onDeleteReview,
  onOpenAnalysis,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [verdictFilter, setVerdictFilter] = useState<string>("ALL");

  const filtered = savedReviews.filter((item) => {
    const matchesSearch =
      item.candidateName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.targetJobTitle.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesVerdict =
      verdictFilter === "ALL" || item.verdict === verdictFilter;

    return matchesSearch && matchesVerdict;
  });

  return (
    <div className="space-y-6">
      <div className="bg-white border border-slate-200/80 rounded-xl p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-3">
          <div>
            <h2 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <BookmarkCheck className="w-5 h-5 text-indigo-600" />
              <span>Archived Candidate Evaluations & Rubrics</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Persistent repository of screened candidates, match scores, and interview probes
            </p>
          </div>

          <div className="text-xs font-mono text-slate-500">
            {savedReviews.length} Records Saved
          </div>
        </div>

        {/* Filters & Search */}
        <div className="mt-4 flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search candidate name or role title..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>

          <div className="flex items-center gap-1 self-start sm:self-auto bg-slate-100 p-1 rounded-lg">
            {["ALL", "STRONG_MATCH", "GOOD_MATCH", "POTENTIAL_WITH_UPSKILLING"].map(
              (v) => (
                <button
                  key={v}
                  onClick={() => setVerdictFilter(v)}
                  className={`px-2.5 py-1 text-[11px] font-medium rounded-md transition-colors ${
                    verdictFilter === v
                      ? "bg-white text-slate-900 shadow-xs"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  {v === "ALL"
                    ? "All"
                    : v === "STRONG_MATCH"
                    ? "Strong"
                    : v === "GOOD_MATCH"
                    ? "Good"
                    : "Upskilling"}
                </button>
              )
            )}
          </div>
        </div>
      </div>

      {/* Grid or Empty State */}
      {filtered.length === 0 ? (
        <div className="bg-white border border-slate-200/80 rounded-xl p-12 text-center shadow-xs">
          <BookmarkCheck className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-sm font-semibold text-slate-800">
            No evaluations match your search
          </h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Run an analysis in the Single Match Analyzer and click "Save Evaluation" to store candidates here.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((rev) => {
            const verdictStyle = formatVerdict(rev.verdict);
            const tone = getScoreTone(rev.overallMatchScore);

            return (
              <div
                key={rev.id}
                className="bg-white border border-slate-200/80 rounded-xl p-5 shadow-xs hover:border-indigo-300 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      {rev.analysis.avatar ? (
                        <img
                          src={rev.analysis.avatar}
                          alt={rev.candidateName}
                          className="w-10 h-10 rounded-lg object-cover border border-slate-200 shrink-0"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-lg bg-indigo-50 border border-indigo-200 text-indigo-700 font-bold text-sm flex items-center justify-center shrink-0">
                          {rev.candidateName.slice(0, 2)}
                        </div>
                      )}
                      <div>
                        <h4 className="text-sm font-bold text-slate-900">
                          {rev.candidateName}
                        </h4>
                        <div className="text-xs text-slate-500 truncate max-w-[200px]">
                          {rev.targetJobTitle}
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <span
                        className={`font-mono text-base font-extrabold tabular-nums block ${tone.text}`}
                      >
                        {rev.overallMatchScore}%
                      </span>
                      <span
                        className={`text-[10px] font-semibold px-1.5 py-0.5 rounded border inline-block ${verdictStyle.bgColor} ${verdictStyle.textColor} ${verdictStyle.borderColor}`}
                      >
                        {verdictStyle.label}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 mt-3 line-clamp-2 leading-relaxed bg-slate-50/50 p-2 rounded">
                    {rev.analysis.verdictHeadline}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                  <span className="font-mono text-[11px]">
                    Saved {new Date(rev.savedAt).toLocaleDateString()}
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => exportAnalysisAsMarkdown(rev.analysis)}
                      className="p-1.5 rounded hover:bg-slate-100 text-slate-500 hover:text-slate-800"
                      title="Download Report"
                    >
                      <Download className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => onDeleteReview(rev.id)}
                      className="p-1.5 rounded hover:bg-rose-50 text-slate-400 hover:text-rose-600"
                      title="Delete Record"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => onOpenAnalysis(rev.analysis)}
                      className="px-2.5 py-1 rounded bg-indigo-50 text-indigo-700 font-semibold hover:bg-indigo-100 flex items-center gap-1"
                    >
                      <span>Open Review</span>
                      <ExternalLink className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
