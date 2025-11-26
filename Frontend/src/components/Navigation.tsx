import { Activity, Upload, Users, Bell, Settings} from 'lucide-react';
import { Button } from './ui/button';
import { useLocation, useNavigate } from 'react-router-dom';


export default function Navigation() {
  const navigate = useNavigate()
  const {pathname} = useLocation()
  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Brand */}
          <div className="flex items-center space-x-8">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <Activity className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-gray-900">MammoDetect AI</h2>
                <p className="text-gray-500">Breast Cancer Detection</p>
              </div>
            </div>

            {/* Navigation Links */}
            <div className="hidden md:flex space-x-1">
              <button
                onClick={() => navigate('/dashboard')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  pathname === '/dashboard'
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <Activity className="h-4 w-4" />
                  <span>Dashboard</span>
                </div>
              </button>

              <button
                onClick={() => navigate('/analyzer')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  pathname === '/analyzer'
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <Upload className="h-4 w-4" />
                  <span>Analyzer</span>
                </div>
              </button>

              <button
                onClick={() => navigate('/patients')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                 pathname === '/patients'
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <Users className="h-4 w-4" />
                  <span>Patients</span>
                </div>
              </button>
            </div>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-3">
            <Button variant="ghost" size="sm">
              <Bell className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="sm">
              <Settings className="h-5 w-5" />
            </Button>
            <div className="h-6 w-px bg-gray-300" />
            <div className="flex items-center space-x-3">
              <div className="text-right">
                <p className="text-gray-900">Dr. Emily Chen</p>
                <p className="text-gray-500">Radiologist</p>
              </div>
              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white">
                EC
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
