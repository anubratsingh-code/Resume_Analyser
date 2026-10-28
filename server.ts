import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import { GoogleGenAI, Type } from "@google/genai";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

// Server-side Gemini client per skill guidelines
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      "User-Agent": "aistudio-build",
    },
  },
});

// Preset Sample Data for instant testing
const PRESET_ROLES = [
  {
    id: "senior-fullstack",
    title: "Senior Full-Stack Engineer (React / Node / TypeScript)",
    description: `We are looking for a Senior Full-Stack Engineer with 5+ years of experience building scalable web applications.
Key Requirements:
- 5+ years experience with React, TypeScript, and modern state management.
- Strong proficiency in Node.js, Express/Fastify, RESTful APIs, and GraphQL.
- Hands-on experience with PostgreSQL, Prisma/Drizzle ORM, and Redis caching.
- Production experience with Docker, CI/CD pipelines, and AWS (ECS, S3, CloudFront).
- Demonstrated architectural experience designing microservices or modular monoliths handling high throughput.
- Excellent communication, mentoring junior developers, and writing robust unit and integration tests (Jest/Vitest).
Nice to Have:
- Experience with Next.js App Router, Tailwind CSS, or WebSockets.
- Kubernetes and Terraform infrastructure-as-code knowledge.`,
  },
  {
    id: "lead-devops",
    title: "Lead Cloud Platform & DevOps Engineer",
    description: `Seeking a Lead DevOps Engineer to spearhead our multi-cloud infrastructure and reliability engineering.
Key Requirements:
- 7+ years in DevOps / Site Reliability Engineering roles.
- Expert-level mastery of Kubernetes (EKS/GKE), Helm, and GitOps workflows (ArgoCD).
- Deep Terraform or OpenTofu infrastructure-as-code automation.
- Cloud architecture expertise on AWS and GCP with zero-trust networking and IAM.
- Observability architecture using Prometheus, Grafana, Datadog, and OpenTelemetry.
- Proven track record of 99.99% SLA management, automated disaster recovery, and incident response leadership.
- Scripting in Go or Python for internal developer tooling.`,
  },
  {
    id: "staff-pm",
    title: "Staff Product Manager - B2B AI SaaS",
    description: `We need a high-impact Staff Product Manager to lead our Core AI platform and workflow automation.
Key Requirements:
- 6+ years in product management at high-growth B2B SaaS companies.
- Proven experience launching AI/ML-driven features or developer platform products.
- Exceptional ability to synthesize customer discovery interviews into crisp PRDs and roadmaps.
- Strong quantitative chops: SQL, cohort retention analytics, A/B testing, and North Star metric tracking.
- Experience managing cross-functional squads of engineers, designers, and go-to-market leaders.
- Experience with pricing/packaging optimization and enterprise enterprise sales-assisted loops.`,
  },
];

const PRESET_CANDIDATES = [
  {
    id: "cand-alex",
    name: "Alex Morgan",
    avatar: "/src/assets/images/avatar_candidate_alex_1793174480990.jpg",
    currentTitle: "Senior Software Engineer at Apex Cloud",
    experienceYears: 6.5,
    location: "San Francisco, CA (Open to Remote)",
    resumeText: `Alex Morgan
San Francisco, CA | alex.morgan@email.com | github.com/alexmorgan-dev

PROFESSIONAL SUMMARY
Senior Full-Stack Engineer with 6.5 years building high-performance web applications and distributed backend services. Specialized in TypeScript, React, Node.js, and cloud database optimization. Proven track record scaling API throughput by 300% and mentoring 6 junior/mid engineers.

EXPERIENCE
Apex Cloud — Senior Software Engineer
March 2022 – Present | San Francisco, CA
- Architected and shipped real-time collaboration engine using React, TypeScript, Node.js, and WebSocket, supporting 45,000+ concurrent active sessions.
- Reduced p99 API latency from 420ms to 85ms by migrating core bottlenecks to Redis caching and query restructuring in PostgreSQL with Prisma.
- Spearheaded Dockerized CI/CD migration via GitHub Actions and AWS ECS, cutting deployment failure rates from 14% to under 0.8%.
- Led bi-weekly frontend guild meetings and mentored 4 junior developers on testing best practices (Vitest + Playwright, achieving 88% test coverage).

Veloce Tech — Full-Stack Developer
August 2019 – February 2022 | Austin, TX
- Developed customer billing and subscription portal in React, Tailwind CSS, and Express/Node.js, handling $18M in ARR.
- Built automated reconciliation microservice integrating Stripe Billing and Salesforce webhooks with 99.9% reliability.
- Migrated legacy jQuery front-end to modern modular React single-page app, increasing Lighthouse performance score from 48 to 94.

Nexus Interactive — Junior Web Engineer
June 2018 – July 2019 | Austin, TX
- Implemented responsive landing pages, client portals, and REST endpoints using JavaScript (ES6+), React, and Express.

SKILLS & CERTIFICATIONS
Languages: TypeScript, JavaScript, SQL, Python (intermediate), HTML5/CSS3
Frameworks & Libraries: React 18/19, Next.js, Node.js, Express, Tailwind CSS, Vitest, Jest
Databases & Cloud: PostgreSQL, Redis, MongoDB, AWS (S3, ECS, CloudFront, RDS), Docker, Git
Certifications: AWS Certified Solutions Architect – Associate (2023)
Education: B.S. in Computer Science, University of Texas at Austin (2018)`,
  },
  {
    id: "cand-elena",
    name: "Elena Rostova",
    avatar: "/src/assets/images/avatar_candidate_elena_1793174481917.jpg",
    currentTitle: "Principal Product Lead at Hyperion",
    experienceYears: 8,
    location: "New York, NY (Hybrid)",
    resumeText: `Elena Rostova
New York, NY | elena.rostova@techmail.org | linkedin.com/in/elenarostova

PROFESSIONAL SUMMARY
Results-driven Product Leader with 8 years driving B2B SaaS product innovation and AI-powered workflow tooling. Proven success scaling product revenue from $3M to $28M ARR, managing 12-person cross-functional teams, and defining company-wide OKRs.

EXPERIENCE
Hyperion SaaS — Lead Product Manager (Core Platform & AI)
January 2021 – Present | New York, NY
- Championed company's flagship Generative AI copilot, resulting in 42% increase in weekly active user retention and $9.4M in new enterprise ARR within 9 months.
- Led cross-functional team of 14 engineers, 2 UX designers, and 1 data scientist through agile discovery, PRD writing, and bi-weekly sprint planning.
- Restructured enterprise tier packaging, boosting average contract value (ACV) by 34% with zero churn increase.
- Built executive dashboards in SQL and Amplitude tracking North Star metrics, cohort retention, and feature drop-off funnels.

Stratum Analytics — Senior Product Manager
June 2018 – December 2020 | Boston, MA
- Managed data visualization and custom reporting suite used by Fortune 500 financial analysts.
- Conducted 100+ user research interviews to define next-gen spreadsheet export and real-time streaming charts.
- Increased Net Promoter Score (NPS) from +28 to +61 through strategic UX overhaul and bug bash prioritization.

EDUCATION & SKILLS
Skills: Product Discovery, PRDs, Roadmap Planning, SQL, Amplitude, Mixpanel, A/B Testing, Agile/Scrum, User Journey Mapping
Education: B.A. in Economics & Computer Science, Columbia University; Pragmatic Institute Certified (PMC-III)`,
  },
  {
    id: "cand-marcus",
    name: "Marcus Vance",
    avatar: "/src/assets/images/avatar_candidate_marcus_1793174481200.jpg",
    currentTitle: "Senior DevOps & Infrastructure Engineer",
    experienceYears: 7,
    location: "Seattle, WA (Remote)",
    resumeText: `Marcus Vance
Seattle, WA | marcus.vance@infranet.io | github.com/marcusvance-ops

PROFESSIONAL SUMMARY
Senior Cloud Platform & DevOps Engineer with 7 years architecting resilient Kubernetes infrastructure, zero-trust cloud security, and multi-region AWS/GCP deployments. Passionate about GitOps, self-healing systems, and developer velocity.

EXPERIENCE
Skyline Cloud Systems — Staff Platform Engineer
September 2021 – Present | Seattle, WA
- Designed and maintained 18 multi-tenant Kubernetes clusters (EKS) hosting 140+ microservices with 99.995% uptime SLA.
- Standardized infrastructure-as-code using Terraform modules, reducing new cloud environment provisioning time from 4 days to 18 minutes.
- Implemented GitOps delivery pipeline with ArgoCD and Helm, enabling 80+ daily automated production releases with zero downtime.
- Engineered centralized observability stack using Prometheus, Grafana Loki, and OpenTelemetry, trimming mean time to resolution (MTTR) by 54%.

DataStream Global — DevOps Engineer
January 2018 – August 2021 | Denver, CO
- Migrated 45 monolithic services from bare metal to AWS containerized ECS and RDS PostgreSQL clusters.
- Configured Cloudflare Enterprise CDN, WAF, and DDoS mitigation rules, defending against 20Gbps sustained volumetric attacks.
- Authored custom Python and Go automation CLI for developers to spin up isolated ephemeral review environments.

SKILLS & CERTIFICATIONS
Certifications: CKA (Certified Kubernetes Administrator), AWS Solutions Architect Professional, HashiCorp Certified Terraform Associate
Skills: Kubernetes, Helm, ArgoCD, Terraform, AWS, GCP, Docker, Prometheus, Grafana, OpenTelemetry, Go, Python, Bash, CI/CD`,
  },
];

// Presets endpoint
app.get("/api/presets", (_req, res) => {
  res.json({
    roles: PRESET_ROLES,
    candidates: PRESET_CANDIDATES,
  });
});

// Generate Job Description endpoint
app.post("/api/generate-jd", async (req, res) => {
  try {
    const { title, seniority = "Senior", industry = "Technology", keySkills = "" } = req.body;
    if (!title) {
      return res.status(400).json({ error: "Job title is required" });
    }

    const prompt = `Generate a realistic, professional, and comprehensive Job Description for:
Role: ${title}
Seniority: ${seniority}
Industry: ${industry}
Key Desired Skills: ${keySkills || "Industry standard modern technologies"}

Provide output strictly in JSON format with:
- "title": Job title with seniority
- "summary": 2-3 sentence role mission
- "responsibilities": array of 5-7 clear bullet points
- "requiredQualifications": array of 5-7 must-have skills/experience
- "preferredQualifications": array of 3-5 nice-to-have skills
- "fullText": formatted plain text version suitable for pasting`;

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    const parsed = JSON.parse(response.text || "{}");
    res.json(parsed);
  } catch (error: any) {
    console.error("Error generating JD:", error);
    res.status(500).json({ error: error.message || "Failed to generate job description" });
  }
});

// Single Resume Match Analyzer
app.post("/api/analyze-resume", async (req, res) => {
  try {
    const {
      resumeText,
      resumeFileBase64,
      resumeFileMimeType,
      jobTitle = "Target Role",
      jobDescription,
      weights = {
        skills: 40,
        experience: 30,
        seniority: 15,
        education: 15,
      },
    } = req.body;

    if (!jobDescription || (!resumeText && !resumeFileBase64)) {
      return res.status(400).json({
        error: "Both a Resume (text or file) and Job Description are required for analysis.",
      });
    }

    const systemInstruction = `You are an elite Executive Talent Acquisition & Technical Staffing AI Analyst.
Your job is to rigorously evaluate a candidate's resume against a specific Job Description (JD).
Be objective, discerning, and evidence-based. Never hallucinate claims that are not supported by the resume text.

Scoring Guidelines:
- Overall Match Score (0 to 100): Weighted calculation based on:
  * Hard Skills Fit (0-100)
  * Experience & Domain Relevance (0-100)
  * Seniority & Scope Fit (0-100)
  * Education / Certifications (0-100)
- Recommendation Verdict:
  * "STRONG_MATCH" (85-100): Meets virtually all core requirements and has verified track record.
  * "GOOD_MATCH" (70-84): Meets primary requirements with minor gap in secondary tools or domain.
  * "POTENTIAL_WITH_UPSKILLING" (50-69): Strong adjacent foundations but missing critical stack elements.
  * "LOW_MATCH" (<50): Misaligned experience level, domain, or core stack.

Generate a comprehensive, actionable response in strict JSON conforming to the requested schema.`;

    const promptText = `TARGET JOB TITLE: ${jobTitle}

TARGET JOB DESCRIPTION:
${jobDescription}

SCORING WEIGHT PREFERENCES:
- Hard Skills: ${weights.skills}%
- Experience Relevance: ${weights.experience}%
- Seniority & Scope: ${weights.seniority}%
- Education & Certifications: ${weights.education}%

${resumeText ? `CANDIDATE RESUME CONTENT:\n${resumeText}` : "Analyze the attached resume file against the target Job Description above."}

Perform deep parsing and provide a complete analysis JSON object with:
{
  "candidateName": "Extracted or inferred full name",
  "candidateTitle": "Current or most recent professional title",
  "candidateLocation": "City/Region/Remote preference",
  "candidateEmail": "Email address if present, else empty string",
  "totalExperienceYears": 5.5,
  "summary": "2-3 sentence executive synopsis of candidate profile",
  "overallMatchScore": 84,
  "recommendationVerdict": "STRONG_MATCH",
  "verdictHeadline": "One clear punchy takeaway line",
  "verdictRationale": "Detailed justification explaining why this verdict was chosen",
  "breakdownScores": {
    "hardSkillsScore": 88,
    "softSkillsScore": 82,
    "experienceRelevanceScore": 85,
    "seniorityScore": 80,
    "educationCertificationsScore": 85
  },
  "skillsAnalysis": {
    "matchedSkills": ["TypeScript", "React", "Node.js", "PostgreSQL", "Docker"],
    "missingCriticalSkills": ["GraphQL", "Terraform"],
    "transferableOrBonusSkills": ["Prisma", "Vitest", "Playwright", "Stripe API"],
    "softSkillsObserved": ["Mentoring", "Cross-functional collaboration", "Agile leadership"]
  },
  "experienceComparison": {
    "candidateLevel": "Senior",
    "requiredLevel": "Senior",
    "levelFitExplanation": "Detailed assessment of years and leadership scope",
    "keyAchievementsMatched": [
      "Quantified achievement 1 from resume proving JD requirement",
      "Quantified achievement 2 from resume proving JD requirement"
    ],
    "experienceGaps": [
      "Specific domain or tech stack gap if any"
    ]
  },
  "redFlagsOrRisks": [
    "Potential risk or lack of verification (e.g. short tenure, missing specific cloud provider)"
  ],
  "keyStrengths": [
    "Top standout asset 1",
    "Top standout asset 2",
    "Top standout asset 3"
  ],
  "tailoredInterviewQuestions": [
    {
      "question": "Specific, probing question designed to verify a key requirement or test a potential gap",
      "category": "Technical Architecture",
      "whyAsk": "Reason this question is critical for this candidate",
      "idealAnswerSignals": "Key concepts or metrics the interviewer should listen for"
    }
  ],
  "actionableSuggestionsForCandidate": [
    "Concrete tip to strengthen resume or narrative for this role"
  ],
  "marketSalaryBenchmark": "Estimated competitive salary range based on role & candidate seniority"
}`;

    let contentsPayload: any;
    if (resumeFileBase64 && resumeFileMimeType) {
      contentsPayload = {
        parts: [
          {
            inlineData: {
              data: resumeFileBase64,
              mimeType: resumeFileMimeType,
            },
          },
          {
            text: promptText,
          },
        ],
      };
    } else {
      contentsPayload = promptText;
    }

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: contentsPayload,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
      },
    });

    const parsed = JSON.parse(response.text || "{}");
    res.json(parsed);
  } catch (error: any) {
    console.error("Error in /api/analyze-resume:", error);
    res.status(500).json({
      error: error.message || "Failed to analyze candidate profile",
    });
  }
});

// Batch Comparison Endpoint
app.post("/api/batch-compare", async (req, res) => {
  try {
    const { candidates, jobTitle, jobDescription } = req.body;

    if (!jobDescription || !Array.isArray(candidates) || candidates.length === 0) {
      return res.status(400).json({
        error: "Job description and a list of candidates are required for batch matching.",
      });
    }

    const prompt = `You are an elite Talent Acquisition Lead comparing multiple candidate profiles against a target Job Description.

TARGET JOB TITLE: ${jobTitle || "Target Role"}
TARGET JOB DESCRIPTION:
${jobDescription}

CANDIDATES TO EVALUATE:
${candidates
  .map(
    (c: any, i: number) => `--- CANDIDATE #${i + 1}: ${c.name} (${c.currentTitle || "Applicant"}) ---
${c.resumeText}
`
  )
  .join("\n\n")}

Evaluate and rank all candidates side-by-side. Return a JSON object with:
{
  "rankedCandidates": [
    {
      "id": "candidate id from input or generated",
      "name": "Candidate name",
      "rank": 1,
      "overallMatchScore": 92,
      "recommendationVerdict": "STRONG_MATCH",
      "verdictHeadline": "Brief summary rationale",
      "skillsScore": 95,
      "experienceScore": 90,
      "topMatchedSkills": ["React", "TypeScript", "Node.js"],
      "missingKeySkills": ["Terraform"],
      "primaryStrength": "Strong architectural track record and high test coverage",
      "primaryRisk": "Less Terraform experience than preferred",
      "interviewRecommendation": "Proceed to round 1"
    }
  ],
  "comparativeSummary": "Executive summary highlighting who the top contender is and why",
  "cohortObservations": "General trends observed across the candidate pool"
}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    const parsed = JSON.parse(response.text || "{}");
    res.json(parsed);
  } catch (error: any) {
    console.error("Error in /api/batch-compare:", error);
    res.status(500).json({
      error: error.message || "Failed to run batch candidate comparison",
    });
  }
});

// Vite middleware in dev or static dist in production
if (process.env.NODE_ENV !== "production") {
  const { createServer: createViteServer } = await import("vite");
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: "spa",
  });
  app.use(vite.middlewares);
} else {
  app.use(express.static(path.resolve(__dirname, "dist")));
  app.get("*", (_req, res) => {
    res.sendFile(path.resolve(__dirname, "dist", "index.html"));
  });
}

app.listen(port, () => {
  console.log(`TalentMatch AI server running at http://localhost:${port}`);
});
