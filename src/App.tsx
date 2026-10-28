import React, { useState, useEffect } from "react";
import { Sidebar } from "./components/Sidebar";
import { Header } from "./components/Header";
import { ResumeInputPanel } from "./components/ResumeInputPanel";
import { CandidateOverviewCard } from "./components/CandidateOverviewCard";
import { ScoreGauge } from "./components/ScoreGauge";
import { SkillsMatrix } from "./components/SkillsMatrix";
import { ExperienceAnalysis } from "./components/ExperienceAnalysis";
import { InterviewGuide } from "./components/InterviewGuide";
import { BatchCompareView } from "./components/BatchCompareView";
import { JdBuilderView } from "./components/JdBuilderView";
import { SavedReviewsView } from "./components/SavedReviewsView";
import {
  AnalysisResult,
  CandidatePreset,
  JobPreset,
  SavedReview,
} from "./types";
import { getSavedReviews, saveReview, deleteSavedReview } from "./utils/helpers";
import { AlertCircle, CheckCircle, Sparkles } from "lucide-react";

export default function App() {
  const [currentView, setCurrentView] = useState<
    "single" | "batch" | "jd-builder" | "saved"
  >("single");

  // Presets
  const [presets, setPresets] = useState<{
    roles: JobPreset[];
    candidates: CandidatePreset[];
  }>({
    roles: [],
    candidates: [],
  });

  // Active form state for single analysis
  const [activeCandidatePreset, setActiveCandidatePreset] =
    useState<CandidatePreset | null>(null);
  const [resumeText, setResumeText] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [weights, setWeights] = useState({
    skills: 40,
    experience: 30,
    seniority: 15,
    education: 15,
  });

  // Analysis result state
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  // Saved reviews
  const [savedReviews, setSavedReviews] = useState<SavedReview[]>([]);
  const [isSaved, setIsSaved] = useState(false);

  // Load presets on mount
  useEffect(() => {
    fetch("/api/presets")
      .then((res) => res.json())
      .then((data) => {
        setPresets(data);
        if (data.roles?.length > 0) {
          setJobTitle(data.roles[0].title);
          setJobDescription(data.roles[0].description);
        }
        if (data.candidates?.length > 0) {
          const firstCand = data.candidates[0];
          setActiveCandidatePreset(firstCand);
          setResumeText(firstCand.resumeText);
        }
      })
      .catch((err) => {
        console.error("Failed to fetch presets:", err);
      });

    setSavedReviews(getSavedReviews());
  }, []);

  const showToast = (msg: string) => {
    setSuccessToast(msg);
    setTimeout(() => setSuccessToast(null), 3000);
  };

  const handleSelectCandidatePreset = (cand: CandidatePreset) => {
    setActiveCandidatePreset(cand);
    setResumeText(cand.resumeText);
    setAnalysis(null);
    setIsSaved(false);
    setErrorMessage(null);
  };

  const handleSelectRolePreset = (role: JobPreset) => {
    setJobTitle(role.title);
    setJobDescription(role.description);
    setAnalysis(null);
    setIsSaved(false);
    setErrorMessage(null);
  };

  const handleRunAnalysis = async (fileData?: {
    base64: string;
    mimeType: string;
  }) => {
    setIsLoading(true);
    setErrorMessage(null);
    setAnalysis(null);
    setIsSaved(false);

    try {
      const payload: any = {
        jobTitle,
        jobDescription,
        weights,
      };

      if (fileData) {
        payload.resumeFileBase64 = fileData.base64;
        payload.resumeFileMimeType = fileData.mimeType;
      } else {
        payload.resumeText = resumeText;
      }

      const res = await fetch("/api/analyze-resume", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to analyze resume");
      }

      const data: AnalysisResult = await res.json();
      data.targetJobTitle = jobTitle;
      data.analyzedAt = new Date().toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
        year: "numeric",
      });

      // Attach avatar if it matched an active preset
      if (activeCandidatePreset) {
        data.avatar = activeCandidatePreset.avatar;
      }

      setAnalysis(data);
      showToast("Candidate evaluation successfully generated!");
    } catch (e: any) {
      console.error(e);
      setErrorMessage(
        e.message || "An unexpected error occurred during profile evaluation."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveReport = () => {
    if (!analysis) return;
    saveReview(analysis);
    setSavedReviews(getSavedReviews());
    setIsSaved(true);
    showToast("Evaluation saved to repository archive!");
  };

  const handleDeleteReview = (id: string) => {
    deleteSavedReview(id);
    setSavedReviews(getSavedReviews());
    showToast("Evaluation removed from archive");
  };

  const handleOpenAnalysisFromArchive = (savedAnalysis: AnalysisResult) => {
    setAnalysis(savedAnalysis);
    setJobTitle(savedAnalysis.targetJobTitle || "Target Role");
    setCurrentView("single");
    setIsSaved(true);
  };

  const handleUseGeneratedJd = (title: string, fullText: string) => {
    setJobTitle(title);
    setJobDescription(fullText);
    setCurrentView("single");
    showToast("Imported generated Job Description into Match Analyzer");
  };

  const handleReset = () => {
    setResumeText("");
    setJobDescription("");
    setJobTitle("");
    setActiveCandidatePreset(null);
    setAnalysis(null);
    setIsSaved(false);
    setErrorMessage(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row antialiased">
      {/* Toast Alert */}
      {successToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white text-xs font-semibold px-4 py-2.5 rounded-lg shadow-lg flex items-center gap-2 border border-slate-700 animate-in fade-in slide-in-from-bottom-2">
          <CheckCircle className="w-4 h-4 text-emerald-400" />
          <span>{successToast}</span>
        </div>
      )}

      {/* Left Sidebar Navigation */}
      <Sidebar
        currentView={currentView}
        setCurrentView={setCurrentView}
        savedCount={savedReviews.length}
        presets={presets}
        onSelectCandidatePreset={handleSelectCandidatePreset}
        onSelectRolePreset={handleSelectRolePreset}
      />

      {/* Main Content Viewport */}
      <div className="flex-1 flex flex-col min-w-0">
        <Header
          currentView={currentView}
          analysis={analysis}
          onReset={handleReset}
          onSaveReport={analysis ? handleSaveReport : undefined}
          isSaved={isSaved}
        />

        <main className="flex-1 p-6 max-w-7xl w-full mx-auto space-y-6">
          {/* Error Banner if any */}
          {errorMessage && (
            <div className="bg-rose-50 border border-rose-200 text-rose-800 p-4 rounded-xl text-xs flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{errorMessage}</span>
              </div>
              <button
                onClick={() => setErrorMessage(null)}
                className="text-rose-600 hover:text-rose-800 font-semibold"
              >
                Dismiss
              </button>
            </div>
          )}

          {/* VIEW: Single Match Analyzer */}
          {currentView === "single" && (
            <div className="space-y-6">
              {/* Input Configuration Box */}
              <ResumeInputPanel
                resumeText={resumeText}
                setResumeText={setResumeText}
                jobDescription={jobDescription}
                setJobDescription={setJobDescription}
                jobTitle={jobTitle}
                setJobTitle={setJobTitle}
                onAnalyze={handleRunAnalysis}
                isLoading={isLoading}
                presets={presets}
                onSelectCandidatePreset={handleSelectCandidatePreset}
                onSelectRolePreset={handleSelectRolePreset}
                activeCandidate={activeCandidatePreset}
                weights={weights}
                setWeights={setWeights}
              />

              {/* Loading Skeleton */}
              {isLoading && (
                <div className="bg-white border border-slate-200 rounded-xl p-8 space-y-6 animate-pulse">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-slate-200 rounded-xl" />
                    <div className="space-y-2 flex-1">
                      <div className="h-5 bg-slate-200 rounded w-1/3" />
                      <div className="h-3.5 bg-slate-200 rounded w-1/4" />
                    </div>
                  </div>
                  <div className="h-24 bg-slate-100 rounded-lg" />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="h-36 bg-slate-100 rounded-lg" />
                    <div className="h-36 bg-slate-100 rounded-lg" />
                  </div>
                </div>
              )}

              {/* Analysis Result Display */}
              {analysis && !isLoading && (
                <div className="space-y-6">
                  {/* Candidate Overview Header */}
                  <CandidateOverviewCard analysis={analysis} />

                  {/* Radial Match Score & Granular Criteria Breakdown */}
                  <ScoreGauge
                    score={analysis.overallMatchScore}
                    verdict={analysis.recommendationVerdict}
                    verdictHeadline={analysis.verdictHeadline}
                    verdictRationale={analysis.verdictRationale}
                    breakdown={analysis.breakdownScores}
                    marketSalaryBenchmark={analysis.marketSalaryBenchmark}
                  />

                  {/* Skills Alignment Matrix */}
                  <SkillsMatrix skills={analysis.skillsAnalysis} />

                  {/* Experience Level & Quantified Evidence */}
                  <ExperienceAnalysis
                    comparison={analysis.experienceComparison}
                    keyStrengths={analysis.keyStrengths}
                    redFlagsOrRisks={analysis.redFlagsOrRisks}
                    actionableSuggestions={analysis.actionableSuggestionsForCandidate}
                  />

                  {/* Tailored Interview Questions & Listening Signals */}
                  <InterviewGuide
                    questions={analysis.tailoredInterviewQuestions}
                    candidateName={analysis.candidateName}
                  />
                </div>
              )}

              {/* Empty state prompt if no analysis yet and not loading */}
              {!analysis && !isLoading && (
                <div className="bg-white border border-dashed border-slate-200/90 rounded-xl p-10 text-center">
                  <div className="w-12 h-12 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 mx-auto mb-3">
                    <Sparkles className="w-6 h-6" />
                  </div>
                  <h3 className="text-sm font-bold text-slate-800">
                    Ready to Benchmark & Screen Candidates
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto leading-relaxed">
                    Select a sample candidate or paste your own resume above to generate an objective match score, verified skills matrix, and tailored interview probes.
                  </p>
                  <button
                    onClick={() => handleRunAnalysis()}
                    disabled={!resumeText.trim()}
                    className="mt-4 px-4 py-2 rounded-lg bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-700 transition-colors inline-flex items-center gap-1.5 shadow-xs"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Run Analysis with Current Inputs</span>
                  </button>
                </div>
              )}
            </div>
          )}

          {/* VIEW: Batch Candidate Screen */}
          {currentView === "batch" && (
            <BatchCompareView
              presets={presets}
              onSelectCandidateForSingleAnalysis={(cand) => {
                handleSelectCandidatePreset(cand);
                setCurrentView("single");
              }}
            />
          )}

          {/* VIEW: JD Architect & Benchmarks */}
          {currentView === "jd-builder" && (
            <JdBuilderView onUseGeneratedJd={handleUseGeneratedJd} />
          )}

          {/* VIEW: Saved Archive */}
          {currentView === "saved" && (
            <SavedReviewsView
              savedReviews={savedReviews}
              onDeleteReview={handleDeleteReview}
              onOpenAnalysis={handleOpenAnalysisFromArchive}
            />
          )}
        </main>
      </div>
    </div>
  );
}
