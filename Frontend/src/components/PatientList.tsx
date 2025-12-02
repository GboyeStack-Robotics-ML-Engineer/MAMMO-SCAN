import { useState, useEffect, useCallback, ChangeEvent, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Filter,
  UserPlus,
  FileText,
  Calendar,
  Trash2,
  CheckSquare,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
} from "lucide-react";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import NewNavigation from "./NewNavigation";
import { useNewPatient } from "../context/NewPatientContext";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { Checkbox } from "./ui/checkbox";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "./ui/resizable";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "./ui/carousel";

interface PatientRecord {
  id: number;
  name: string;
  age?: number;
  lastScan: string;
  totalScans?: number;
  status: string;
  riskLevel: string;
  avatar?: string | null;
}

interface AnalysisSummary {
  id: number;
  date: string;
  result: string;
  confidence: number;
  status: string;
}

interface MammogramImageSummary {
  id: number;
  file_path: string;
  uploaded_at: string;
}

interface PatientDetailRecord extends PatientRecord {
  analyses: AnalysisSummary[];
  images: MammogramImageSummary[];
}

const RECORDS_PER_PAGE_OPTIONS = [5, 10, 20, 50];

interface NewPatientFormState {
  name: string;
  age: string;
  lastScan: string;
  totalScans: string;
  status: string;
  riskLevel: string;
}

const STATUS_OPTIONS = ["Active", "Pending Review", "Inactive"] as const;
const RISK_LEVEL_OPTIONS = ["Low", "Moderate", "High"] as const;

const RISK_TO_BIRADS: Record<string, string> = {
  Low: "BI-RADS 2",
  Moderate: "BI-RADS 4",
  High: "BI-RADS 5",
};

const RISK_TO_SEVERITY: Record<string, "mild" | "moderate"> = {
  Low: "mild",
  Moderate: "moderate",
  High: "moderate",
};

const API_ORIGIN = import.meta.env?.VITE_API_ORIGIN ?? "";

function resolveAssetUrl(path: string, preferredOrigin?: string): string {
  if (!path) return "";
  if (/^https?:\/\//i.test(path)) {
    return path;
  }

  const sanitizedPath = path.startsWith("/") ? path : `/${path}`;

  const originCandidate = [
    API_ORIGIN,
    preferredOrigin,
    typeof window !== "undefined" ? window.location.origin : "",
  ].find((candidate) => typeof candidate === "string" && candidate.trim().length > 0);

  if (originCandidate) {
    const origin = originCandidate.endsWith("/")
      ? originCandidate.slice(0, -1)
      : originCandidate;
    return `${origin}${sanitizedPath}`;
  }

  return sanitizedPath;
}

const INITIAL_FORM_STATE: NewPatientFormState = {
  name: "",
  age: "",
  lastScan: "",
  totalScans: "",
  status: STATUS_OPTIONS[0],
  riskLevel: RISK_LEVEL_OPTIONS[0],
};

interface StreamingTextProps {
  text: string;
  speed?: number;
  className?: string;
}

function StreamingText({ text, speed = 18, className }: StreamingTextProps) {
  const [displayed, setDisplayed] = useState("");

  useEffect(() => {
    setDisplayed("");
    if (!text) return;

    if (typeof window === "undefined") {
      setDisplayed(text);
      return;
    }

    let index = 0;
    const interval = window.setInterval(() => {
      index += 1;
      setDisplayed(text.slice(0, index));

      if (index >= text.length) {
        window.clearInterval(interval);
      }
    }, speed);

    return () => {
      window.clearInterval(interval);
    };
  }, [text, speed]);

  return <span className={className}>{displayed}</span>;
}

export function PatientList() {
  const navigate = useNavigate();
  const { setFormData } = useNewPatient();
  const [searchTerm, setSearchTerm] = useState("");
  const [patients, setPatients] = useState<PatientRecord[]>([]);
  const [selectedPatients, setSelectedPatients] = useState<Set<number>>(new Set<number>());
  const [recordsPerPage, setRecordsPerPage] = useState<number>(10);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deleteConfirmationText, setDeleteConfirmationText] = useState("");
  const [deleteInProgress, setDeleteInProgress] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [isAddPatientDialogOpen, setIsAddPatientDialogOpen] = useState(false);
  const [newPatientForm, setNewPatientForm] = useState<NewPatientFormState>(INITIAL_FORM_STATE);
  const [uploadedImages, setUploadedImages] = useState<File[]>([]);
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPatientDetailOpen, setIsPatientDetailOpen] = useState(false);
  const [patientDetail, setPatientDetail] = useState<PatientDetailRecord | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailError, setDetailError] = useState<string | null>(null);
  const [detailImageIndex, setDetailImageIndex] = useState(0);
  const [carouselApi, setCarouselApi] = useState<CarouselApi | null>(null);
  const [activeDetailId, setActiveDetailId] = useState<number | null>(null);

  const fetchPatients = useCallback(() => {
    fetch("/api/patients")
      .then((response) => response.json())
      .then((data) => {
        const normalized: PatientRecord[] = data.map((patient: any) => ({
          ...patient,
          id: Number(patient.id),
        }));
        setPatients(normalized);
        setSelectedPatients((prev) => {
          const retained = normalized
            .filter((patient) => prev.has(patient.id))
            .map((patient) => patient.id);
          return new Set<number>(retained);
        });
      });
  }, []);

  useEffect(() => {
    fetchPatients();
  }, [fetchPatients]);

  useEffect(() => {
    const handlePatientCreated = () => fetchPatients();
    window.addEventListener("patient-created", handlePatientCreated);
    return () => window.removeEventListener("patient-created", handlePatientCreated);
  }, [fetchPatients]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, recordsPerPage]);

  const filteredPatients = patients.filter((patient) => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return true;
    const nameMatch = patient.name?.toLowerCase().includes(term);
    const idMatch = patient.id?.toString().includes(term);
    return Boolean(nameMatch || idMatch);
  });

  const totalPages = Math.max(1, Math.ceil(filteredPatients.length / recordsPerPage));

  useEffect(() => {
    setCurrentPage((prev) => Math.min(prev, totalPages));
  }, [totalPages]);

  const startIndex = (currentPage - 1) * recordsPerPage;
  const paginatedPatients = filteredPatients.slice(
    startIndex,
    startIndex + recordsPerPage,
  );

  const allFilteredSelected =
    filteredPatients.length > 0 &&
    filteredPatients.every((patient) => selectedPatients.has(patient.id));

  const isIndeterminate =
    selectedPatients.size > 0 && !allFilteredSelected && filteredPatients.length > 0;

  const togglePatientSelection = (id: number) => {
    setSelectedPatients((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleToggleSelectAll = () => {
    setSelectedPatients((prev) => {
      if (allFilteredSelected) {
        return new Set<number>();
      }
      const next = new Set(prev);
      filteredPatients.forEach((patient) => next.add(patient.id));
      return next;
    });
  };

  const handleDeleteClick = () => {
    if (selectedPatients.size === 0) return;
    setDeleteError(null);
    setDeleteConfirmationText("");
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirmed = async () => {
    if (selectedPatients.size === 0) return;
    setDeleteInProgress(true);
    setDeleteError(null);
    try {
      const ids = Array.from(selectedPatients);
      const responses = await Promise.all(
        ids.map((id) =>
          fetch(`/api/patients/${id}`, {
            method: "DELETE",
          }),
        ),
      );
      const failed = responses.find((response) => !response.ok);
      if (failed) {
        throw new Error("A record could not be deleted. Please try again.");
      }
      setIsDeleteDialogOpen(false);
      setDeleteConfirmationText("");
      setSelectedPatients(new Set<number>());
      fetchPatients();
    } catch (error) {
      setDeleteError(
        error instanceof Error
          ? error.message
          : "An unexpected error occurred while deleting records.",
      );
    } finally {
      setDeleteInProgress(false);
    }
  };

  const fetchPatientDetail = useCallback(async (patientId: number) => {
    setDetailLoading(true);
    setDetailError(null);
    setActiveDetailId(patientId);
    try {
      const response = await fetch(`/api/patients/${patientId}`);
      if (!response.ok) {
        throw new Error("Unable to load patient information. Please try again.");
      }
      const data = await response.json();
      let responseOrigin: string | undefined;
      try {
        responseOrigin = new URL(response.url).origin;
      } catch (error) {
        responseOrigin = undefined;
      }
      const normalized: PatientDetailRecord = {
        ...data,
        id: Number(data.id),
        age: data.age ?? undefined,
        totalScans: data.totalScans ?? undefined,
        analyses: Array.isArray(data.analyses)
          ? data.analyses
              .map((analysis: any) => ({
                id: Number(analysis.id),
                date: analysis.date,
                result: analysis.result,
                confidence: Number(analysis.confidence ?? 0),
                status: analysis.status,
              }))
              .sort(
                (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
              )
          : [],
        images: Array.isArray(data.images)
          ? data.images.map((image: any) => ({
              id: Number(image.id),
              file_path: resolveAssetUrl(image.file_path, responseOrigin),
              uploaded_at: image.uploaded_at,
            }))
          : [],
      };

      setPatientDetail(normalized);
      setDetailImageIndex(0);
    } catch (error) {
      setPatientDetail(null);
      setDetailError(
        error instanceof Error
          ? error.message
          : "An unexpected error occurred while loading patient details.",
      );
    } finally {
      setDetailLoading(false);
    }
  }, []);

  const handleViewPatient = (patientId: number) => {
    setIsPatientDetailOpen(true);
    fetchPatientDetail(patientId);
  };

  const handlePatientDetailOpenChange = (open: boolean) => {
    setIsPatientDetailOpen(open);
    if (!open) {
      setPatientDetail(null);
      setDetailError(null);
      setDetailLoading(false);
      setActiveDetailId(null);
      setCarouselApi(null);
      setDetailImageIndex(0);
    }
  };

  const handleOpenInAnalyzer = () => {
    if (!patientDetail) return;

    setFormData({
      name: patientDetail.name ?? "",
      age: patientDetail.age ? String(patientDetail.age) : "",
      images: patientDetail.images.map((image) => image.file_path),
    });

    const latestAnalysis = patientDetail.analyses[0];
    const summary = latestAnalysis
      ? {
          overall: latestAnalysis.result,
          confidence: latestAnalysis.confidence,
          birads: RISK_TO_BIRADS[patientDetail.riskLevel] ?? "BI-RADS 0",
          findings: [
            {
              type: latestAnalysis.result,
              location: "AI detection summary",
              size: `${Math.round(latestAnalysis.confidence)}% confidence`,
              severity: RISK_TO_SEVERITY[patientDetail.riskLevel] ?? "mild",
            },
          ],
          recommendations:
            latestAnalysis.status === "Pending Review"
              ? [
                  "Assign a radiologist for manual review.",
                  "Schedule follow-up imaging within 14 days.",
                ]
              : [
                  "Archive these findings in the patient record.",
                  "Continue routine screening schedule.",
                ],
        }
      : {
          overall: `${patientDetail.riskLevel} risk – analysis not yet generated`,
          confidence: 0,
          birads: RISK_TO_BIRADS[patientDetail.riskLevel] ?? "BI-RADS 0",
          findings: [
            {
              type: "Awaiting AI Analysis",
              location: "AI detection pending",
              size: "N/A",
              severity: RISK_TO_SEVERITY[patientDetail.riskLevel] ?? "mild",
            },
          ],
          recommendations: [
            "Run the analyzer to generate AI-assisted findings.",
            "Verify patient details before saving results.",
          ],
        };

    handlePatientDetailOpenChange(false);
    navigate("/analyzer", {
      state: {
        patientId: patientDetail.id,
        lastScan: patientDetail.lastScan,
        totalScans: patientDetail.totalScans ?? patientDetail.analyses.length ?? 1,
        analysisSummary: summary,
      },
    });
  };

  const detailImages = patientDetail?.images ?? [];
  const imagesCount = detailImages.length;

  const goToDetailImage = useCallback(
    (index: number) => {
      if (imagesCount === 0) return;
      const normalized = ((index % imagesCount) + imagesCount) % imagesCount;
      setDetailImageIndex(normalized);
    },
    [imagesCount],
  );

  const handleDetailImageSelect = (index: number) => {
    goToDetailImage(index);
  };

  const handlePreviousDetailImage = useCallback(() => {
    goToDetailImage(detailImageIndex - 1);
  }, [detailImageIndex, goToDetailImage]);

  const handleNextDetailImage = useCallback(() => {
    goToDetailImage(detailImageIndex + 1);
  }, [detailImageIndex, goToDetailImage]);

  const handleRetryFetchDetails = () => {
    if (activeDetailId !== null) {
      fetchPatientDetail(activeDetailId);
    }
  };

  useEffect(() => {
    if (imagesCount === 0) {
      setDetailImageIndex(0);
      return;
    }

    setDetailImageIndex((current) => {
      if (current >= imagesCount) {
        return imagesCount - 1;
      }
      return current;
    });
  }, [imagesCount]);

  useEffect(() => {
    if (!carouselApi) return;

    const handleSelect = () => {
      const newIndex = carouselApi.selectedScrollSnap();
      setDetailImageIndex((prev) => (prev === newIndex ? prev : newIndex));
    };

    carouselApi.on("select", handleSelect);
    carouselApi.on("reInit", handleSelect);
    handleSelect();

    return () => {
      carouselApi.off("select", handleSelect);
      carouselApi.off("reInit", handleSelect);
    };
  }, [carouselApi]);

  useEffect(() => {
    if (!carouselApi || imagesCount === 0) return;

    const current = carouselApi.selectedScrollSnap();
    if (detailImageIndex !== current) {
      carouselApi.scrollTo(detailImageIndex);
    }
  }, [detailImageIndex, carouselApi, imagesCount]);

  const formatDate = (value: string) => {
    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) {
      return value;
    }
    return parsed.toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatDateTime = (value: string) => {
    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) {
      return value;
    }
    return parsed.toLocaleString();
  };

  const selectedDetailImage =
    imagesCount > 0 && detailImageIndex < imagesCount
      ? detailImages[detailImageIndex]
      : null;
  const latestAnalysis = patientDetail?.analyses?.[0] ?? null;
  const latestStatus = latestAnalysis?.status ?? null;
  const latestStatusIsPending = latestStatus
    ? latestStatus.toLowerCase().includes("pending")
    : false;
  const patientNarrative = patientDetail
    ? `Patient ${patientDetail.name} is ${
        patientDetail.age ?? "N/A"
      } years old with a ${patientDetail.riskLevel.toLowerCase()} risk profile. Last scan on ${formatDate(
        patientDetail.lastScan,
      )} and ${
        patientDetail.totalScans ?? patientDetail.analyses.length ?? 1
      } scans recorded to date.`
    : "";
  const analysisNarrative = latestAnalysis
    ? `AI result ${latestAnalysis.result} with ${Math.round(
        latestAnalysis.confidence,
      )}% confidence. Current status ${latestAnalysis.status}.`
    : "No saved AI analysis. Launch the analyzer to produce fresh findings.";

  const handleDeleteDialogOpenChange = (open: boolean) => {
    setIsDeleteDialogOpen(open);
    if (!open) {
      setDeleteConfirmationText("");
      setDeleteError(null);
      setDeleteInProgress(false);
    }
  };

  const canConfirmDelete =
    deleteConfirmationText.trim().toLowerCase() === "delete" &&
    selectedPatients.size > 0 &&
    !deleteInProgress;

  const pageSummaryStart = filteredPatients.length === 0 ? 0 : startIndex + 1;
  const pageSummaryEnd = filteredPatients.length === 0
    ? 0
    : startIndex + paginatedPatients.length;

  const resetAddPatientState = useCallback(() => {
    setNewPatientForm({ ...INITIAL_FORM_STATE });
    setUploadedImages([]);
    setFormError(null);
    setIsSubmitting(false);
  }, []);

  const handleAddPatientDialogChange = (open: boolean) => {
    setIsAddPatientDialogOpen(open);
    if (!open) {
      resetAddPatientState();
    }
  };

  const handleFormInputChange = (
    field: keyof NewPatientFormState,
  ) => (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const value = event.target.value;
    setNewPatientForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSelectChange = (field: keyof NewPatientFormState) => (value: string) => {
    setNewPatientForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleImageSelection = (event: ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files) return;
    const newFiles = Array.from(event.target.files);
    if (newFiles.length === 0) return;

    setUploadedImages((prev) => {
      const existing = [...prev];
      newFiles.forEach((file) => {
        const alreadyAdded = existing.some(
          (item) =>
            item.name === file.name &&
            item.size === file.size &&
            item.lastModified === file.lastModified,
        );
        if (!alreadyAdded) {
          existing.push(file);
        }
      });
      return existing;
    });

    event.target.value = "";
  };

  const handleRemoveImage = (index: number) => {
    setUploadedImages((prev) => prev.filter((_, idx) => idx !== index));
  };

  const handleAddPatientSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormError(null);

    const trimmedName = newPatientForm.name.trim();
    if (!trimmedName) {
      setFormError("Patient name is required.");
      return;
    }

    if (!newPatientForm.age.trim()) {
      setFormError("Patient age is required.");
      return;
    }

    const ageValue = Number(newPatientForm.age);
    if (!Number.isFinite(ageValue) || ageValue <= 0) {
      setFormError("Enter a valid age greater than 0.");
      return;
    }

    if (!newPatientForm.lastScan) {
      setFormError("Last scan date is required.");
      return;
    }

    if (!newPatientForm.totalScans.trim()) {
      setFormError("Total scans is required.");
      return;
    }

    const totalScansValue = Number(newPatientForm.totalScans);
    if (!Number.isFinite(totalScansValue) || totalScansValue < 0) {
      setFormError("Enter a valid number of scans (0 or more).");
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = new FormData();
      payload.append("name", trimmedName);
      payload.append("age", ageValue.toString());
      payload.append("lastScan", newPatientForm.lastScan);
      payload.append("totalScans", totalScansValue.toString());
      payload.append("status", newPatientForm.status);
      payload.append("riskLevel", newPatientForm.riskLevel);
      uploadedImages.forEach((file) => payload.append("images", file));

      const response = await fetch("/api/patients", {
        method: "POST",
        body: payload,
      });

      if (!response.ok) {
        throw new Error("Unable to create patient. Please try again.");
      }

      resetAddPatientState();
      setIsAddPatientDialogOpen(false);
      setCurrentPage(1);
      window.dispatchEvent(new CustomEvent("patient-created"));
    } catch (error) {
      setFormError(
        error instanceof Error
          ? error.message
          : "An unexpected error occurred while creating the patient.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <NewNavigation>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Patient Records
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Manage and view patient information and screening history.
              </p>
            </div>
            <Button onClick={() => setIsAddPatientDialogOpen(true)}>
              <UserPlus className="h-4 w-4 mr-2" />
              Add New Patient
            </Button>
          </div>
        </div>

        <Card className="shadow-lg">
          <CardHeader className="space-y-4">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <CardTitle>All Patients</CardTitle>
                <CardDescription>
                  {filteredPatients.length} patients found.
                </CardDescription>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
                <div className="flex items-center gap-2">
                  <div className="relative w-full sm:w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search patients..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Button variant="outline" className="whitespace-nowrap">
                    <Filter className="h-4 w-4 mr-2" />
                    Filters
                  </Button>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant={selectedPatients.size > 0 ? "secondary" : "outline"}
                    onClick={handleToggleSelectAll}
                    className="flex items-center gap-2"
                  >
                    <CheckSquare className="h-4 w-4" />
                    {allFilteredSelected ? "Clear selection" : "Select all"}
                  </Button>
                  <div className="flex items-center gap-2">
                    <Label htmlFor="records-per-page" className="text-sm text-gray-600 dark:text-gray-400">
                      Rows per page
                    </Label>
                    <Select
                      value={recordsPerPage.toString()}
                      onValueChange={(value) => {
                        setRecordsPerPage(Number(value));
                        setCurrentPage(1);
                      }}
                    >
                      <SelectTrigger id="records-per-page" className="w-[140px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {RECORDS_PER_PAGE_OPTIONS.map((option) => (
                          <SelectItem key={option} value={option.toString()}>
                            {option} per page
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </div>

            {selectedPatients.size > 0 && (
              <div className="flex flex-col gap-3 rounded-lg border border-brand-100 bg-brand-50 px-4 py-3 text-sm sm:flex-row sm:items-center sm:justify-between">
                <span className="font-medium text-brand-700">
                  {selectedPatients.size} record{selectedPatients.size === 1 ? "" : "s"} selected
                </span>
                <div className="flex items-center gap-3">
                  <Button variant="ghost" onClick={() => setSelectedPatients(new Set<number>())}>
                    Clear
                  </Button>
                  <Button
                    variant="destructive"
                    className="flex items-center gap-2"
                    onClick={handleDeleteClick}
                  >
                    <Trash2 className="h-4 w-4" />
                    Delete selected
                  </Button>
                </div>
              </div>
            )}
          </CardHeader>

          <CardContent className="space-y-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <Checkbox
                      aria-label="Select all patients"
                      checked={isIndeterminate ? "indeterminate" : allFilteredSelected}
                      onCheckedChange={handleToggleSelectAll}
                      disabled={filteredPatients.length === 0}
                    />
                  </TableHead>
                  <TableHead>Patient</TableHead>
                  <TableHead>Risk Level</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Last Scan</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedPatients.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="py-10 text-center text-gray-500 dark:text-gray-400">
                      No patients match the current filters.
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedPatients.map((patient) => {
                    const isSelected = selectedPatients.has(patient.id);
                    return (
                      <TableRow key={patient.id} className={isSelected ? "bg-brand-50/60" : undefined}>
                        <TableCell>
                          <Checkbox
                            aria-label={`Select ${patient.name}`}
                            checked={isSelected}
                            onCheckedChange={() => togglePatientSelection(patient.id)}
                          />
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-4">
                            <Avatar>
                              <AvatarImage src={patient.avatar ?? undefined} />
                              <AvatarFallback>
                                {patient.name?.charAt(0)?.toUpperCase() ?? "?"}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium text-gray-900 dark:text-white">
                                {patient.name}
                              </div>
                              <div className="text-sm text-gray-500 dark:text-gray-400">
                                ID: {patient.id}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              patient.riskLevel === "Low"
                                ? "default"
                                : patient.riskLevel === "Moderate"
                                ? "secondary"
                                : "destructive"
                            }
                          >
                            {patient.riskLevel}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={patient.status === "Active" ? "default" : "secondary"}
                          >
                            {patient.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{patient.lastScan}</TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleViewPatient(patient.id)}
                            aria-label="View analysis"
                          >
                            <FileText className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon">
                            <Calendar className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Showing {pageSummaryStart}-{pageSummaryEnd} of {filteredPatients.length}
              </p>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  aria-label="Previous page"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  Page {currentPage} of {totalPages}
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                  disabled={currentPage >= totalPages}
                  aria-label="Next page"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>

      <Dialog open={isPatientDetailOpen} onOpenChange={handlePatientDetailOpenChange}>
        <DialogContent className="flex h-[85vh] w-[95vw] max-w-none max-h-[90vh] flex-col overflow-hidden px-6 py-6 sm:w-[90vw] sm:max-w-none sm:px-10 lg:w-[85vw]">
          <DialogHeader>
            <DialogTitle>
              {patientDetail ? patientDetail.name : "Patient record"}
            </DialogTitle>
            <DialogDescription>
              Review detections, imaging, and clinical context for this patient.
            </DialogDescription>
          </DialogHeader>

          {detailLoading ? (
            <div className="flex flex-1 items-center justify-center text-gray-500 dark:text-gray-400">
              Loading patient details...
            </div>
          ) : detailError ? (
            <div className="flex flex-1 flex-col items-center justify-center gap-4 text-center">
              <p className="text-sm text-red-600 dark:text-red-400">{detailError}</p>
              <div className="flex justify-center gap-3">
                <Button variant="outline" onClick={() => handlePatientDetailOpenChange(false)}>
                  Close
                </Button>
                <Button onClick={handleRetryFetchDetails}>Try again</Button>
              </div>
            </div>
          ) : patientDetail ? (
            <ResizablePanelGroup
              direction="horizontal"
              className="flex h-full w-full flex-1 overflow-hidden rounded-2xl bg-background/80"
            >
              <ResizablePanel
                defaultSize={70}
                minSize={45}
                className="flex h-full flex-col pr-0 md:pr-6"
              >
                <div className="relative flex-1 overflow-hidden rounded-2xl bg-gray-950 shadow-lg">
                  {imagesCount > 0 ? (
                    <>
                      <Carousel setApi={setCarouselApi} className="h-full w-full">
                        <CarouselContent className="h-full">
                          {detailImages.map((image, index) => (
                            <CarouselItem
                              key={`detail-image-${image.id}`}
                              className="h-full"
                            >
                              <div className="flex h-full w-full items-center justify-center p-4 md:p-6">
                                <img
                                  src={image.file_path}
                                  alt={`Mammogram ${index + 1}`}
                                  className="h-full w-full object-contain"
                                />
                              </div>
                            </CarouselItem>
                          ))}
                        </CarouselContent>
                      </Carousel>

                      <Button
                        type="button"
                        size="icon"
                        variant="secondary"
                        className="absolute left-6 top-1/2 -translate-y-1/2 bg-gray-900/80 text-lg text-white hover:bg-gray-800"
                        onClick={handlePreviousDetailImage}
                        aria-label="View previous mammogram"
                        disabled={imagesCount <= 1}
                      >
                        &lt;
                      </Button>
                      <Button
                        type="button"
                        size="icon"
                        variant="secondary"
                        className="absolute right-6 top-1/2 -translate-y-1/2 bg-gray-900/80 text-lg text-white hover:bg-gray-800"
                        onClick={handleNextDetailImage}
                        aria-label="View next mammogram"
                        disabled={imagesCount <= 1}
                      >
                        &gt;
                      </Button>
                      {imagesCount > 1 && (
                        <div className="absolute bottom-6 left-1/2 flex -translate-x-1/2 items-center gap-2 rounded-full bg-gray-950/70 px-3 py-1">
                          {detailImages.map((image, index) => (
                            <button
                              key={`detail-dot-${image.id}`}
                              type="button"
                              onClick={() => handleDetailImageSelect(index)}
                              className="h-2.5 w-2.5"
                              aria-label={`Go to image ${index + 1}`}
                            >
                              <span
                                className={`block h-full w-full rounded-full transition ${
                                  index === detailImageIndex
                                    ? "bg-primary"
                                    : "bg-gray-400/80"
                                }`}
                              />
                            </button>
                          ))}
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="flex h-full w-full items-center justify-center px-6 text-center text-sm text-gray-400">
                      No mammogram images uploaded yet.
                    </div>
                  )}
                </div>

              </ResizablePanel>

              <ResizableHandle withHandle className="mx-3 hidden md:flex" />

              <ResizablePanel
                defaultSize={30}
                minSize={25}
                className="flex h-full flex-col gap-6"
              >
                <div className="flex-1 space-y-6 overflow-y-auto pr-1 md:pr-3">
                  <div className="space-y-4 rounded-2xl border border-gray-200 bg-white/90 p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900/80">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Patient ID</p>
                        <p className="text-lg font-semibold text-gray-900 dark:text-white">#{patientDetail.id}</p>
                      </div>
                      <Badge
                        variant={patientDetail.status === "Active" ? "default" : "secondary"}
                      >
                        {patientDetail.status}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <p className="text-gray-500 dark:text-gray-400">Age</p>
                        <p className="text-base font-medium text-gray-900 dark:text-white">
                          {patientDetail.age ?? "—"}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500 dark:text-gray-400">Last scan</p>
                        <p className="text-base font-medium text-gray-900 dark:text-white">
                          {formatDate(patientDetail.lastScan)}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500 dark:text-gray-400">Risk level</p>
                        <Badge
                          variant={
                            patientDetail.riskLevel === "Low"
                              ? "default"
                              : patientDetail.riskLevel === "Moderate"
                              ? "secondary"
                              : "destructive"
                          }
                        >
                          {patientDetail.riskLevel}
                        </Badge>
                      </div>
                      <div>
                        <p className="text-gray-500 dark:text-gray-400">Total scans</p>
                        <p className="text-base font-medium text-gray-900 dark:text-white">
                          {patientDetail.totalScans ?? patientDetail.analyses.length ?? 1}
                        </p>
                      </div>
                    </div>
                    <StreamingText
                      text={patientNarrative}
                      className="block text-sm text-gray-600 dark:text-gray-400"
                    />
                  </div>

                  <div className="space-y-4 rounded-2xl border border-gray-200 bg-white/90 p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900/80">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                        Latest analysis
                      </h3>
                      {latestAnalysis && (
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {formatDateTime(latestAnalysis.date)}
                        </span>
                      )}
                    </div>
                    {latestAnalysis ? (
                      <div className="space-y-3">
                        <Alert
                          variant={
                            latestAnalysis.result.toLowerCase().includes("suspicious")
                              ? "destructive"
                              : "default"
                          }
                        >
                          <AlertCircle className="h-4 w-4" />
                          <AlertTitle>{latestAnalysis.result}</AlertTitle>
                          <AlertDescription className="flex flex-wrap items-center gap-2 text-sm">
                            <span>
                              Confidence {Math.round(latestAnalysis.confidence)}%
                            </span>
                            {latestStatus && (
                              <span
                                className={`inline-flex items-center rounded-full px-3 py-0.5 text-xs font-semibold ${
                                  latestStatusIsPending
                                    ? "status-pulse bg-red-500/20 text-red-600"
                                    : "bg-emerald-500/20 text-emerald-700"
                                }`}
                              >
                                {latestStatus}
                              </span>
                            )}
                          </AlertDescription>
                        </Alert>
                        <StreamingText
                          text={analysisNarrative}
                          className="block text-sm text-gray-600 dark:text-gray-400"
                        />
                        <div className="grid grid-cols-2 gap-3 text-sm">
                          <div className="rounded-md bg-gray-100 p-3 dark:bg-gray-800">
                            <p className="text-gray-500 dark:text-gray-400">BI-RADS</p>
                            <p className="text-base font-semibold text-gray-900 dark:text-white">
                              {RISK_TO_BIRADS[patientDetail.riskLevel] ?? "BI-RADS 0"}
                            </p>
                          </div>
                          <div className="rounded-md bg-gray-100 p-3 dark:bg-gray-800">
                            <p className="text-gray-500 dark:text-gray-400">Analyses on record</p>
                            <p className="text-base font-semibold text-gray-900 dark:text-white">
                              {patientDetail.analyses.length}
                            </p>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <StreamingText
                        text={analysisNarrative}
                        className="block text-sm text-gray-600 dark:text-gray-400"
                      />
                    )}
                  </div>

                  {patientDetail.analyses.length > 1 && (
                    <div className="space-y-3 rounded-2xl border border-gray-200 bg-white/90 p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900/80">
                      <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                        Previous analyses
                      </h3>
                      <div className="max-h-48 space-y-2 overflow-y-auto pr-1">
                        {patientDetail.analyses.slice(1).map((analysis) => (
                          <div
                            key={analysis.id}
                            className="flex items-center justify-between rounded-md bg-gray-50 px-3 py-2 text-sm dark:bg-gray-900/40"
                          >
                            <div>
                              <p className="font-medium text-gray-900 dark:text-white">{analysis.result}</p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                {formatDateTime(analysis.date)}
                              </p>
                            </div>
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              {Math.round(analysis.confidence)}%
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </ResizablePanel>
            </ResizablePanelGroup>
          ) : (
            <div className="flex flex-1 items-center justify-center text-gray-500 dark:text-gray-400">
              No patient information available.
            </div>
          )}

          <DialogFooter className="mt-4 flex-col gap-2 sm:flex-row sm:justify-end">
            <Button variant="outline" onClick={() => handlePatientDetailOpenChange(false)}>
              Close
            </Button>
            <Button onClick={handleOpenInAnalyzer}>
              Open in Analyzer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isAddPatientDialogOpen} onOpenChange={handleAddPatientDialogChange}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add a new patient</DialogTitle>
            <DialogDescription>
              Capture patient demographics and upload one or more mammogram images for review.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddPatientSubmit} className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="patient-name">Full name</Label>
                <Input
                  id="patient-name"
                  placeholder="e.g. Sarah Johnson"
                  value={newPatientForm.name}
                  onChange={handleFormInputChange("name")}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="patient-age">Age</Label>
                <Input
                  id="patient-age"
                  type="number"
                  min={0}
                  placeholder="52"
                  value={newPatientForm.age}
                  onChange={handleFormInputChange("age")}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="patient-last-scan">Last scan date</Label>
                <Input
                  id="patient-last-scan"
                  type="date"
                  value={newPatientForm.lastScan}
                  onChange={handleFormInputChange("lastScan")}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="patient-total-scans">Total scans</Label>
                <Input
                  id="patient-total-scans"
                  type="number"
                  min={0}
                  placeholder="5"
                  value={newPatientForm.totalScans}
                  onChange={handleFormInputChange("totalScans")}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Status</Label>
                <Select value={newPatientForm.status} onValueChange={handleSelectChange("status")}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {STATUS_OPTIONS.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Risk level</Label>
                <Select value={newPatientForm.riskLevel} onValueChange={handleSelectChange("riskLevel")}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {RISK_LEVEL_OPTIONS.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-3">
              <div className="space-y-2">
                <Label htmlFor="patient-images">Mammogram images</Label>
                <Input
                  id="patient-images"
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageSelection}
                />
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Upload all available views (CC, MLO, etc.). Supported formats include JPG, PNG, and DICOM exports.
                </p>
              </div>
              {uploadedImages.length > 0 && (
                <ul className="divide-y divide-gray-200 rounded-md border border-gray-200 dark:divide-gray-800 dark:border-gray-800">
                  {uploadedImages.map((file, index) => (
                    <li key={`${file.name}-${file.lastModified}`} className="flex items-center justify-between gap-4 px-4 py-2">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-gray-900 dark:text-gray-100">{file.name}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {(file.size / 1024).toFixed(1)} KB
                        </p>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveImage(index)}
                      >
                        Remove
                      </Button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {formError && <p className="text-sm text-destructive">{formError}</p>}

            <DialogFooter className="gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => handleAddPatientDialogChange(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : "Save patient"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={isDeleteDialogOpen} onOpenChange={handleDeleteDialogOpenChange}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Delete selected records?</DialogTitle>
            <DialogDescription>
              Deleting these records cannot be undone. This action will permanently remove the selected patient profiles and their related analyses.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              To confirm, please type <span className="font-semibold text-destructive">delete</span> below.
            </p>
            <Input
              autoFocus
              placeholder="Type delete to confirm"
              value={deleteConfirmationText}
              onChange={(event) => setDeleteConfirmationText(event.target.value)}
            />
            {deleteError && (
              <p className="text-sm text-destructive">{deleteError}</p>
            )}
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => onDialogOpenChange(false)}
              disabled={deleteInProgress}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteConfirmed}
              disabled={!canConfirmDelete}
            >
              {deleteInProgress ? "Deleting..." : "Delete records"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </NewNavigation>
  );
}
