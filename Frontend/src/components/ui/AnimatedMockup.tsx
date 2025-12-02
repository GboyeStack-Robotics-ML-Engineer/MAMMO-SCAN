import { useEffect, useState } from 'react';
import { Activity } from 'lucide-react';

export function AnimatedMockup() {
  const [progress, setProgress] = useState(0);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  useEffect(() => {
    // Start animation after component mounts
    const initialDelay = setTimeout(() => {
      setIsAnalyzing(true);
      animateProgress();
    }, 1000);

    return () => clearTimeout(initialDelay);
  }, []);

  const animateProgress = () => {
    setProgress(0);
    let currentProgress = 0;
    
    const interval = setInterval(() => {
      currentProgress += 1;
      setProgress(currentProgress);
      
      if (currentProgress >= 94) {
        clearInterval(interval);
        // Reset and restart after 3 seconds
        setTimeout(() => {
          setIsAnalyzing(false);
          setTimeout(() => {
            setIsAnalyzing(true);
            animateProgress();
          }, 500);
        }, 3000);
      }
    }, 30);
  };

  return (
    <div className="relative w-full perspective-1000 animate-slide-up">
      {/* Main Interface Card */}
      <div className="relative z-10 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden transform transition-all duration-700 hover:scale-[1.02] hover:shadow-3xl">
        {/* Fake Browser Header */}
        <div className="bg-slate-50 border-b border-slate-100 p-4 flex items-center justify-between">
          <div className="flex gap-2">
            <div className="w-3 h-3 rounded-full bg-red-400 animate-pulse"></div>
            <div className="w-3 h-3 rounded-full bg-amber-400 animate-pulse" style={{ animationDelay: '0.2s' }}></div>
            <div className="w-3 h-3 rounded-full bg-green-400 animate-pulse" style={{ animationDelay: '0.4s' }}></div>
          </div>
          <div className="text-xs font-mono text-slate-400">
            mammoscan-dashboard.app
          </div>
          <div className="w-4"></div>
        </div>

        {/* Dashboard Content */}
        <div className="p-6 md:p-8 min-h-[400px] relative overflow-hidden">
          {/* Animated gradient overlay */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-brand-100/30 to-transparent rounded-full blur-3xl animate-pulse" />
          
          {/* Sidebar simulation */}
          <div className="absolute left-0 top-0 w-16 h-full bg-slate-900 flex flex-col items-center py-6 gap-4">
            <div className="w-10 h-10 bg-brand-500 rounded-xl flex items-center justify-center shadow-lg animate-bounce" style={{ animationDelay: '0.5s' }}>
              <Activity className="w-6 h-6 text-white" />
            </div>
            <div className="w-10 h-2 bg-slate-700 rounded animate-pulse"></div>
            <div className="w-10 h-2 bg-slate-700 rounded animate-pulse" style={{ animationDelay: '0.2s' }}></div>
            <div className="w-10 h-2 bg-slate-700 rounded animate-pulse" style={{ animationDelay: '0.4s' }}></div>
          </div>

          {/* Main content area */}
          <div className="ml-20 relative">
            {/* Stats badge with pulse */}
            <div className="absolute top-4 right-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-4 py-2 rounded-full text-xs font-bold flex items-center gap-2 shadow-lg animate-pulse">
              <Activity className="w-4 h-4" />
              <span>DIAGNOSIS SPEED</span>
              <span className="text-lg">10x Faster</span>
            </div>

            {/* Analysis Results Card */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-lg p-6 mt-16 animate-fade-in">
              <h3 className="text-xl font-bold text-slate-900 mb-4">Analysis Results</h3>
              
              {/* Alert box with animation */}
              <div className={`bg-red-50 border-l-4 border-red-500 p-4 mb-6 transform transition-all duration-500 ${isAnalyzing ? 'translate-x-0 opacity-100' : '-translate-x-4 opacity-0'}`}>
                <p className="text-sm font-bold text-red-900 mb-1">SUSPICIOUS MASS</p>
                <p className="text-xs text-red-700">Upper outer quadrant. Shape irregular. BIRADS-4.</p>
              </div>

              {/* AI Confidence with animated progress */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-semibold text-slate-700">AI Confidence</span>
                  <span className={`text-lg font-bold transition-all duration-500 ${isAnalyzing ? 'text-brand-600' : 'text-slate-400'}`}>
                    {progress}%
                  </span>
                </div>
                
                {/* Animated progress bar */}
                <div className="h-3 bg-slate-200 rounded-full overflow-hidden relative">
                  <div
                    className="h-full bg-gradient-to-r from-brand-500 via-brand-600 to-brand-500 rounded-full transition-all duration-500 ease-out relative overflow-hidden"
                    style={{ width: `${progress}%` }}
                  >
                    {/* Shimmer effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
                  </div>
                  
                  {/* Pulse effect at the end of progress */}
                  {progress > 0 && (
                    <div 
                      className="absolute top-0 h-full w-1 bg-white shadow-lg transition-all duration-500"
                      style={{ left: `${progress}%` }}
                    />
                  )}
                </div>
              </div>

              {/* Generate Report Button */}
              <button 
                className={`w-full mt-6 bg-slate-900 text-white py-3 rounded-lg font-semibold transition-all duration-300 ${
                  progress >= 94 ? 'hover:bg-slate-800 hover:shadow-lg scale-100' : 'opacity-50 scale-95'
                }`}
                disabled={progress < 94}
              >
                Generate Report
              </button>
            </div>

            {/* Floating data points animation */}
            <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-purple-500/10 rounded-full blur-xl animate-pulse" style={{ animationDelay: '1s' }} />
            <div className="absolute top-1/2 -left-8 w-16 h-16 bg-cyan-500/10 rounded-full blur-xl animate-pulse" style={{ animationDelay: '1.5s' }} />
          </div>
        </div>
      </div>

      {/* 3D shadow effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-brand-500/5 to-purple-500/5 rounded-2xl blur-2xl -z-10 transform translate-y-4 animate-pulse" />
    </div>
  );
}
