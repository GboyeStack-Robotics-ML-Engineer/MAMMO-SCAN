import { useState } from 'react';
import { Upload, Sparkles, CheckCircle2, ArrowRight, FileImage, Loader2 } from 'lucide-react';
import { ButtonOn as Button } from './ui/ButtonOn';
import { useNavigate } from 'react-router-dom';

const sampleResults = {
  risk: "Low Risk",
  confidence: 92,
  findings: [
    "No suspicious masses detected",
    "Breast density: Scattered fibroglandular tissue",
    "No significant calcifications",
    "Bilateral symmetry maintained"
  ],
  recommendation: "Routine screening recommended in 12 months"
};

export default function InteractiveDemo() {
  const [isDemoActive, setIsDemoActive] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [progress, setProgress] = useState(0);
  const navigate = useNavigate();

  const handleDemoUpload = () => {
    setIsDemoActive(true);
    setIsAnalyzing(true);
    setProgress(0);
    setShowResults(false);

    // Simulate analysis progress
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsAnalyzing(false);
          setShowResults(true);
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  const resetDemo = () => {
    setIsDemoActive(false);
    setIsAnalyzing(false);
    setShowResults(false);
    setProgress(0);
  };

  return (
    <section className="py-24 bg-gradient-to-br from-slate-50 via-white to-brand-50/30 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-brand-200/20 rounded-full blur-[100px] animate-pulse" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-200/20 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1s' }} />

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-700 text-xs font-bold uppercase tracking-widest mb-6">
            <Sparkles className="w-4 h-4" />
            Try It Yourself
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
            See the AI in Action
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Experience how Mammo Scan analyzes mammograms with a sample scan. No signup required.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden">
            
            {!isDemoActive ? (
              // Upload prompt state
              <div className="p-12 text-center">
                <div className="w-24 h-24 bg-gradient-to-br from-brand-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg animate-pulse">
                  <FileImage className="w-12 h-12 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-3">
                  Ready to see what we can do?
                </h3>
                <p className="text-slate-600 mb-8 max-w-md mx-auto">
                  Click below to analyze a sample mammogram image and see how our AI identifies potential concerns.
                </p>
                <Button
                  onClick={handleDemoUpload}
                  size="lg"
                  className="shadow-lg hover:shadow-xl transition-shadow"
                >
                  <Upload className="w-5 h-5 mr-2" />
                  Analyze Sample Scan
                </Button>
                <p className="text-sm text-slate-500 mt-4">
                  This is a demonstration using a pre-loaded sample image
                </p>
              </div>
            ) : (
              // Analysis/Results state
              <div className="grid md:grid-cols-2">
                {/* Left side - Sample image */}
                <div className="bg-slate-900 p-8 flex items-center justify-center relative">
                  <div className="relative">
                    {/* Placeholder mammogram visualization */}
                    <div className="w-64 h-80 bg-gradient-to-br from-slate-700 to-slate-800 rounded-xl overflow-hidden shadow-2xl">
                      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent" />
                      {/* Simulated tissue patterns */}
                      <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-slate-600/40 rounded-full blur-2xl" />
                      <div className="absolute bottom-1/3 right-1/4 w-24 h-24 bg-slate-500/30 rounded-full blur-xl" />
                    </div>
                    
                    {isAnalyzing && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="bg-brand-500/90 backdrop-blur-sm rounded-full p-4 animate-pulse">
                          <Loader2 className="w-8 h-8 text-white animate-spin" />
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Right side - Results */}
                <div className="p-8">
                  {isAnalyzing ? (
                    <div className="h-full flex flex-col justify-center">
                      <div className="mb-8">
                        <Loader2 className="w-12 h-12 text-brand-600 animate-spin mb-4" />
                        <h3 className="text-2xl font-bold text-slate-900 mb-2">
                          Analyzing Image...
                        </h3>
                        <p className="text-slate-600">
                          Our AI is examining the mammogram for potential findings
                        </p>
                      </div>

                      {/* Progress bar */}
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm text-slate-600 mb-1">
                          <span>Analysis Progress</span>
                          <span className="font-bold text-brand-600">{progress}%</span>
                        </div>
                        <div className="h-3 bg-slate-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-brand-500 to-purple-500 transition-all duration-300 ease-out"
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                      </div>

                      {/* Processing steps */}
                      <div className="mt-8 space-y-3">
                        {[
                          { step: "Loading image data", done: progress > 20 },
                          { step: "Detecting tissue density", done: progress > 40 },
                          { step: "Scanning for anomalies", done: progress > 60 },
                          { step: "Generating report", done: progress > 80 }
                        ].map((item, i) => (
                          <div key={i} className="flex items-center gap-3 text-sm">
                            {item.done ? (
                              <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                            ) : (
                              <div className="w-5 h-5 border-2 border-slate-300 rounded-full flex-shrink-0" />
                            )}
                            <span className={item.done ? "text-slate-900" : "text-slate-400"}>
                              {item.step}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : showResults ? (
                    <div className="h-full flex flex-col">
                      <div className="mb-6">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-100 text-green-700 text-sm font-bold mb-4">
                          <CheckCircle2 className="w-4 h-4" />
                          Analysis Complete
                        </div>
                        <h3 className="text-2xl font-bold text-slate-900 mb-2">
                          {sampleResults.risk}
                        </h3>
                        <p className="text-slate-600">
                          Confidence: <span className="font-bold text-brand-600">{sampleResults.confidence}%</span>
                        </p>
                      </div>

                      {/* Findings */}
                      <div className="mb-6 flex-1">
                        <h4 className="font-bold text-slate-900 mb-3">Key Findings:</h4>
                        <ul className="space-y-2">
                          {sampleResults.findings.map((finding, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                              <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                              <span>{finding}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Recommendation */}
                      <div className="bg-brand-50 rounded-xl p-4 mb-6">
                        <h4 className="font-bold text-slate-900 mb-2 text-sm">Recommendation:</h4>
                        <p className="text-sm text-slate-700">{sampleResults.recommendation}</p>
                      </div>

                      {/* Action buttons */}
                      <div className="flex flex-col sm:flex-row gap-3">
                        <Button onClick={() => navigate('/analyzer')} className="flex-1">
                          Try With Your Own Scan
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                        <Button variant="secondary" onClick={resetDemo} className="flex-1">
                          Run Demo Again
                        </Button>
                      </div>
                    </div>
                  ) : null}
                </div>
              </div>
            )}
          </div>

          {/* Disclaimer */}
          <p className="text-center text-sm text-slate-500 mt-6">
            <strong>Note:</strong> This is a demonstration with simulated data. For actual medical diagnosis, please consult with a qualified healthcare professional.
          </p>
        </div>
      </div>
    </section>
  );
}
