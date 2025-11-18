import { useState, useRef } from 'react';
import { Upload, X, ZoomIn, ZoomOut, Download, AlertCircle, CheckCircle, Info } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Navigation } from './Navigation';
import { Progress } from './ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';

interface MammographAnalyzerProps {
  onNavigate: (view: 'dashboard' | 'analyzer' | 'patients') => void;
}

export function MammographAnalyzer({ onNavigate }: MammographAnalyzerProps) {
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
    
    // Simulate analysis progress
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
    overall: 'Suspicious Area Detected',
    confidence: 87.2,
    birads: 'BI-RADS 4',
    findings: [
      { type: 'Mass', location: 'Upper outer quadrant, left breast', size: '12mm', severity: 'moderate' },
      { type: 'Calcification', location: 'Central region, left breast', size: '5mm cluster', severity: 'mild' },
    ],
    recommendations: [
      'Additional diagnostic mammographic views recommended',
      'Consider ultrasound examination',
      'Consult with radiologist for further evaluation',
      'Follow-up appointment within 2 weeks',
    ],
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation activeView="analyzer" onNavigate={onNavigate} />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-gray-900 mb-2">Mammograph Analyzer</h1>
          <p className="text-gray-600">Upload and analyze mammographic images for breast cancer detection</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Upload and Patient Info */}
          <div className="lg:col-span-1 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Patient Information</CardTitle>
                <CardDescription>Enter patient details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="patientId">Patient ID</Label>
                  <Input id="patientId" placeholder="PT-XXXX" />
                </div>
                <div>
                  <Label htmlFor="patientName">Patient Name</Label>
                  <Input id="patientName" placeholder="Enter name" />
                </div>
                <div>
                  <Label htmlFor="age">Age</Label>
                  <Input id="age" type="number" placeholder="Enter age" />
                </div>
                <div>
                  <Label htmlFor="scanDate">Scan Date</Label>
                  <Input id="scanDate" type="date" defaultValue="2025-11-12" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Upload Mammograph</CardTitle>
                <CardDescription>Support for DICOM, PNG, JPG formats</CardDescription>
              </CardHeader>
              <CardContent>
                <div
                  className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-blue-500 transition-colors"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-900 mb-2">Click to upload</p>
                  <p className="text-gray-500">or drag and drop</p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleFileUpload}
                  />
                </div>

                {uploadedImage && (
                  <div className="mt-4">
                    <Button
                      className="w-full"
                      onClick={handleAnalyze}
                      disabled={isAnalyzing || analysisComplete}
                    >
                      {isAnalyzing ? 'Analyzing...' : analysisComplete ? 'Analysis Complete' : 'Start Analysis'}
                    </Button>
                  </div>
                )}

                {isAnalyzing && (
                  <div className="mt-4">
                    <Label>Analysis Progress</Label>
                    <Progress value={progress} className="mt-2" />
                    <p className="text-gray-600 mt-2">{progress}% Complete</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Middle Column - Image Viewer */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Image Viewer</CardTitle>
                    <CardDescription>Mammographic image with AI detection overlay</CardDescription>
                  </div>
                  {uploadedImage && (
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        <ZoomIn className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <ZoomOut className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {uploadedImage ? (
                  <div className="relative bg-black rounded-lg overflow-hidden" style={{ minHeight: '500px' }}>
                    <img
                      src={uploadedImage}
                      alt="Mammograph"
                      className="w-full h-full object-contain"
                    />
                    {analysisComplete && (
                      <>
                        {/* Detection overlay boxes */}
                        <div className="absolute top-1/3 left-1/2 w-24 h-24 border-2 border-red-500 rounded">
                          <div className="absolute -top-6 left-0 bg-red-500 text-white px-2 py-1 rounded">
                            Mass (87%)
                          </div>
                        </div>
                        <div className="absolute top-1/2 left-1/3 w-16 h-16 border-2 border-orange-500 rounded">
                          <div className="absolute -top-6 left-0 bg-orange-500 text-white px-2 py-1 rounded">
                            Calc (72%)
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                ) : (
                  <div className="bg-gray-100 rounded-lg flex items-center justify-center" style={{ minHeight: '500px' }}>
                    <div className="text-center">
                      <Upload className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600">No image uploaded</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Analysis Results */}
            {analysisComplete && (
              <Card>
                <CardHeader>
                  <CardTitle>Analysis Results</CardTitle>
                  <CardDescription>AI-powered detection and assessment</CardDescription>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="summary">
                    <TabsList className="grid w-full grid-cols-3">
                      <TabsTrigger value="summary">Summary</TabsTrigger>
                      <TabsTrigger value="findings">Findings</TabsTrigger>
                      <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
                    </TabsList>

                    <TabsContent value="summary" className="space-y-4">
                      <Alert>
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Assessment: {mockResults.overall}</AlertTitle>
                        <AlertDescription>
                          Confidence Level: {mockResults.confidence}% | Classification: {mockResults.birads}
                        </AlertDescription>
                      </Alert>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 bg-blue-50 rounded-lg">
                          <p className="text-gray-600 mb-1">Overall Classification</p>
                          <p className="text-gray-900">{mockResults.birads}</p>
                        </div>
                        <div className="p-4 bg-blue-50 rounded-lg">
                          <p className="text-gray-600 mb-1">Confidence Score</p>
                          <p className="text-gray-900">{mockResults.confidence}%</p>
                        </div>
                        <div className="p-4 bg-blue-50 rounded-lg">
                          <p className="text-gray-600 mb-1">Findings Detected</p>
                          <p className="text-gray-900">{mockResults.findings.length} Areas</p>
                        </div>
                        <div className="p-4 bg-blue-50 rounded-lg">
                          <p className="text-gray-600 mb-1">Analysis Date</p>
                          <p className="text-gray-900">Nov 12, 2025</p>
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="findings" className="space-y-4">
                      {mockResults.findings.map((finding, index) => (
                        <div key={index} className="border rounded-lg p-4">
                          <div className="flex items-start justify-between mb-2">
                            <h3 className="text-gray-900">{finding.type}</h3>
                            <span
                              className={`px-2 py-1 rounded ${
                                finding.severity === 'moderate'
                                  ? 'bg-orange-100 text-orange-800'
                                  : 'bg-yellow-100 text-yellow-800'
                              }`}
                            >
                              {finding.severity}
                            </span>
                          </div>
                          <div className="space-y-1">
                            <p className="text-gray-600">
                              <strong>Location:</strong> {finding.location}
                            </p>
                            <p className="text-gray-600">
                              <strong>Size:</strong> {finding.size}
                            </p>
                          </div>
                        </div>
                      ))}
                    </TabsContent>

                    <TabsContent value="recommendations" className="space-y-4">
                      <Alert>
                        <Info className="h-4 w-4" />
                        <AlertTitle>Clinical Recommendations</AlertTitle>
                        <AlertDescription>
                          The following actions are suggested based on AI analysis
                        </AlertDescription>
                      </Alert>

                      <ul className="space-y-2">
                        {mockResults.recommendations.map((rec, index) => (
                          <li key={index} className="flex items-start space-x-2">
                            <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                            <span className="text-gray-700">{rec}</span>
                          </li>
                        ))}
                      </ul>

                      <div className="flex space-x-3 mt-6">
                        <Button className="flex-1">Generate Report</Button>
                        <Button variant="outline" className="flex-1">Save to Records</Button>
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
