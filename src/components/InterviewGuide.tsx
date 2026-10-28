import React, { useState } from "react";
import { InterviewQuestion } from "../types";
import { HelpCircle, Copy, Check, Ear, Target } from "lucide-react";

interface InterviewGuideProps {
  questions: InterviewQuestion[];
  candidateName: string;
}

export const InterviewGuide: React.FC<InterviewGuideProps> = ({
  questions,
  candidateName,
}) => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [checkedQuestions, setCheckedQuestions] = useState<Record<number, boolean>>({});

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const toggleChecked = (index: number) => {
    setCheckedQuestions((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  return (
    <div className="bg-white border border-slate-200/80 rounded-xl p-6 shadow-xs">
      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
        <div>
          <h3 className="text-sm font-bold text-slate-900">
            Tailored Interview Questions & Evaluation Rubric
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Role-specific technical probes and verification questions for {candidateName}
          </p>
        </div>
        <div className="text-xs font-mono text-slate-400">
          {questions.length} Targeted Questions
        </div>
      </div>

      <div className="mt-5 space-y-4">
        {questions.map((q, idx) => {
          const isChecked = checkedQuestions[idx];
          const isCopied = copiedIndex === idx;

          return (
            <div
              key={idx}
              className={`rounded-lg border p-4.5 transition-all ${
                isChecked
                  ? "bg-slate-50/70 border-slate-200 opacity-75"
                  : "bg-white border-slate-200/90 hover:border-slate-300"
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <button
                    onClick={() => toggleChecked(idx)}
                    className={`mt-0.5 w-4 h-4 rounded border flex items-center justify-center transition-colors shrink-0 ${
                      isChecked
                        ? "bg-indigo-600 border-indigo-600 text-white"
                        : "border-slate-300 bg-white hover:border-slate-400"
                    }`}
                    title={isChecked ? "Mark unasked" : "Mark asked during interview"}
                  >
                    {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                  </button>

                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[11px] font-semibold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100/60 uppercase tracking-wider">
                        {q.category}
                      </span>
                      <span className="text-xs text-slate-400 font-mono">
                        Probe 0{idx + 1}
                      </span>
                    </div>

                    <h4
                      className={`text-sm font-semibold text-slate-900 leading-snug ${
                        isChecked ? "line-through text-slate-500" : ""
                      }`}
                    >
                      {q.question}
                    </h4>
                  </div>
                </div>

                <button
                  onClick={() => handleCopy(q.question, idx)}
                  className="px-2 py-1 rounded border border-slate-200 text-xs text-slate-500 hover:text-slate-900 hover:bg-slate-50 flex items-center gap-1 shrink-0 transition-colors"
                  title="Copy question text"
                >
                  {isCopied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-emerald-700 font-medium">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>

              {/* Rubric details */}
              <div className="mt-3.5 pt-3 border-t border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="bg-slate-50/60 p-2.5 rounded border border-slate-100">
                  <div className="flex items-center gap-1.5 font-semibold text-slate-700 mb-1">
                    <Target className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Why Ask This Question</span>
                  </div>
                  <p className="text-slate-600 leading-relaxed">{q.whyAsk}</p>
                </div>

                <div className="bg-emerald-50/40 p-2.5 rounded border border-emerald-100/60">
                  <div className="flex items-center gap-1.5 font-semibold text-emerald-900 mb-1">
                    <Ear className="w-3.5 h-3.5 text-emerald-600" />
                    <span>What to Listen For (Positive Signals)</span>
                  </div>
                  <p className="text-slate-600 leading-relaxed">{q.idealAnswerSignals}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
