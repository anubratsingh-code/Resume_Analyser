import React, { useState } from "react";
import {
  Upload,
  FileText,
  Sliders,
  Sparkles,
  ChevronDown,
  ChevronUp,
  X,
  FileCheck,
} from "lucide-react";
import { CandidatePreset, JobPreset } from "../types";

interface ResumeInputPanelProps {
  resumeText: string;
  setResumeText: (text: string) => void;
  jobDescription: string;
  setJobDescription: (text: string) => void;
  jobTitle: string;
  setJobTitle: (title: string) => void;
  onAnalyze: (fileData?: { base64: string; mimeType: string }) => void;
  isLoading: boolean;
  presets: {
    roles: JobPreset[];
    candidates: CandidatePreset[];
  };
  onSelectCandidatePreset: (cand: CandidatePreset) => void;
  onSelectRolePreset: (role: JobPreset) => void;
  activeCandidate?: CandidatePreset | null;
  weights: {
    skills: number;
    experience: number;
    seniority: number;
    education: number;
  };
  setWeights: React.Dispatch<
    React.SetStateAction<{
      skills: number;
      experience: number;
      seniority: number;
      education: number;
    }>
  >;
}

export const ResumeInputPanel: React.FC<ResumeInputPanelProps> = ({
  resumeText,
  setResumeText,
  jobDescription,
  setJobDescription,
  jobTitle,
  setJobTitle,
  onAnalyze,
  isLoading,
  presets,
  onSelectCandidatePreset,
  onSelectRolePreset,
  activeCandidate,
  weights,
  setWeights,
}) => {
  const [showWeights, setShowWeights] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<{
    name: string;
    size: string;
    base64: string;
    mimeType: string;
  } | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();

    if (file.type === "application/pdf" || file.type.startsWith("image/")) {
      reader.onload = () => {
        const resultStr = reader.result as string;
        // strip data:...;base64, prefix
        const base64Data = resultStr.split(",")[1];
        setUploadedFile({
          name: file.name,
          size: `${(file.size / 1024).toFixed(1)} KB`,
          base64: base64Data,
          mimeType: file.type,
        });
      };
      reader.readAsDataURL(file);
    } else {
      // Plain text, markdown, doc
      reader.onload = () => {
        const text = reader.result as string;
        setResumeText(text);
        setUploadedFile({
          name: file.name,
          size: `${(file.size / 1024).toFixed(1)} KB`,
          base64: "",
          mimeType: file.type || "text/plain",
        });
      };
      reader.readAsText(file);
    }
  };

  const removeUploadedFile = () => {
    setUploadedFile(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (uploadedFile?.base64) {
      onAnalyze({
        base64: uploadedFile.base64,
        mimeType: uploadedFile.mimeType,
      });
    } else {
      onAnalyze();
    }
  };

  return (
    <div className="bg-white border border-slate-200/80 rounded-xl p-6 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-3">
        <div>
          <h2 className="text-base font-bold text-slate-900 tracking-tight">
            Configure Match Analysis
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Compare candidate resume against target Job Description
          </p>
        </div>

        {/* Weights Accordion Button */}
        <button
          type="button"
          onClick={() => setShowWeights(!showWeights)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-medium text-slate-700 hover:bg-slate-50 self-start sm:self-auto transition-colors"
        >
          <Sliders className="w-3.5 h-3.5 text-slate-500" />
          <span>Evaluation Weights</span>
          {showWeights ? (
            <ChevronUp className="w-3.5 h-3.5" />
          ) : (
            <ChevronDown className="w-3.5 h-3.5" />
          )}
        </button>
      </div>

      {/* Optional Weights Sliders */}
      {showWeights && (
        <div className="mt-4 p-4 bg-slate-50 rounded-lg border border-slate-200/60 text-xs">
          <div className="font-semibold text-slate-800 mb-2">
            Customize Match Weighting Allocation
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <div className="flex justify-between text-slate-600 mb-1">
                <span>Hard Skills:</span>
                <span className="font-mono font-semibold tabular-nums">{weights.skills}%</span>
              </div>
              <input
                type="range"
                min="10"
                max="70"
                value={weights.skills}
                onChange={(e) =>
                  setWeights((prev) => ({ ...prev, skills: Number(e.target.value) }))
                }
                className="w-full accent-indigo-600"
              />
            </div>

            <div>
              <div className="flex justify-between text-slate-600 mb-1">
                <span>Experience:</span>
                <span className="font-mono font-semibold tabular-nums">{weights.experience}%</span>
              </div>
              <input
                type="range"
                min="10"
                max="60"
                value={weights.experience}
                onChange={(e) =>
                  setWeights((prev) => ({ ...prev, experience: Number(e.target.value) }))
                }
                className="w-full accent-indigo-600"
              />
            </div>

            <div>
              <div className="flex justify-between text-slate-600 mb-1">
                <span>Seniority:</span>
                <span className="font-mono font-semibold tabular-nums">{weights.seniority}%</span>
              </div>
              <input
                type="range"
                min="5"
                max="40"
                value={weights.seniority}
                onChange={(e) =>
                  setWeights((prev) => ({ ...prev, seniority: Number(e.target.value) }))
                }
                className="w-full accent-indigo-600"
              />
            </div>

            <div>
              <div className="flex justify-between text-slate-600 mb-1">
                <span>Education:</span>
                <span className="font-mono font-semibold tabular-nums">{weights.education}%</span>
              </div>
              <input
                type="range"
                min="5"
                max="30"
                value={weights.education}
                onChange={(e) =>
                  setWeights((prev) => ({ ...prev, education: Number(e.target.value) }))
                }
                className="w-full accent-indigo-600"
              />
            </div>
          </div>
        </div>
      )}

      {/* Two Main Inputs Form */}
      <form onSubmit={handleSubmit} className="mt-5 space-y-5">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column: Target Job Description */}
          <div className="flex flex-col">
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-indigo-600" />
                <span>Target Job Description</span>
              </label>

              {/* Preset quick pills */}
              <div className="flex items-center gap-1">
                <span className="text-[11px] text-slate-400">Presets:</span>
                {presets.roles.map((r, i) => (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => onSelectRolePreset(r)}
                    className="text-[11px] text-slate-600 hover:text-indigo-600 px-1.5 py-0.5 rounded hover:bg-slate-100 transition-colors"
                  >
                    {i === 0 ? "FullStack" : i === 1 ? "DevOps" : "Product"}
                  </button>
                ))}
              </div>
            </div>

            <input
              type="text"
              placeholder="Role Title (e.g. Senior Full-Stack Engineer)"
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
              className="w-full mb-2 px-3 py-2 text-xs font-medium rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-slate-50/50"
            />

            <textarea
              required
              rows={11}
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste the target job description, required qualifications, tech stack, and responsibilities..."
              className="w-full flex-1 p-3 text-xs text-slate-700 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 resize-none font-mono leading-relaxed"
            />
          </div>

          {/* Right Column: Candidate Resume */}
          <div className="flex flex-col">
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <FileCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Candidate Profile / Resume</span>
              </label>

              {/* Preset candidate picks */}
              <div className="flex items-center gap-1">
                <span className="text-[11px] text-slate-400">Sample:</span>
                {presets.candidates.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => {
                      setUploadedFile(null);
                      onSelectCandidatePreset(c);
                    }}
                    className={`text-[11px] px-1.5 py-0.5 rounded transition-colors ${
                      activeCandidate?.id === c.id
                        ? "text-indigo-700 font-semibold bg-indigo-50"
                        : "text-slate-600 hover:text-indigo-600 hover:bg-slate-100"
                    }`}
                  >
                    {c.name.split(" ")[0]}
                  </button>
                ))}
              </div>
            </div>

            {/* File Upload Strip */}
            <div className="mb-2 flex items-center justify-between p-2 rounded-lg border border-dashed border-slate-300 bg-slate-50/70 hover:bg-slate-50 transition-colors">
              <label className="cursor-pointer flex items-center gap-2 text-xs text-slate-600 hover:text-indigo-600 font-medium">
                <Upload className="w-3.5 h-3.5 text-slate-500" />
                <span>Upload Resume (PDF, DOCX, TXT, or Image)</span>
                <input
                  type="file"
                  accept=".pdf,.txt,.md,.doc,.docx,image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>

              {uploadedFile && (
                <div className="flex items-center gap-2 text-xs text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                  <span className="truncate max-w-[140px] font-mono">{uploadedFile.name}</span>
                  <span className="text-[10px] text-slate-400">({uploadedFile.size})</span>
                  <button
                    type="button"
                    onClick={removeUploadedFile}
                    className="text-slate-400 hover:text-rose-600"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              )}
            </div>

            {/* Resume Text Area */}
            {uploadedFile?.base64 ? (
              <div className="flex-1 p-6 border border-slate-200 rounded-lg bg-slate-50 flex flex-col items-center justify-center text-center">
                <FileCheck className="w-10 h-10 text-indigo-600 mb-2" />
                <span className="text-xs font-semibold text-slate-800">
                  PDF / Document Loaded: {uploadedFile.name}
                </span>
                <span className="text-[11px] text-slate-500 mt-1 max-w-xs">
                  Gemini multimodal parser will process the complete document structure, typography, and certifications directly.
                </span>
                <button
                  type="button"
                  onClick={removeUploadedFile}
                  className="mt-3 text-xs text-rose-600 hover:underline"
                >
                  Remove or switch to text paste
                </button>
              </div>
            ) : (
              <textarea
                required={!uploadedFile}
                rows={11}
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value)}
                placeholder="Paste candidate's full resume text, work experience, tech stack, and achievements..."
                className="w-full flex-1 p-3 text-xs text-slate-700 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 resize-none font-mono leading-relaxed"
              />
            )}
          </div>
        </div>

        {/* Submit Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between pt-4 border-t border-slate-100 gap-3">
          <div className="text-xs text-slate-500">
            {activeCandidate ? (
              <span className="flex items-center gap-2">
                <img
                  src={activeCandidate.avatar}
                  alt={activeCandidate.name}
                  className="w-5 h-5 rounded-full object-cover border border-slate-200"
                />
                <span>Active Profile: <strong>{activeCandidate.name}</strong> ({activeCandidate.experienceYears}y exp)</span>
              </span>
            ) : (
              <span>Ready for customized evaluation & question generation</span>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading || (!resumeText.trim() && !uploadedFile)}
            className="w-full sm:w-auto px-6 py-2.5 rounded-lg bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-700 active:scale-[0.99] transition-all flex items-center justify-center gap-2 shadow-xs disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Analyzing Profile with Gemini 3.8 Flash...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Run Match Analysis</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
