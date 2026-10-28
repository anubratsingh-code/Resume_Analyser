import React, { useState } from "react";
import { Sparkles, Copy, Check, ArrowRight, FileCheck, Layers } from "lucide-react";

interface JdBuilderViewProps {
  onUseGeneratedJd: (title: string, fullText: string) => void;
}

export const JdBuilderView: React.FC<JdBuilderViewProps> = ({
  onUseGeneratedJd,
}) => {
  const [title, setTitle] = useState("Staff AI Application Engineer");
  const [seniority, setSeniority] = useState("Staff");
  const [industry, setIndustry] = useState("Enterprise AI & Cloud SaaS");
  const [keySkills, setKeySkills] = useState(
    "TypeScript, React, Node.js, Python, LLM API integration, Vector DBs, System Design"
  );
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedJd, setGeneratedJd] = useState<any>(null);
  const [copied, setCopied] = useState(false);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;
    setIsGenerating(true);
    setGeneratedJd(null);

    try {
      const res = await fetch("/api/generate-jd", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          seniority,
          industry,
          keySkills,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to generate JD");
      }

      const data = await res.json();
      setGeneratedJd(data);
    } catch (e: any) {
      alert(e.message || "Failed to generate job description");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = () => {
    if (!generatedJd) return;
    const textToCopy =
      generatedJd.fullText ||
      `${generatedJd.title}\n\n${generatedJd.summary}\n\nRESPONSIBILITIES:\n${generatedJd.responsibilities?.map((r: string) => `- ${r}`).join("\n")}\n\nREQUIRED:\n${generatedJd.requiredQualifications?.map((r: string) => `- ${r}`).join("\n")}`;

    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Configuration Card */}
      <div className="bg-white border border-slate-200/80 rounded-xl p-6 shadow-xs">
        <div className="pb-4 border-b border-slate-100">
          <h2 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Layers className="w-5 h-5 text-indigo-600" />
            <span>Job Description Architect & Competency Benchmark</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Formulate high-precision, industry-calibrated job descriptions with concrete qualifications to calibrate resume screening
          </p>
        </div>

        <form onSubmit={handleGenerate} className="mt-5 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Target Role Title
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Senior Backend Engineer"
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Seniority Level
              </label>
              <select
                value={seniority}
                onChange={(e) => setSeniority(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 bg-white"
              >
                <option value="Junior">Junior (0-2 years)</option>
                <option value="Mid-Level">Mid-Level (3-5 years)</option>
                <option value="Senior">Senior (5-8 years)</option>
                <option value="Staff / Lead">Staff / Lead (8-12 years)</option>
                <option value="Principal / Director">Principal / Director (12+ years)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Industry Domain
              </label>
              <input
                type="text"
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                placeholder="e.g. FinTech, B2B SaaS, HealthTech"
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Desired Core Competencies & Tech Stack
            </label>
            <input
              type="text"
              value={keySkills}
              onChange={(e) => setKeySkills(e.target.value)}
              placeholder="e.g. TypeScript, React, Go, Kafka, Distributed Systems"
              className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 font-mono"
            />
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={isGenerating}
              className="px-5 py-2 rounded-lg bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-700 transition-colors flex items-center gap-2 disabled:opacity-50"
            >
              {isGenerating ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Drafting Calibrated JD...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Architect Job Description</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Generated JD View */}
      {generatedJd && (
        <div className="bg-white border border-slate-200/80 rounded-xl p-6 shadow-xs">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                {generatedJd.title}
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Calibrated against {seniority} level benchmarks in {industry}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleCopy}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-emerald-700 font-medium">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Text</span>
                  </>
                )}
              </button>

              <button
                onClick={() =>
                  onUseGeneratedJd(
                    generatedJd.title,
                    generatedJd.fullText ||
                      `${generatedJd.title}\n\n${generatedJd.summary}\n\nRequired Qualifications:\n${generatedJd.requiredQualifications?.join("\n")}`
                  )
                }
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-700 transition-colors"
              >
                <span>Use in Match Analyzer</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div className="mt-5 space-y-5 text-xs text-slate-700">
            <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200/60 leading-relaxed">
              <strong className="text-slate-900 block mb-1">Role Mission:</strong>
              {generatedJd.summary}
            </div>

            <div>
              <div className="font-bold text-slate-900 uppercase tracking-wider text-[11px] mb-2">
                Key Responsibilities
              </div>
              <ul className="space-y-1.5 pl-4 list-disc marker:text-indigo-500">
                {generatedJd.responsibilities?.map((item: string, i: number) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>

            <div>
              <div className="font-bold text-slate-900 uppercase tracking-wider text-[11px] mb-2">
                Required Qualifications & Must-Have Stack
              </div>
              <ul className="space-y-1.5 pl-4 list-disc marker:text-emerald-500">
                {generatedJd.requiredQualifications?.map(
                  (item: string, i: number) => (
                    <li key={i}>{item}</li>
                  )
                )}
              </ul>
            </div>

            {generatedJd.preferredQualifications && (
              <div>
                <div className="font-bold text-slate-900 uppercase tracking-wider text-[11px] mb-2">
                  Preferred / Nice-to-Have
                </div>
                <ul className="space-y-1.5 pl-4 list-disc marker:text-indigo-400">
                  {generatedJd.preferredQualifications.map(
                    (item: string, i: number) => (
                      <li key={i}>{item}</li>
                    )
                  )}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
