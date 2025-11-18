import { useState } from 'react';
import { Dashboard } from './components/Dashboard';
import { MammographAnalyzer } from './components/MammographAnalyzer';
import { PatientList } from './components/PatientList';

export default function App() {
  const [activeView, setActiveView] = useState<'dashboard' | 'analyzer' | 'patients'>('dashboard');

  return (
    <div className="min-h-screen bg-gray-50">
      {activeView === 'dashboard' && <Dashboard onNavigate={setActiveView} />}
      {activeView === 'analyzer' && <MammographAnalyzer onNavigate={setActiveView} />}
      {activeView === 'patients' && <PatientList onNavigate={setActiveView} />}
    </div>
  );
}
