import { useState, useRef } from "react";
import {
  Upload,
  ZoomIn,
  ZoomOut,
  Download,
  AlertCircle,
  CheckCircle,
  Info,
  ChevronRight,
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
import { Progress } from "./ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";

export function MammographAnalyzer() {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisComplete, setAnalysisComplete] = useState(false);
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedImage(e.target?.result as string);
        setAnalysisComplete(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyze = () => {
    setIsAnalyzing(true);
    setProgress(0);

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsAnalyzing(false);
          setAnalysisComplete(true);
          return 100;
        }
        return prev + 10;
      });
    }, 300);
  };

  const mockResults = {
    overall: "Suspicious Area Detected",
    confidence: 87.2,
    birads: "BI-RADS 4",
    findings: [
      {
        type: "Mass",
        location: "Upper outer quadrant, left breast",
        size: "12mm",
        severity: "moderate",
      },
      {
        type: "Calcification",
        location: "Central region, left breast",
        size: "5mm cluster",
        severity: "mild",
      },
    ],
    recommendations: [
      "Additional diagnostic mammographic views recommended",
      "Consider ultrasound examination",
      "Consult with radiologist for further evaluation",
      "Follow-up appointment within 2 weeks",
    ],
  };

  return (
    <NewNavigation>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Mammograph Analyzer
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Upload and analyze mammographic images for breast cancer detection
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Upload and Patient Info */}
          <div className="lg:col-span-1 space-y-8">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle>1. Patient Information</CardTitle>
                <CardDescription>Enter patient details below.</CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <Label htmlFor="patientId">Patient ID</Label>
                  <Input id="patientId" placeholder="e.g., PT-00123" />
                </div>
                <div className="col-span-2">
                  <Label htmlFor="patientName">Patient Name</Label>
                  <Input id="patientName" placeholder="e.g., Jane Doe" />
                </div>
                <div>
                  <Label htmlFor="age">Age</Label>
                  <Input id="age" type="number" placeholder="e.g., 58" />
                </div>
                <div>
                  <Label htmlFor="scanDate">Scan Date</Label>
                  <Input id="scanDate" type="date" defaultValue="2025-11-12" />
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle>2. Upload Mammograph</CardTitle>
                <CardDescription>
                  DICOM, PNG, or JPG formats supported.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div
                  className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center cursor-pointer hover:border-brand-500 dark:hover:border-brand-400 transition-colors"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="h-12 w-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
                  <p className="text-gray-900 dark:text-white mb-2">
                    Click to upload
                  </p>
                  <p className="text-gray-500 dark:text-gray-400">
                    or drag and drop
                  </p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleFileUpload}
                  />
                </div>

                {uploadedImage && (
                  <div className="mt-6">
                    <Button
                      className="w-full text-lg py-6"
                      onClick={handleAnalyze}
                      disabled={isAnalyzing || analysisComplete}
                    >
                      {isAnalyzing ? (
                        "Analyzing Image..."
                      ) : analysisComplete ? (
                        "Analysis Complete"
                      ) : (
                        <>
                          Start Analysis
                          <ChevronRight className="ml-2 h-5 w-5" />
                        </>
                      )}
                    </Button>
                  </div>
                )}

                {isAnalyzing && (
                  <div className="mt-6">
                    <Progress value={progress} className="h-3" />
                    <p className="text-gray-600 dark:text-gray-400 text-center mt-2">
                      {progress}% Complete
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Image Viewer & Results */}
          <div className="lg:col-span-2 space-y-8">
            <Card className="shadow-lg">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>3. Image Viewer</CardTitle>
                    <CardDescription>
                      AI detection overlays will appear here after analysis.
                    </CardDescription>
                  </div>
                  {uploadedImage && (
                    <div className="flex space-x-2">
                      <Button variant="outline" size="icon">
                        <ZoomIn className="h-5 w-5" />
                      </Button>
                      <Button variant="outline" size="icon">
                        <ZoomOut className="h-5 w-5" />
                      </Button>
                      <Button variant="outline" size="icon">
                        <Download className="h-5 w-5" />
                      </Button>
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="bg-gray-900 rounded-lg overflow-hidden aspect-square">
                  {uploadedImage ? (
                    <div className="relative w-full h-full">
                      <img
                        src={uploadedImage}
                        alt="Mammograph"
                        className="w-full h-full object-contain"
                      />
                      {analysisComplete && (
                        <>
                          <div className="absolute top-1/3 left-1/2 w-24 h-24 border-2 border-red-500 rounded backdrop-blur-sm bg-black/10">
                            <div className="absolute -top-6 left-0 bg-red-500 text-white px-2 py-1 rounded text-xs">
                              Mass (87%)
                            </div>
                          </div>
                          <div className="absolute top-1/2 left-1/3 w-16 h-16 border-2 border-orange-500 rounded backdrop-blur-sm bg-black/10">
                            <div className="absolute -top-6 left-0 bg-orange-500 text-white px-2 py-1 rounded text-xs">
                              Calc (72%)
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <div className="text-center text-gray-500">
                        <Upload className="h-16 w-16 mx-auto mb-4" />
                        <p>Awaiting Image Upload</p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {analysisComplete && (
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle>4. Analysis Results</CardTitle>
                  <CardDescription>
                    AI-powered detection and assessment.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="summary" className="w-full">
                    <TabsList className="grid w-full grid-cols-3">
                      <TabsTrigger value="summary">Summary</TabsTrigger>
                      <TabsTrigger value="findings">Findings</TabsTrigger>
                      <TabsTrigger value="recommendations">
                        Recommendations
                      </TabsTrigger>
                    </TabsList>
                    <TabsContent value="summary" className="mt-6 space-y-6">
                      <Alert variant={mockResults.overall === "Suspicious Area Detected" ? "destructive" : "default"}>
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>
                          {mockResults.overall}
                        </AlertTitle>
                        <AlertDescription>
                          Confidence: {mockResults.confidence}% | BI-RADS: {mockResults.birads}
                        </AlertDescription>
                      </Alert>

                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
                          <p className="text-gray-600 dark:text-gray-400 mb-1">
                            BI-RADS Classification
                          </p>
                          <p className="font-bold text-lg text-gray-900 dark:text-white">{mockResults.birads}</p>
                        </div>
                        <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
                          <p className="text-gray-600 dark:text-gray-400 mb-1">Confidence Score</p>
                          <p className="font-bold text-lg text-gray-900 dark:text-white">
                            {mockResults.confidence}%
                          </p>
                        </div>
                      </div>
                    </TabsContent>
                    <TabsContent value="findings" className="mt-6 space-y-4">
                      {mockResults.findings.map((finding, index) => (
                        <div key={index} className="border dark:border-gray-700 rounded-lg p-4">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="font-semibold text-gray-900 dark:text-white">{finding.type}</h3>
                            <span
                              className={`px-2.5 py-1 text-xs rounded-full ${
                                finding.severity === "moderate"
                                  ? "bg-orange-100 text-orange-800 dark:bg-orange-900/50 dark:text-orange-300"
                                  : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300"
                              }`}
                            >
                              {finding.severity}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            <strong>Location:</strong> {finding.location} | <strong>Size:</strong> {finding.size}
                          </p>
                        </div>
                      ))}
                    </TabsContent>
                    <TabsContent value="recommendations" className="mt-6 space-y-4">
                      <ul className="space-y-3">
                        {mockResults.recommendations.map((rec, index) => (
                          <li
                            key={index}
                            className="flex items-start space-x-3"
                          >
                            <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                            <span className="text-gray-700 dark:text-gray-300">{rec}</span>
                          </li>
                        ))}
                      </ul>
                      <div className="flex space-x-4 pt-4 border-t dark:border-gray-700">
                        <Button className="flex-1">Generate Full Report</Button>
                        <Button variant="secondary" className="flex-1">
                          Save to Patient Record
                        </Button>
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
    </NewNavigation>
  );
}
