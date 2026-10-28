export interface BreakdownScores {
  hardSkillsScore: number;
  softSkillsScore: number;
  experienceRelevanceScore: number;
  seniorityScore: number;
  educationCertificationsScore: number;
}

export interface SkillsAnalysis {
  matchedSkills: string[];
  missingCriticalSkills: string[];
  transferableOrBonusSkills: string[];
  softSkillsObserved: string[];
}

export interface ExperienceComparison {
  candidateLevel: string;
  requiredLevel: string;
  levelFitExplanation: string;
  keyAchievementsMatched: string[];
  experienceGaps: string[];
}

export interface InterviewQuestion {
  question: string;
  category: string;
  whyAsk: string;
  idealAnswerSignals: string;
}

export type RecommendationVerdict =
  | "STRONG_MATCH"
  | "GOOD_MATCH"
  | "POTENTIAL_WITH_UPSKILLING"
  | "LOW_MATCH";

export interface AnalysisResult {
  candidateName: string;
  candidateTitle: string;
  candidateLocation: string;
  candidateEmail?: string;
  totalExperienceYears: number;
  summary: string;
  overallMatchScore: number;
  recommendationVerdict: RecommendationVerdict;
  verdictHeadline: string;
  verdictRationale: string;
  breakdownScores: BreakdownScores;
  skillsAnalysis: SkillsAnalysis;
  experienceComparison: ExperienceComparison;
  redFlagsOrRisks: string[];
  keyStrengths: string[];
  tailoredInterviewQuestions: InterviewQuestion[];
  actionableSuggestionsForCandidate: string[];
  marketSalaryBenchmark?: string;
  analyzedAt?: string;
  targetJobTitle?: string;
  avatar?: string;
}

export interface JobPreset {
  id: string;
  title: string;
  description: string;
}

export interface CandidatePreset {
  id: string;
  name: string;
  avatar: string;
  currentTitle: string;
  experienceYears: number;
  location: string;
  resumeText: string;
}

export interface BatchCandidateRank {
  id: string;
  name: string;
  rank: number;
  overallMatchScore: number;
  recommendationVerdict: RecommendationVerdict;
  verdictHeadline: string;
  skillsScore: number;
  experienceScore: number;
  topMatchedSkills: string[];
  missingKeySkills: string[];
  primaryStrength: string;
  primaryRisk: string;
  interviewRecommendation: string;
}

export interface BatchAnalysisResult {
  rankedCandidates: BatchCandidateRank[];
  comparativeSummary: string;
  cohortObservations: string;
}

export interface SavedReview {
  id: string;
  savedAt: string;
  candidateName: string;
  targetJobTitle: string;
  overallMatchScore: number;
  verdict: RecommendationVerdict;
  analysis: AnalysisResult;
  notes?: string;
}
