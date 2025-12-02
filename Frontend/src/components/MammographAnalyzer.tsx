import { useState, useRef, useEffect, useMemo, useCallback } from "react";
import type {
  PointerEvent as ReactPointerEvent,
  WheelEvent as ReactWheelEvent,
  CSSProperties,
} from "react";
import { useLocation } from "react-router-dom";
import {
  Upload,
  ZoomIn,
  ZoomOut,
  Download,
  CheckCircle,
  Info,
  ChevronRight,
  Sparkles,
  Cpu,
  Clock4,
  CalendarDays,
  Target,
  Move,
  Maximize2,
  Sun,
  Moon,
  ChevronLeft,
  ArrowLeft,
  Save,
  Loader2,
  Play,
} from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import NewNavigation from "./NewNavigation";
import { Progress } from "./ui/progress";
import { useNewPatient } from "../context/NewPatientContext";

const cx = (...classes: Array<string | null | false | undefined>) =>
  classes.filter(Boolean).join(" ");

type ThemeMode = "light" | "dark";

type DetectionSuspicion = "high" | "moderate" | "low";

type AnalyzerFinding = {
  id: string;
  type: string;
  location: string;
  size: string;
  severity: DetectionSuspicion;
  confidence: number;
  birads: string;
};

type AnalyzerDetection = {
  id: string;
  label: string;
  type: string;
  confidence: number;
  size: string;
  birads: string;
  description: string;
  suspicion: DetectionSuspicion;
  center: { x: number; y: number };
  radii: { x: number; y: number };
  annotation: {
    anchor: "left" | "right";
    offsetX: number;
    offsetY: number;
  };
};

type AnalyzerData = {
  overall: string;
  confidence: number;
  birads: string;
  findings: {
    keyFindings: string[];
    recommendations: Array<{ action: string; rationale: string }>;
    disclaimer: string;
  };
  oldFindings?: AnalyzerFinding[];
  recommendations: string[];
  detections: AnalyzerDetection[];
  assessment: {
    breastDensity: {
      severity: "low" | "moderate" | "high";
      category: string;
      description: string;
    };
    biradsCategory: {
      severity: "low" | "moderate" | "high";
      category: string;
      description: string;
      recommendation: string;
    };
    riskScore: number;
  };
  modelVersion: string;
  inferenceTimeMs: number;
  generatedAt: string;
};

type AnalyzerPrefillState = {
  patientId?: number | string;
  lastScan?: string;
  totalScans?: number;
  analysisSummary?: Partial<AnalyzerData>;
};

const defaultResults: AnalyzerData = {
  overall: "Primary suspicious lesion detected in left breast",
  confidence: 92.4,
  birads: "BI-RADS 4C",
  findings: {
    keyFindings: [
      "Spiculated mass in upper outer quadrant of left breast measuring 12 mm with irregular margins",
      "Pleomorphic calcification cluster in central region, tightly grouped over 5 mm area",
      "Subtle architectural distortion in lower breast without discrete mass",
      "No evidence of skin thickening or nipple retraction"
    ],
    recommendations: [
      { 
        action: "Ultrasound-guided core needle biopsy of primary mass", 
        rationale: "BI-RADS 4C lesion requires histological confirmation" 
      },
      { 
        action: "Targeted ultrasound assessment", 
        rationale: "Further characterize lesion margins and vascularity" 
      },
      { 
        action: "Obtain prior imaging for comparison", 
        rationale: "Assess interval change and growth rate" 
      },
      { 
        action: "Multidisciplinary review within 5 business days", 
        rationale: "Complex case requiring specialist consultation" 
      }
    ],
    disclaimer: "This AI-generated assessment is for decision support only. Final diagnosis must be confirmed by qualified radiologist and clinical correlation."
  },
  oldFindings: [
    {
      id: "finding-1",
      type: "Spiculated Mass",
      location: "Upper outer quadrant, left breast",
      size: "12 mm",
      severity: "high",
      confidence: 88,
      birads: "4C",
    },
    {
      id: "finding-2",
      type: "Microcalcification Cluster",
      location: "Central region, left breast",
      size: "5 mm cluster",
      severity: "moderate",
      confidence: 74,
      birads: "4B",
    },
  ],
  recommendations: [
    "Schedule targeted ultrasound to assess lesion margins.",
    "Recommend ultrasound-guided core needle biopsy of primary mass.",
    "Obtain previous imaging for comparative analysis where available.",
    "Arrange multidisciplinary review within 5 business days.",
  ],
  assessment: {
    breastDensity: {
      severity: "high",
      category: "ACR Density C - Heterogeneously Dense",
      description: "Dense tissue present which may obscure small masses. Supplemental screening may be considered."
    },
    biradsCategory: {
      severity: "high",
      category: "4C",
      description: "Suspicious abnormality - High concern for malignancy",
      recommendation: "Biopsy should be considered. Likelihood of malignancy: 50-95%"
    },
    riskScore: 78
  },
  detections: [
    {
      id: "det-1",
      label: "Primary lesion",
      type: "Irregular mass",
      confidence: 92,
      size: "12 mm",
      birads: "4C",
      description: "Spiculated margins with posterior acoustic shadowing suggest high suspicion.",
      suspicion: "high",
      center: { x: 58, y: 36 },
      radii: { x: 3, y: 4 },
      annotation: {
        anchor: "right",
        offsetX: 8,
        offsetY: -4,
      },
    },
    {
      id: "det-2",
      label: "Calcification cluster",
      type: "Pleomorphic calcification",
      confidence: 78,
      size: "5 mm",
      birads: "4B",
      description: "Tightly grouped pleomorphic calcifications centrally located.",
      suspicion: "moderate",
      center: { x: 41, y: 52 },
      radii: { x: 2.5, y: 2.5 },
      annotation: {
        anchor: "left",
        offsetX: -7,
        offsetY: 5,
      },
    },
    {
      id: "det-3",
      label: "Architectural asymmetry",
      type: "Architectural distortion",
      confidence: 64,
      size: "18 mm",
      birads: "4A",
      description: "Subtle distortion without discrete mass. Monitor in follow-up views.",
      suspicion: "low",
      center: { x: 70, y: 64 },
      radii: { x: 3.5, y: 3 },
      annotation: {
        anchor: "right",
        offsetX: 9,
        offsetY: 7,
      },
    },
  ],
  modelVersion: "Aurora v0.9.3",
  inferenceTimeMs: 2140,
  generatedAt: new Date().toISOString(),
};

const suspicionTokens: Record<DetectionSuspicion, {
  label: string;
  ringClass: Record<ThemeMode, string>;
  badgeClass: Record<ThemeMode, string>;
  dotClass: Record<ThemeMode, string>;
  gradient: Record<ThemeMode, string>;
  textClass: Record<ThemeMode, string>;
  stroke: string;
}> = {
  high: {
    label: "High suspicion",
    ringClass: {
      dark: "ring-rose-500/70",
      light: "ring-rose-400/70",
    },
    badgeClass: {
      dark: "bg-rose-500/10 text-rose-300",
      light: "bg-rose-100 text-rose-700 border border-rose-200",
    },
    dotClass: {
      dark: "bg-rose-400",
      light: "bg-rose-400",
    },
    gradient: {
      dark: "from-rose-500/20 to-transparent",
      light: "from-rose-400/25 to-white/0",
    },
    textClass: {
      dark: "text-rose-300",
      light: "text-rose-500",
    },
    stroke: "#fb7185",
  },
  moderate: {
    label: "Moderate suspicion",
    ringClass: {
      dark: "ring-amber-400/60",
      light: "ring-amber-400/60",
    },
    badgeClass: {
      dark: "bg-amber-400/10 text-amber-200",
      light: "bg-amber-100 text-amber-700 border border-amber-200",
    },
    dotClass: {
      dark: "bg-amber-300",
      light: "bg-amber-400",
    },
    gradient: {
      dark: "from-amber-400/15 to-transparent",
      light: "from-amber-300/25 to-white/0",
    },
    textClass: {
      dark: "text-amber-200",
      light: "text-amber-600",
    },
    stroke: "#fbbf24",
  },
  low: {
    label: "Low suspicion",
    ringClass: {
      dark: "ring-sky-400/60",
      light: "ring-sky-400/60",
    },
    badgeClass: {
      dark: "bg-sky-400/10 text-sky-200",
      light: "bg-sky-100 text-sky-700 border border-sky-200",
    },
    dotClass: {
      dark: "bg-sky-300",
      light: "bg-sky-400",
    },
    gradient: {
      dark: "from-sky-400/15 to-transparent",
      light: "from-sky-300/20 to-white/0",
    },
    textClass: {
      dark: "text-sky-200",
      light: "text-sky-600",
    },
    stroke: "#38bdf8",
  },
};

const severityBadgeClasses: Record<DetectionSuspicion, Record<ThemeMode, string>> = {
  high: {
    dark: "bg-rose-500/10 text-rose-300 border border-rose-500/20",
    light: "bg-rose-100 text-rose-700 border border-rose-200",
  },
  moderate: {
    dark: "bg-amber-400/10 text-amber-200 border border-amber-400/20",
    light: "bg-amber-100 text-amber-700 border border-amber-200",
  },
  low: {
    dark: "bg-sky-500/10 text-sky-200 border border-sky-500/20",
    light: "bg-sky-100 text-sky-700 border border-sky-200",
  },
};

export function MammographAnalyzer() {
  const location = useLocation();
  const { formData, setFormData } = useNewPatient();
  const [theme, setTheme] = useState<ThemeMode>(() => {
    if (typeof window === "undefined") {
      return "light";
    }
    const stored = window.localStorage.getItem("mammograph-analyzer-theme");
    return stored === "dark" || stored === "light" ? (stored as ThemeMode) : "light";
  });
  const isDark = theme === "dark";
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisComplete, setAnalysisComplete] = useState(false);
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const primaryImage = formData.images?.[activeImageIndex] ?? null;
  const panelBaseClass = isDark
    ? "border-white/5 bg-slate-900/60 shadow-xl shadow-slate-900/40 backdrop-blur"
    : "border-slate-200 bg-white shadow-xl shadow-slate-200/60";
  const mutedTextClass = isDark ? "text-slate-400" : "text-slate-600";
  const subtleTextClass = isDark ? "text-slate-300" : "text-slate-700";
  const primaryTextClass = isDark ? "text-white" : "text-slate-900";
  const indicatorPillClass = isDark
    ? "border-white/10 bg-black/30 text-slate-200"
    : "border-slate-200 bg-slate-100 text-slate-700";
  const chipSurfaceClass = isDark
    ? "bg-black/40 text-slate-300"
    : "bg-slate-100 text-slate-700";
  const metricSurfaceClass = isDark
    ? "bg-black/40 text-slate-200"
    : "bg-slate-100 text-slate-800";
  const dashedPanelClass = isDark
    ? "border-white/10 bg-black/20 text-slate-400"
    : "border-slate-300 bg-slate-50 text-slate-600";
  const roseShadow = isDark ? "shadow-rose-500/10" : "shadow-rose-100/60";
  const emeraldShadow = isDark ? "shadow-emerald-500/10" : "shadow-emerald-100/60";
  const blueShadow = isDark ? "shadow-blue-500/10" : "shadow-blue-100/50";
  const purpleShadow = isDark ? "shadow-purple-500/10" : "shadow-purple-100/50";

  const [patientId, setPatientId] = useState("");
  const [scanDate, setScanDate] = useState("2025-11-12");
  const [analysisSaved, setAnalysisSaved] = useState(false);
  const [savedPayloadSignature, setSavedPayloadSignature] = useState<string | null>(null);
  const [savedPatientId, setSavedPatientId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const [isLoadingTransition, setIsLoadingTransition] = useState(false);
  const [wiggleFields, setWiggleFields] = useState(false);

  type ResultTab = "detections" | "assessment" | "findings";
  const [activeResultTab, setActiveResultTab] = useState<ResultTab>("detections");

  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }
    window.localStorage.setItem("mammograph-analyzer-theme", theme);
  }, [theme]);

  const buildCurrentPayload = () => {
    const trimmedPatientId = patientId.trim();
    return {
      patientId: trimmedPatientId || null,
      name: formData.name?.trim() || "",
      age: Number(formData.age) || 0,
      lastScan: scanDate,
      totalScans: 1,
      status: "Active",
      riskLevel: "Unknown",
    };
  };

  const signatureForPayload = (
    payload: ReturnType<typeof buildCurrentPayload>,
    effectiveId: string | null,
  ) => JSON.stringify({ ...payload, effectiveId: effectiveId ?? "" });

  useEffect(() => {
    if (!analysisComplete || isAnalyzing) return;
    if (!analysisSaved || !savedPayloadSignature) return;

    const payload = buildCurrentPayload();
    const effectiveIdSource = savedPatientId ?? (payload.patientId ?? undefined);
    const effectiveId = effectiveIdSource ? String(effectiveIdSource).trim() || null : null;
    const currentSignature = signatureForPayload(payload, effectiveId);

    if (currentSignature !== savedPayloadSignature) {
      setAnalysisSaved(false);
      setSavedPayloadSignature(null);
      setSaveMessage(null);
      setSaveError(null);
    }
  }, [
    analysisComplete,
    isAnalyzing,
    analysisSaved,
    savedPayloadSignature,
    savedPatientId,
    formData.name,
    formData.age,
    scanDate,
    patientId,
    formData.images,
  ]);

  useEffect(() => {
    const state = (location.state as AnalyzerPrefillState | null) ?? null;
    if (!state) {
      return;
    }

    const patientIdFromState = state.patientId ? String(state.patientId) : null;
    if (patientIdFromState) {
      setPatientId(patientIdFromState);
      setSavedPatientId(patientIdFromState);
    }

    if (state.lastScan) {
      setScanDate(state.lastScan);
    }

    const normalizedPayload = {
      patientId: patientIdFromState,
      name: formData.name?.trim() || "",
      age: Number(formData.age) || 0,
      lastScan: state.lastScan ?? scanDate,
      totalScans: state.totalScans ?? 1,
      status: "Active",
      riskLevel: "Unknown",
    };

    if (state.analysisSummary) {
      const mergedAnalysis: AnalyzerData = {
        ...defaultResults,
        ...state.analysisSummary,
        findings: state.analysisSummary.findings ?? defaultResults.findings,
        recommendations: state.analysisSummary.recommendations ?? defaultResults.recommendations,
        detections: state.analysisSummary.detections ?? defaultResults.detections,
        modelVersion: state.analysisSummary.modelVersion ?? defaultResults.modelVersion,
        inferenceTimeMs: state.analysisSummary.inferenceTimeMs ?? defaultResults.inferenceTimeMs,
        generatedAt: state.analysisSummary.generatedAt ?? defaultResults.generatedAt,
      };

      setAnalysisData(mergedAnalysis);
      setIsAnalyzing(false);
      setAnalysisComplete(true);
      setAnalysisSaved(true);
      setProgress(100);
      setSaveMessage("Loaded analysis from patient record.");

      if (patientIdFromState) {
        setSavedPayloadSignature(
          signatureForPayload(normalizedPayload, patientIdFromState),
        );
      }
    }

    window.history.replaceState(
      null,
      document.title,
      `${window.location.pathname}${window.location.search}`,
    );
  }, [location.state, formData.name, formData.age, scanDate]);

  useEffect(() => {
    const images = formData.images ?? [];
    if (images.length === 0) {
      if (activeImageIndex !== 0) {
        setActiveImageIndex(0);
      }
      return;
    }

    if (activeImageIndex >= images.length) {
      setActiveImageIndex(images.length - 1);
    }
  }, [formData.images, activeImageIndex]);

  const dataUrlToFile = (dataUrl: string, filename: string): File | null => {
    const matches = dataUrl.match(/^data:(.+);base64,(.*)$/);
    if (!matches) {
      return null;
    }

    const mime = matches[1];
    const base64 = matches[2];

    try {
      const binary = atob(base64);
      const length = binary.length;
      const buffer = new Uint8Array(length);
      for (let i = 0; i < length; i += 1) {
        buffer[i] = binary.charCodeAt(i);
      }
      return new File([buffer], filename, { type: mime });
    } catch (error) {
      console.error("Unable to convert data URL to file", error);
      return null;
    }
  };

  const handleSavePatient = async () => {
    if (!analysisComplete || isAnalyzing || isSaving) return;

    const payload = buildCurrentPayload();
    const effectiveIdSource = savedPatientId ?? (payload.patientId ?? undefined);
    const effectiveId = effectiveIdSource ? String(effectiveIdSource).trim() : "";
    const isUpdate = Boolean(effectiveId);
    let currentMethod: "POST" | "PUT" = isUpdate ? "PUT" : "POST";
    let currentEndpoint = isUpdate ? `/api/patients/${effectiveId}` : "/api/patients";
    const payloadForRequest = {
      ...payload,
      ...(isUpdate ? { id: effectiveId } : {}),
    };

    setIsSaving(true);
    setSaveError(null);
    setSaveMessage(null);

    try {
      const performPost = async () => {
        const formPayload = new FormData();
        formPayload.append("name", payload.name);
        formPayload.append("age", payload.age.toString());
        formPayload.append("lastScan", payload.lastScan);
        formPayload.append("totalScans", payload.totalScans.toString());
        formPayload.append("status", payload.status);
        formPayload.append("riskLevel", payload.riskLevel);

        (formData.images ?? []).forEach((dataUrl, index) => {
          const file = dataUrlToFile(dataUrl, `mammogram-${index + 1}.png`);
          if (file) {
            formPayload.append("images", file);
          }
        });

        return fetch(currentEndpoint, {
          method: "POST",
          body: formPayload,
        });
      };

      const performPut = async () =>
        fetch(currentEndpoint, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payloadForRequest),
        });

      let response =
        currentMethod === "POST" ? await performPost() : await performPut();

      if (!response.ok && currentMethod === "PUT" && response.status === 404) {
        currentMethod = "POST";
        currentEndpoint = "/api/patients";
        response = await performPost();
      }

      if (!response.ok) {
        throw new Error("Unable to save analysis. Please try again.");
      }

      let data: any = null;
      try {
        data = await response.json();
      } catch (error) {
        data = null;
      }

      const assignedIdCandidate =
        data?.id ??
        data?.patientId ??
        (effectiveId ? effectiveId : null) ??
        (payload.patientId ? String(payload.patientId) : null);

      const assignedId = assignedIdCandidate ? String(assignedIdCandidate) : null;

      if (!patientId.trim() && assignedId) {
        setPatientId(assignedId);
      }

      if (assignedId) {
        setSavedPatientId(assignedId);
      }

      const normalizedPayload = {
        ...payload,
        patientId: assignedId ?? payload.patientId ?? null,
      };

      setSavedPayloadSignature(
        signatureForPayload(
          normalizedPayload,
          assignedId ?? (effectiveId || null),
        ),
      );
      setAnalysisSaved(true);
      setSaveMessage(isUpdate ? "Analysis updated successfully." : "Analysis saved successfully.");
      window.dispatchEvent(new CustomEvent("patient-created"));
    } catch (error) {
      setSaveError(
        error instanceof Error
          ? error.message
          : "Unable to save analysis. Please try again.",
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) {
      return;
    }

    // Validate required fields before proceeding
    const hasPatientId = patientId.trim().length > 0;
    const hasPatientName = formData.name?.trim().length > 0;
    
    if (!hasPatientId || !hasPatientName) {
      // Trigger wiggle animation
      setWiggleFields(true);
      setTimeout(() => setWiggleFields(false), 500);
      
      // Clear the file input
      event.target.value = '';
      
      // Show error message
      setSaveError("Please fill in Patient ID and Patient Name before uploading images.");
      setTimeout(() => setSaveError(null), 3000);
      
      return;
    }

    setIsLoadingTransition(true);

    const readers = Array.from(files).map(
      (file) =>
        new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = (e) => {
            const result = e.target?.result;
            if (typeof result === "string") {
              resolve(result);
            } else {
              reject(new Error("Unable to read file"));
            }
          };
          reader.onerror = () => reject(new Error("Unable to read file"));
          reader.readAsDataURL(file);
        }),
    );

    try {
      const imagesAsDataUrls = await Promise.all(readers);
      
      // Show loading animation for 1.5 seconds
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setFormData((prev) => ({
        ...prev,
        images: imagesAsDataUrls,
      }));
      setActiveImageIndex(0);
      setAnalysisComplete(false);
      setAnalysisSaved(false);
      setSavedPayloadSignature(null);
      setSaveMessage(null);
      setSaveError(null);
      setIsLoadingTransition(false);
    } catch (error) {
      setSaveError("One or more files could not be loaded.");
      setIsLoadingTransition(false);
    }
  };

  const handleAnalyze = () => {
    setIsAnalyzing(true);
    setProgress(0);
    setAnalysisSaved(false);
    setSavedPayloadSignature(null);
    setSaveMessage(null);
    setSaveError(null);

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsAnalyzing(false);
          setAnalysisComplete(true);
          setAnalysisData(defaultResults);
          setAnalysisSaved(false);
          setSaveMessage(null);
          return 100;
        }
        return prev + 10;
      });
    }, 300);
  };

  const [analysisData, setAnalysisData] = useState(defaultResults);
  const [activeDetectionId, setActiveDetectionId] = useState<string | null>(
    defaultResults.detections[0]?.id ?? null,
  );

  const isFormValid = useMemo(() => {
    const hasPatientId = patientId.trim().length > 0;
    const hasPatientName = formData.name?.trim().length > 0;
    const hasImage = (formData.images?.length ?? 0) > 0;
    return hasPatientId && hasPatientName && hasImage;
  }, [patientId, formData.name, formData.images]);

  useEffect(() => {
    if (analysisData.detections.length === 0) {
      if (activeDetectionId !== null) {
        setActiveDetectionId(null);
      }
      return;
    }

    const detectionExists = analysisData.detections.some(
      (detection) => detection.id === activeDetectionId,
    );

    if (!detectionExists) {
      setActiveDetectionId(analysisData.detections[0].id);
    }
  }, [analysisData, activeDetectionId]);

  const activeDetection = useMemo(
    () =>
      activeDetectionId
        ? analysisData.detections.find(
            (detection) => detection.id === activeDetectionId,
          ) ?? null
        : null,
    [analysisData, activeDetectionId],
  );

  const thumbnailImages = formData.images ?? [];

  const generatedDisplay = useMemo(() => {
    try {
      const date = new Date(analysisData.generatedAt);
      return date.toLocaleString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (error) {
      return analysisData.generatedAt;
    }
  }, [analysisData.generatedAt]);

  const inferenceSeconds = useMemo(
    () => (analysisData.inferenceTimeMs / 1000).toFixed(2),
    [analysisData.inferenceTimeMs],
  );

  const analysisReady = analysisComplete && analysisData.detections.length > 0;

  const handleDetectionFocus = useCallback((id: string) => {
    setActiveDetectionId(id);
  }, []);

  const resultTabs: Array<{ id: ResultTab; label: string }> = [
    { id: "detections", label: "Detections" },
    { id: "assessment", label: "Assessment" },
    { id: "findings", label: "Findings & Next Steps" },
  ];

  const handleNextTab = useCallback(() => {
    const currentIndex = resultTabs.findIndex((tab) => tab.id === activeResultTab);
    const nextIndex = (currentIndex + 1) % resultTabs.length;
    setActiveResultTab(resultTabs[nextIndex].id);
  }, [activeResultTab, resultTabs]);

  const handlePrevTab = useCallback(() => {
    const currentIndex = resultTabs.findIndex((tab) => tab.id === activeResultTab);
    const prevIndex = (currentIndex - 1 + resultTabs.length) % resultTabs.length;
    setActiveResultTab(resultTabs[prevIndex].id);
  }, [activeResultTab, resultTabs]);

  const handleBackToUpload = useCallback(() => {
    setFormData((prev) => ({ ...prev, images: [] }));
    setThumbnailImages([]);
    setActiveImageIndex(0);
    setIsAnalyzing(false);
    setAnalysisComplete(false);
    setProgress(0);
    setAnalysisSaved(false);
    setSavedPayloadSignature(null);
    setSavedPatientId(null);
    setSaveError(null);
    setSaveMessage(null);
    setActiveDetectionId(null);
    setActiveResultTab("detections");
    setIsLoadingTransition(false);
  }, [setFormData]);

  return (
    <NewNavigation isCollapsed={!!primaryImage}>
      <div
        className={cx(
          "relative min-h-screen transition-colors",
          isDark ? "bg-slate-950 text-slate-100" : "bg-slate-50 text-slate-900",
        )}
      >
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          {isDark ? (
            <>
              <div className="absolute -left-48 -top-[30%] h-[420px] w-[420px] rounded-full bg-rose-500/15 blur-[180px]" />
              <div className="absolute bottom-[-15%] right-[-20%] h-[520px] w-[520px] rounded-full bg-sky-500/10 blur-[200px]" />
              <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-slate-900 via-slate-950/90 to-transparent" />
            </>
          ) : (
            <>
              <div className="absolute -left-32 -top-[28%] h-[360px] w-[360px] rounded-full bg-rose-200/60 blur-[160px]" />
              <div className="absolute bottom-[-12%] right-[-18%] h-[460px] w-[460px] rounded-full bg-sky-200/60 blur-[180px]" />
              <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-white via-white/80 to-transparent" />
            </>
          )}
        </div>

        <main className="relative z-10 mx-auto flex w-full max-w-[1920px] flex-col gap-8 px-6 py-10 sm:px-8 lg:px-12">
          <header className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="flex items-start gap-4">
              {primaryImage && (
                <button
                  type="button"
                  onClick={handleBackToUpload}
                  className={cx(
                    "mt-1 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border transition",
                    isDark
                      ? "border-white/10 bg-white/5 text-slate-200 hover:border-rose-400/50 hover:bg-rose-500/10 hover:text-rose-300"
                      : "border-slate-200 bg-white text-slate-700 shadow-sm hover:border-rose-300 hover:bg-rose-50 hover:text-rose-600",
                  )}
                  aria-label="Back to upload"
                >
                  <ArrowLeft className="h-5 w-5" />
                </button>
              )}
              <div className="space-y-3">
                <div
                  className={cx(
                    "flex items-center gap-2 text-[0.65rem] uppercase tracking-[0.35em]",
                    isDark ? "text-slate-500" : "text-slate-600",
                  )}
                >
                  <Sparkles className={cx("h-4 w-4", isDark ? "text-rose-300" : "text-rose-500")} />
                  <span>Aurora Diagnostic Studio</span>
                </div>
                <h1 className={cx("text-4xl font-semibold md:text-5xl", primaryTextClass)}>
                  Mammograph Analyzer
                </h1>
                <p className={cx("max-w-2xl text-sm md:text-base", mutedTextClass)}>
                  Immersive overlay cockpit for CAD-assisted interpretation with synchronized findings and reporting actions.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-sm">
              {primaryImage && !analysisComplete && (
                <button
                  type="button"
                  onClick={handleAnalyze}
                  disabled={isAnalyzing || !isFormValid}
                  className={cx(
                    "relative overflow-hidden rounded-full px-6 py-3 text-base font-semibold transition disabled:cursor-not-allowed",
                    isDark
                      ? "bg-rose-500/90 text-white shadow-lg shadow-rose-500/30 hover:bg-rose-500 disabled:bg-rose-500/50 disabled:opacity-50"
                      : "bg-rose-500 text-white shadow-lg shadow-rose-200/70 hover:bg-rose-600 disabled:bg-rose-300 disabled:opacity-50",
                  )}
                >
                  <div
                    className={cx(
                      "absolute inset-0 transition-transform duration-300",
                      isDark ? "bg-rose-600" : "bg-rose-600",
                    )}
                    style={{
                      transform: `translateX(-${100 - progress}%)`,
                      opacity: isAnalyzing ? 0.4 : 0,
                    }}
                  />
                  <span className="relative z-10 flex items-center gap-2">
                    {isAnalyzing ? (
                      <>
                        <Loader2 className="h-5 w-5 animate-spin" />
                        Analyzing... {progress}%
                      </>
                    ) : (
                      <>
                        <Play className="h-5 w-5" fill="currentColor" />
                        Start Analysis
                      </>
                    )}
                  </span>
                </button>
              )}
              
              {primaryImage && analysisComplete && !analysisSaved && (
                <Button
                  className={cx(
                    "gap-2 rounded-full px-6 py-3 text-base font-semibold transition disabled:cursor-not-allowed animate-pulse",
                    isDark
                      ? "bg-emerald-500/90 text-white shadow-[0_0_30px_rgba(16,185,129,0.5)] hover:bg-emerald-500 hover:shadow-[0_0_40px_rgba(16,185,129,0.7)] disabled:bg-emerald-500/50 disabled:animate-none"
                      : "bg-emerald-500 text-white shadow-[0_0_30px_rgba(16,185,129,0.4)] hover:bg-emerald-600 hover:shadow-[0_0_40px_rgba(16,185,129,0.6)] disabled:bg-emerald-300 disabled:animate-none",
                  )}
                  onClick={handleSavePatient}
                  disabled={isSaving}
                >
                  <Save className="h-5 w-5" />
                  {isSaving ? "Saving..." : "Save"}
                </Button>
              )}
              
              {primaryImage && analysisComplete && analysisSaved && (
                <div
                  className={cx(
                    "flex items-center gap-2 rounded-full px-6 py-3 text-base font-semibold",
                    isDark
                      ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                      : "bg-emerald-100 text-emerald-700 border border-emerald-300",
                  )}
                >
                  <CheckCircle className="h-5 w-5" />
                  Saved
                </div>
              )}
            </div>
          </header>

          {!primaryImage ? (
            <section className="w-full">
              <div className={cx("rounded-3xl p-8 md:p-10 lg:p-12", panelBaseClass, purpleShadow)}>
                <div className="mb-8 text-center">
                  <h2 className={cx("text-2xl font-semibold", primaryTextClass)}>Workflow Console</h2>
                  <p className={cx("mt-2 text-sm", mutedTextClass)}>
                    Begin by entering patient information and uploading mammogram images
                  </p>
                </div>

                <div className="mx-auto max-w-4xl">
                  <div className="mt-6 grid grid-cols-2 gap-4 text-sm">
                  <div className="col-span-2">
                    <Label htmlFor="patientId" className={cx(mutedTextClass, "text-xs font-medium uppercase tracking-wide")}>
                      Patient ID <span className="text-rose-500">*</span>
                    </Label>
                    <Input
                      id="patientId"
                      placeholder="e.g., PT-00123"
                      value={patientId}
                      onChange={(event) => setPatientId(event.target.value)}
                      required
                      className={cx(
                        "mt-2",
                        isDark
                          ? "bg-black/30 text-white placeholder:text-slate-500"
                          : "border border-slate-200 bg-white text-slate-900 placeholder:text-slate-400",
                        wiggleFields && !patientId.trim() && "animate-[wiggle_0.5s_ease-in-out]",
                      )}
                    />
                  </div>
                  <div className="col-span-2">
                    <Label htmlFor="patientName" className={cx(mutedTextClass, "text-xs font-medium uppercase tracking-wide")}>
                      Patient name <span className="text-rose-500">*</span>
                    </Label>
                    <Input
                      id="patientName"
                      placeholder="e.g., Jane Doe"
                      value={formData.name}
                      onChange={(event) =>
                        setFormData((prev) => ({
                          ...prev,
                          name: event.target.value,
                        }))
                      }
                      required
                      className={cx(
                        "mt-2",
                        isDark
                          ? "bg-black/30 text-white placeholder:text-slate-500"
                          : "border border-slate-200 bg-white text-slate-900 placeholder:text-slate-400",
                        wiggleFields && !formData.name?.trim() && "animate-[wiggle_0.5s_ease-in-out]",
                      )}
                    />
                  </div>
                  <div>
                    <Label htmlFor="age" className={cx(mutedTextClass, "text-xs font-medium uppercase tracking-wide")}>
                      Age
                    </Label>
                    <Input
                      id="age"
                      type="number"
                      placeholder="58"
                      value={formData.age}
                      onChange={(event) =>
                        setFormData((prev) => ({
                          ...prev,
                          age: event.target.value,
                        }))
                      }
                      className={cx(
                        "mt-2",
                        isDark
                          ? "bg-black/30 text-white placeholder:text-slate-500"
                          : "border border-slate-200 bg-white text-slate-900 placeholder:text-slate-400",
                      )}
                    />
                  </div>
                  <div>
                    <Label htmlFor="scanDate" className={cx(mutedTextClass, "text-xs font-medium uppercase tracking-wide")}>
                      Scan date
                    </Label>
                    <Input
                      id="scanDate"
                      type="date"
                      value={scanDate}
                      onChange={(event) => setScanDate(event.target.value)}
                      className={cx(
                        "mt-2",
                        isDark
                          ? "bg-black/30 text-white placeholder:text-slate-500"
                          : "border border-slate-200 bg-white text-slate-900 placeholder:text-slate-400",
                      )}
                    />
                  </div>
                </div>

                <div
                  className={cx(
                    "mt-6 flex cursor-pointer flex-col items-center justify-center gap-4 rounded-2xl border border-dashed p-12 text-center transition",
                    isDark
                      ? "border-slate-600 bg-black/30 hover:border-rose-400/80 hover:bg-black/40"
                      : "border-slate-300 bg-slate-50 hover:border-rose-300 hover:bg-rose-50",
                  )}
                  onClick={() => fileInputRef.current?.click()}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      fileInputRef.current?.click();
                    }
                  }}
                >
                  <Upload className={cx("h-16 w-16", isDark ? "text-rose-300" : "text-rose-500")} />
                  <div>
                    <p className={cx("text-lg font-medium", primaryTextClass)}>
                      Upload Mammogram Images
                    </p>
                    <p className={cx("mt-1 text-sm", mutedTextClass)}>
                      Click to browse or drag and drop DICOM, PNG or JPG files
                    </p>
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    className="hidden"
                    accept="image/*"
                    multiple
                    onChange={handleFileUpload}
                  />
                </div>
              </div>
            </div>
            </section>
          ) : (
            <section className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_480px] xl:grid-cols-[minmax(0,1fr)_520px]">
              <MammogramViewer
              image={primaryImage}
              thumbnails={thumbnailImages}
              activeIndex={activeImageIndex}
              onThumbSelect={setActiveImageIndex}
              detections={analysisData.detections}
              activeDetectionId={activeDetectionId}
              onDetectionFocus={handleDetectionFocus}
              analysisReady={analysisReady}
              isAnalyzing={isAnalyzing}
              theme={theme}
            />

            <aside className="relative flex flex-col gap-6 h-full">
              <div className={cx("rounded-3xl p-6 flex flex-col", panelBaseClass)} style={{ height: 'calc(100vh - 280px)', minHeight: '700px' }}>
                <div className="mb-4 flex items-center justify-between flex-shrink-0">
                  <h2 className={cx("text-xl font-semibold", primaryTextClass)}>
                    {resultTabs.find((tab) => tab.id === activeResultTab)?.label}
                  </h2>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handlePrevTab}
                      className={cx(
                        "flex h-9 w-9 items-center justify-center rounded-lg border transition",
                        isDark
                          ? "border-white/10 bg-black/30 text-slate-200 hover:bg-black/45"
                          : "border-slate-200 bg-white text-slate-700 hover:bg-slate-100 shadow-sm",
                      )}
                      aria-label="Previous tab"
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </button>
                    <button
                      type="button"
                      onClick={handleNextTab}
                      className={cx(
                        "flex h-9 w-9 items-center justify-center rounded-lg border transition",
                        isDark
                          ? "border-white/10 bg-black/30 text-slate-200 hover:bg-black/45"
                          : "border-slate-200 bg-white text-slate-700 hover:bg-slate-100 shadow-sm",
                      )}
                      aria-label="Next tab"
                    >
                      <ChevronRight className="h-5 w-5" />
                    </button>
                  </div>
                </div>

                {activeResultTab === "detections" && (
                  <div className="flex-1 overflow-y-auto">
                    <div className="mb-4 flex items-center justify-between flex-shrink-0">
                      <p className={cx("text-xs", mutedTextClass)}>AI-traced loci with risk estimates</p>
                      <div className={cx("flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-medium", indicatorPillClass)}>
                        <Target className={cx("h-4 w-4", isDark ? "text-rose-300" : "text-rose-500")} />
                        {analysisReady ? `${analysisData.confidence.toFixed(1)}% mean` : "Awaiting"}
                      </div>
                    </div>

                    <div className="space-y-3 pr-2">
                      {analysisReady ? (
                        analysisData.detections.map((detection) => {
                          const token = suspicionTokens[detection.suspicion];
                          const isActive = detection.id === activeDetectionId;

                          return (
                            <button
                              key={detection.id}
                              type="button"
                              onClick={() => handleDetectionFocus(detection.id)}
                              onMouseEnter={() => handleDetectionFocus(detection.id)}
                              onFocus={() => handleDetectionFocus(detection.id)}
                              className={cx(
                                "group w-full rounded-2xl p-4 text-left transition-all duration-200",
                                isDark
                                  ? "bg-slate-900/40 hover:bg-slate-900/60"
                                  : "bg-white hover:bg-rose-50",
                                isActive
                                  ? `ring-2 ring-inset ${token.ringClass[theme]}`
                                  : isDark
                                    ? "border border-white/5 hover:border-slate-300/40"
                                    : "border border-slate-200 hover:border-rose-200",
                              )}
                            >
                              <div className="flex items-start justify-between gap-3">
                                <div className="space-y-2">
                                  <div className="flex items-center gap-3">
                                    <span
                                      className={cx(
                                        "h-2.5 w-2.5 flex-shrink-0 rounded-full",
                                        token.dotClass[theme],
                                        isActive && "shadow-[0_0_0_4px_rgba(251,113,133,0.2)]",
                                      )}
                                    />
                                    <p className={cx("text-sm font-semibold", primaryTextClass)}>
                                      {detection.label}
                                    </p>
                                  </div>
                                  <p className={cx("text-xs", mutedTextClass)}>{detection.description}</p>
                                  <div className="flex flex-wrap gap-2 text-xs">
                                    <span className={cx("rounded-full px-2.5 py-1", chipSurfaceClass)}>
                                      {detection.type}
                                    </span>
                                    <span className={cx("rounded-full px-2.5 py-1", chipSurfaceClass)}>
                                      Size {detection.size}
                                    </span>
                                    <span
                                      className={cx(
                                        "rounded-full px-2.5 py-1 font-medium",
                                        token.badgeClass[theme],
                                      )}
                                    >
                                      {token.label}
                                    </span>
                                  </div>
                                </div>
                                <div className={cx("flex flex-col items-end gap-2 text-xs", mutedTextClass)}>
                                  <span className={cx("rounded-full px-3 py-1 font-medium", metricSurfaceClass)}>
                                    {detection.confidence}%
                                  </span>
                                  <span>BI-RADS {detection.birads}</span>
                                </div>
                              </div>
                            </button>
                          );
                        })
                      ) : (
                        <div className={cx("rounded-2xl border border-dashed p-6 text-sm", dashedPanelClass)}>
                          Run analysis to reveal AI detections and overlay guidance.
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {activeResultTab === "assessment" && (
                  <div className="flex-1 overflow-y-auto">
                    <p className={cx("mb-4 text-xs flex-shrink-0", mutedTextClass)}>Automated breast density &amp; BI-RADS grading</p>
                    {analysisReady ? (
                      <div className="space-y-4">
                        <div className={cx("rounded-2xl border p-4", isDark ? "border-white/10 bg-slate-900/40" : "border-slate-200 bg-white")}>
                          <div className="mb-3 flex items-center justify-between">
                            <p className={cx("text-sm font-semibold", primaryTextClass)}>Breast Density</p>
                            <span
                              className={cx(
                                "rounded-full px-3 py-1 text-xs font-medium",
                                severityBadgeClasses[analysisData.assessment.breastDensity.severity][theme],
                              )}
                            >
                              {analysisData.assessment.breastDensity.severity.charAt(0).toUpperCase() +
                                analysisData.assessment.breastDensity.severity.slice(1)}
                            </span>
                          </div>
                          <p className={cx("text-sm", subtleTextClass)}>{analysisData.assessment.breastDensity.category}</p>
                          <p className={cx("mt-2 text-xs", mutedTextClass)}>{analysisData.assessment.breastDensity.description}</p>
                        </div>

                        <div className={cx("rounded-2xl border p-4", isDark ? "border-white/10 bg-slate-900/40" : "border-slate-200 bg-white")}>
                          <div className="mb-3 flex items-center justify-between">
                            <p className={cx("text-sm font-semibold", primaryTextClass)}>BI-RADS Assessment</p>
                            <span
                              className={cx(
                                "rounded-full px-3 py-1 text-xs font-medium",
                                severityBadgeClasses[analysisData.assessment.biradsCategory.severity][theme],
                              )}
                            >
                              Category {analysisData.assessment.biradsCategory.category}
                            </span>
                          </div>
                          <p className={cx("text-sm", subtleTextClass)}>{analysisData.assessment.biradsCategory.description}</p>
                          <p className={cx("mt-2 text-xs", mutedTextClass)}>{analysisData.assessment.biradsCategory.recommendation}</p>
                        </div>

                        <div className={cx("rounded-2xl border p-4", isDark ? "border-white/10 bg-slate-900/40" : "border-slate-200 bg-white")}>
                          <p className={cx("mb-2 text-sm font-semibold", primaryTextClass)}>Overall Risk Score</p>
                          <div className="flex items-center gap-3">
                            <div className={cx("flex-1 h-3 rounded-full overflow-hidden", isDark ? "bg-slate-700/50" : "bg-slate-200")}>
                              <div
                                className={cx(
                                  "h-full rounded-full transition-all",
                                  analysisData.assessment.riskScore >= 70 ? "bg-red-500" : analysisData.assessment.riskScore >= 40 ? "bg-orange-500" : "bg-emerald-500",
                                )}
                                style={{ width: `${analysisData.assessment.riskScore}%` }}
                              />
                            </div>
                            <span className={cx("text-sm font-bold", primaryTextClass)}>{analysisData.assessment.riskScore}%</span>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className={cx("rounded-2xl border border-dashed p-6 text-sm", dashedPanelClass)}>
                        Assessment metrics will appear here after AI analysis.
                      </div>
                    )}
                  </div>
                )}

                {activeResultTab === "findings" && (
                  <div className="flex-1 overflow-y-auto">
                    <p className={cx("mb-4 text-xs flex-shrink-0", mutedTextClass)}>Clinical interpretation &amp; follow-up guidance</p>
                    {analysisReady ? (
                      <div className="space-y-4">
                        <div className={cx("rounded-2xl border p-4", isDark ? "border-white/10 bg-slate-900/40" : "border-slate-200 bg-white")}>
                          <p className={cx("mb-2 text-sm font-semibold", primaryTextClass)}>Key Findings</p>
                          <ul className="space-y-2">
                            {analysisData.findings.keyFindings.map((finding, idx) => (
                              <li key={idx} className={cx("flex gap-2 text-xs", subtleTextClass)}>
                                <span className={cx("mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full", isDark ? "bg-rose-400" : "bg-rose-500")} />
                                <span>{finding}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className={cx("rounded-2xl border p-4", isDark ? "border-white/10 bg-slate-900/40" : "border-slate-200 bg-white")}>
                          <p className={cx("mb-2 text-sm font-semibold", primaryTextClass)}>Recommended Actions</p>
                          <div className="space-y-2">
                            {analysisData.findings.recommendations.map((rec, idx) => (
                              <div
                                key={idx}
                                className={cx(
                                  "rounded-lg px-3 py-2 text-xs",
                                  isDark ? "bg-slate-800/50 border border-white/5" : "bg-slate-50 border border-slate-200",
                                )}
                              >
                                <p className={cx("font-medium", primaryTextClass)}>{rec.action}</p>
                                <p className={cx("mt-1", mutedTextClass)}>{rec.rationale}</p>
                              </div>
                            ))}
                          </div>
                        </div>

                        {analysisData.findings.disclaimer && (
                          <div className={cx("rounded-2xl border border-dashed p-4 text-xs", dashedPanelClass)}>
                            <p className="font-medium mb-1">⚕️ Medical Disclaimer</p>
                            <p>{analysisData.findings.disclaimer}</p>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className={cx("rounded-2xl border border-dashed p-6 text-sm", dashedPanelClass)}>
                        Findings and recommendations will appear here after analysis.
                      </div>
                    )}
                  </div>
                )}
              </div>
            </aside>
          </section>
        )}
        </main>

        {isLoadingTransition && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center backdrop-blur-md">
            <div
              className={cx(
                "flex flex-col items-center gap-6 rounded-3xl p-12",
                isDark
                  ? "bg-slate-900/90 border border-white/10 shadow-2xl"
                  : "bg-white/90 border border-slate-200 shadow-2xl",
              )}
            >
              <Loader2
                className={cx(
                  "h-16 w-16 animate-spin",
                  isDark ? "text-rose-400" : "text-rose-500",
                )}
              />
              <div className="text-center">
                <p className={cx("text-lg font-semibold", primaryTextClass)}>
                  Loading images
                </p>
                <p className={cx("mt-2 text-sm", mutedTextClass)}>
                  Preparing analysis workspace...
                </p>
              </div>
            </div>
          </div>
        )}

        <button
          type="button"
          aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
          onClick={toggleTheme}
          className={cx(
            "fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full border text-lg transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
            isDark
              ? "border-white/40 bg-white/90 text-slate-900 shadow-[0_25px_45px_-20px_rgba(15,23,42,0.8)] hover:bg-white focus-visible:ring-white/60 focus-visible:ring-offset-slate-950"
              : "border-slate-900/20 bg-slate-900 text-white shadow-[0_25px_45px_-20px_rgba(15,23,42,0.6)] hover:bg-slate-800 focus-visible:ring-slate-900/70 focus-visible:ring-offset-white",
          )}
        >
          {isDark ? <Sun className="h-6 w-6" /> : <Moon className="h-6 w-6" />}
        </button>
      </div>
    </NewNavigation>
  );
}

type MammogramViewerProps = {
  image: string | null;
  thumbnails: string[];
  activeIndex: number;
  onThumbSelect: (index: number) => void;
  detections: AnalyzerDetection[];
  activeDetectionId: string | null;
  onDetectionFocus: (id: string) => void;
  analysisReady: boolean;
  isAnalyzing: boolean;
  theme: ThemeMode;
};

function MammogramViewer({
  image,
  thumbnails,
  activeIndex,
  onThumbSelect,
  detections,
  activeDetectionId,
  onDetectionFocus,
  analysisReady,
  isAnalyzing,
  theme,
}: MammogramViewerProps) {
  const isDark = theme === "dark";
  const containerRef = useRef<HTMLDivElement>(null);
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);

  const dragState = useRef({
    dragging: false,
    pointerId: null as number | null,
    originX: 0,
    originY: 0,
    startX: 0,
    startY: 0,
  });

  const offsetRef = useRef(offset);
  useEffect(() => {
    offsetRef.current = offset;
  }, [offset]);

  useEffect(() => {
    if (analysisReady) {
      setZoom(1.08);
    } else {
      setZoom(1);
    }
    setOffset({ x: 0, y: 0 });
  }, [analysisReady, image]);

  const clamp = useCallback((value: number, min: number, max: number) => {
    if (Number.isNaN(value)) return min;
    return Math.min(Math.max(value, min), max);
  }, []);

  const handleZoom = useCallback(
    (direction: "in" | "out") => {
      setZoom((prev) => clamp(prev + (direction === "in" ? 0.18 : -0.18), 0.8, 2.6));
    },
    [clamp],
  );

  const handleReset = useCallback(() => {
    setZoom(1);
    setOffset({ x: 0, y: 0 });
  }, []);

  const handlePointerDown = useCallback(
    (event: ReactPointerEvent<HTMLDivElement>) => {
      if (!image || event.button !== 0) {
        return;
      }

      const element = event.currentTarget;
      dragState.current = {
        dragging: true,
        pointerId: event.pointerId,
        originX: event.clientX,
        originY: event.clientY,
        startX: offsetRef.current.x,
        startY: offsetRef.current.y,
      };
      setIsDragging(true);
      element.setPointerCapture(event.pointerId);
    },
    [image],
  );

  const handlePointerMove = useCallback((event: ReactPointerEvent<HTMLDivElement>) => {
    if (!dragState.current.dragging || dragState.current.pointerId !== event.pointerId) {
      return;
    }

    event.preventDefault();
    const deltaX = event.clientX - dragState.current.originX;
    const deltaY = event.clientY - dragState.current.originY;
    setOffset({
      x: dragState.current.startX + deltaX,
      y: dragState.current.startY + deltaY,
    });
  }, []);

  const stopDragging = useCallback((event: ReactPointerEvent<HTMLDivElement>) => {
    if (dragState.current.pointerId !== event.pointerId) {
      return;
    }

    const element = event.currentTarget;
    dragState.current.dragging = false;
    dragState.current.pointerId = null;
    setIsDragging(false);
    if (element.hasPointerCapture(event.pointerId)) {
      element.releasePointerCapture(event.pointerId);
    }
  }, []);

  const handleWheel = useCallback(
    (event: ReactWheelEvent<HTMLDivElement>) => {
      if (!image) {
        return;
      }

      event.preventDefault();
      const delta = event.deltaY > 0 ? -0.12 : 0.12;
      setZoom((prev) => clamp(prev + delta, 0.8, 2.6));
    },
    [clamp, image],
  );

  const overlayDetections = analysisReady ? detections : [];

  const connectorLines = useMemo(
    () =>
      overlayDetections.map((detection) => ({
        id: detection.id,
        x1: detection.center.x,
        y1: detection.center.y,
        x2: detection.center.x + detection.annotation.offsetX,
        y2: detection.center.y + detection.annotation.offsetY,
        stroke: suspicionTokens[detection.suspicion].stroke,
        active: detection.id === activeDetectionId,
      })),
    [overlayDetections, activeDetectionId],
  );

  const zoomDisplay = useMemo(() => Math.round(zoom * 100), [zoom]);
  const viewerSurfaceClass = isDark
    ? "border-white/5 bg-slate-900/60 shadow-[0_55px_120px_-40px_rgba(15,23,42,0.7)] backdrop-blur"
    : "border-slate-200 bg-white shadow-[0_55px_120px_-40px_rgba(15,23,42,0.2)]";
  const viewerGradientClass = isDark
    ? "from-white/5 via-transparent to-white/0"
    : "from-slate-100/70 via-transparent to-transparent";
  const statusPillBase = isDark
    ? "border-white/10 bg-black/40"
    : "border-slate-200 bg-white/90 shadow-sm";
  const controlButtonClass = isDark
    ? "flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-black/40 text-slate-200 transition hover:border-white/30 hover:bg-black/60 disabled:cursor-not-allowed disabled:opacity-40"
    : "flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 transition hover:border-slate-300 hover:bg-slate-100 shadow-sm disabled:cursor-not-allowed disabled:opacity-40";
  const zoomBadgeClass = isDark
    ? "flex h-11 items-center justify-center rounded-xl border border-white/10 bg-black/30 px-3 text-xs font-semibold text-slate-200"
    : "flex h-11 items-center justify-center rounded-xl border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-700 shadow-sm";
  const emptyStateText = isDark ? "text-slate-400" : "text-slate-500";
  const emptyStateIcon = isDark ? "text-slate-500" : "text-slate-400";
  const filmstripBaseClass = isDark
    ? "border-white/10 hover:border-white/30"
    : "border-slate-200 hover:border-rose-200";
  const filmstripActiveClass = isDark
    ? "border-rose-400 ring-2 ring-rose-400/40"
    : "border-rose-300 ring-2 ring-rose-300/40";
  const filmstripLabelClass = isDark
    ? "bg-black/70 text-slate-200"
    : "border border-slate-200/60 bg-white/85 text-slate-700 shadow-sm";
  const overlayBorderClass = isDark ? "border-white/40" : "border-rose-400/60";
  const overlayDotClass = isDark ? "bg-white/80" : "bg-slate-900/70";
  const labelSurfaceClass = isDark
    ? "pointer-events-none absolute z-20 rounded-xl border border-white/10 bg-black/60 px-3 py-2 text-xs font-semibold backdrop-blur"
    : "pointer-events-none absolute z-20 rounded-xl border border-slate-200 bg-white/90 px-3 py-2 text-xs font-semibold shadow-sm";
  const statusTextReady = isDark ? "text-emerald-200" : "text-emerald-600";
  const statusTextAnalyzing = isDark ? "text-amber-200" : "text-amber-600";
  const statusTextIdle = isDark ? "text-slate-200" : "text-slate-600";
  const statusDotReady = isDark ? "bg-emerald-400" : "bg-emerald-500";
  const statusDotAnalyzing = isDark ? "bg-amber-400" : "bg-amber-500";
  const statusDotIdle = isDark ? "bg-slate-400" : "bg-slate-500";
  const interactionHintClass = isDark
    ? "hidden items-center gap-2 rounded-full border border-white/10 bg-black/40 px-3 py-1.5 text-xs text-slate-300 md:flex"
    : "hidden items-center gap-2 rounded-full border border-slate-200 bg-white/90 px-3 py-1.5 text-xs text-slate-600 shadow-sm md:flex";
  const statusTextClass = analysisReady
    ? statusTextReady
    : isAnalyzing
      ? statusTextAnalyzing
      : statusTextIdle;
  const statusDotClass = analysisReady
    ? statusDotReady
    : isAnalyzing
      ? statusDotAnalyzing
      : statusDotIdle;
  const statusLabel = analysisReady
    ? "Overlay active"
    : isAnalyzing
      ? "Analyzing image"
      : "Awaiting analysis";
  const statusPulse = analysisReady || isAnalyzing ? "animate-pulse" : "";

  return (
    <div className="flex flex-col gap-5 h-full">
      <div className={cx("relative overflow-hidden rounded-[32px] flex-1 min-h-0", viewerSurfaceClass)}>
        <div className={cx("absolute inset-0 bg-gradient-to-br", viewerGradientClass)} />
        <div className="relative isolate h-full rounded-[32px]">
          <div
            ref={containerRef}
            className={`relative h-full w-full ${image ? "cursor-grab active:cursor-grabbing" : ""}`}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={stopDragging}
            onPointerCancel={stopDragging}
            onPointerLeave={(event) => {
              if (dragState.current.dragging) {
                stopDragging(event);
              }
            }}
            onDoubleClick={handleReset}
            onWheel={handleWheel}
          >
            {image ? (
              <div className="absolute inset-0 flex items-center justify-center">
                <div
                  className="relative h-full w-full select-none"
                  style={{
                    transform: `translate(${offset.x}px, ${offset.y}px) scale(${zoom})`,
                    transition: isDragging ? "none" : "transform 120ms ease-out",
                  }}
                >
                  <img
                    src={image}
                    alt="Mammograph"
                    className="h-full w-full select-none object-fill"
                    draggable={false}
                  />

                  {analysisReady && (
                    <>
                      {overlayDetections.map((detection) => {
                        const token = suspicionTokens[detection.suspicion];
                        const isActive = detection.id === activeDetectionId;
                        const regionStyle: CSSProperties = {
                          width: `${detection.radii.x * 2}%`,
                          height: `${detection.radii.y * 2}%`,
                          left: `calc(${detection.center.x}% - ${detection.radii.x}%)`,
                          top: `calc(${detection.center.y}% - ${detection.radii.y}%)`,
                        };

                        const labelStyle: CSSProperties = {
                          left: `calc(${detection.center.x}% + ${detection.annotation.offsetX}%)`,
                          top: `calc(${detection.center.y}% + ${detection.annotation.offsetY}%)`,
                          transform: "translate(-50%, -50%)",
                        };

                        return (
                          <div key={detection.id} className="absolute inset-0">
                            <button
                              type="button"
                              style={regionStyle}
                              onClick={() => onDetectionFocus(detection.id)}
                              onMouseEnter={() => onDetectionFocus(detection.id)}
                              className={`absolute rounded-full border border-white/0 transition-[box-shadow] duration-200 focus:outline-none focus-visible:ring-2 ${
                                isActive ? "ring-2 ring-offset-2 ring-offset-transparent" : ""
                              }`}
                            >
                              <span
                                className={cx(
                                  "pointer-events-none absolute inset-0 rounded-full border-[1.5px]",
                                  isActive
                                    ? isDark
                                      ? "border-rose-400/90"
                                      : "border-rose-500/80"
                                    : overlayBorderClass,
                                )}
                              />
                              <span
                                className={cx(
                                  "pointer-events-none absolute inset-0 rounded-full bg-gradient-to-br",
                                  token.gradient[theme],
                                  isActive ? "opacity-50" : "opacity-30",
                                )}
                              />
                              <span
                                className={cx(
                                  "pointer-events-none absolute left-1/2 top-1/2 h-1 w-1 -translate-x-1/2 -translate-y-1/2 rounded-full",
                                  overlayDotClass,
                                )}
                              />
                              <span className="sr-only">{detection.label}</span>
                            </button>

                            <div
                              className={cx(
                                labelSurfaceClass,
                                token.textClass[theme],
                                "text-[10px] px-2 py-1",
                                isActive
                                  ? isDark
                                    ? "shadow-lg shadow-black/40"
                                    : "shadow-md shadow-rose-200/50"
                                  : "",
                              )}
                              style={labelStyle}
                            >
                              {detection.label}
                            </div>
                          </div>
                        );
                      })}
                    </>
                  )}
                </div>
              </div>
            ) : (
              <div className={cx("flex h-full w-full flex-col items-center justify-center gap-3 text-center", emptyStateText)}>
                <Upload className={cx("h-16 w-16", emptyStateIcon)} />
                <p className={cx("text-sm font-medium", isDark ? "text-slate-300" : "text-slate-700")}>Drop mammogram images to begin</p>
                <p className={cx("text-xs", emptyStateText)}>Supports multi-view uploads for CC/MLO studies</p>
              </div>
            )}
          </div>

          <div
            className={cx(
              "pointer-events-none absolute inset-0 rounded-[32px] border",
              isDark ? "border-white/10" : "border-slate-200/70",
            )}
          />

          <div className="absolute left-6 top-6 flex items-center gap-3">
            <span
              className={cx(
                "inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-medium",
                statusPillBase,
                statusTextClass,
              )}
            >
              <span className={cx("h-2 w-2 rounded-full", statusDotClass, statusPulse)} />
              {statusLabel}
            </span>
            {image && (
              <span className={interactionHintClass}>
                <Move className={cx("h-3.5 w-3.5", isDark ? "text-slate-200" : "text-slate-500")} />
                Drag to pan · scroll to zoom
              </span>
            )}
          </div>

          <div className="absolute right-6 top-6 flex items-center gap-2">
            <button type="button" className={controlButtonClass} onClick={() => handleZoom("out")} disabled={!image}>
              <ZoomOut className="h-4 w-4" />
              <span className="sr-only">Zoom out</span>
            </button>
            <button type="button" className={controlButtonClass} onClick={() => handleZoom("in")} disabled={!image}>
              <ZoomIn className="h-4 w-4" />
              <span className="sr-only">Zoom in</span>
            </button>
            <div className={zoomBadgeClass}>{zoomDisplay}%</div>
            <button type="button" className={controlButtonClass} onClick={handleReset} disabled={!image}>
              <Maximize2 className="h-4 w-4" />
              <span className="sr-only">Reset view</span>
            </button>
            <button
              type="button"
              className={controlButtonClass}
              onClick={() => {
                if (image) {
                  window.open(image, "_blank", "noopener,noreferrer");
                }
              }}
              disabled={!image}
            >
              <Download className="h-4 w-4" />
              <span className="sr-only">Download image</span>
            </button>
          </div>
        </div>
      </div>

      {thumbnails.length > 1 && (
        <div className="flex items-center gap-3 overflow-x-auto pb-1">
          {thumbnails.map((thumb, index) => (
            <button
              key={`thumb-${index}`}
              type="button"
              onClick={() => onThumbSelect(index)}
              className={cx(
                "relative h-20 w-28 flex-shrink-0 overflow-hidden rounded-xl border transition",
                index === activeIndex ? filmstripActiveClass : filmstripBaseClass,
              )}
            >
              <img
                src={thumb}
                alt={`Mammogram ${index + 1}`}
                className="h-full w-full object-cover"
              />
              <span
                className={cx(
                  "absolute bottom-2 right-2 rounded-full px-2 py-0.5 text-[0.65rem] font-medium",
                  filmstripLabelClass,
                )}
              >
                View {index + 1}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
