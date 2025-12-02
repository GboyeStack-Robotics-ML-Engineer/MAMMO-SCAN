import { useState } from "react";
import {
  Activity,
  Upload,
  Users,
  Bell,
  Settings,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "./ui/button";
import { useLocation, useNavigate } from "react-router-dom";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";

export default function NewNavigation({
  children,
  isCollapsed: externalCollapsed,
}: {
  children: React.ReactNode;
  isCollapsed?: boolean;
}) {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [internalCollapsed, setInternalCollapsed] = useState(false);
  const isCollapsed = externalCollapsed ?? internalCollapsed;

  const navItems = [
    {
      path: "/dashboard",
      icon: Activity,
      label: "Dashboard",
    },
    {
      path: "/analyzer",
      icon: Upload,
      label: "Analyzer",
    },
    {
      path: "/patients",
      icon: Users,
      label: "Patients",
    },
  ];

  return (
    <>
      <aside
        className={`fixed top-0 left-0 h-full bg-brand-900 text-brand-50 transition-all duration-300 ${
          isCollapsed ? "w-20" : "w-64"
        }`}
      >
        <div className="flex items-center justify-between h-16 p-4">
          {!isCollapsed && (
            <a href="/" className="flex items-center space-x-3 cursor-pointer hover:opacity-80 transition-opacity">
              <div className="w-10 h-10 bg-brand-500 rounded-lg flex items-center justify-center">
                <Activity className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-white">Mammo Scan</h2>
              </div>
            </a>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setInternalCollapsed(!isCollapsed)}
            className="text-white hover:bg-brand-700"
          >
            {isCollapsed ? <ChevronRight /> : <ChevronLeft />}
          </Button>
        </div>
        <nav className="mt-8">
          <TooltipProvider>
            {navItems.map((item) => (
              <Tooltip key={item.path} delayDuration={0}>
                <TooltipTrigger asChild>
                  <button
                    onClick={() => navigate(item.path)}
                    className={`w-full flex items-center p-4 transition-colors ${
                      pathname === item.path
                        ? "bg-brand-500 text-white"
                        : "text-brand-100 hover:bg-brand-700 hover:text-white"
                    } ${isCollapsed ? "justify-center" : ""}`}
                  >
                    <item.icon className="h-6 w-6" />
                    {!isCollapsed && <span className="ml-4">{item.label}</span>}
                  </button>
                </TooltipTrigger>
                {isCollapsed && (
                  <TooltipContent side="right" className="bg-brand-700 text-white border-0">
                    {item.label}
                  </TooltipContent>
                )}
              </Tooltip>
            ))}
          </TooltipProvider>
        </nav>
        <div className="absolute bottom-0 w-full p-4 border-t border-brand-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-brand-500 rounded-full flex items-center justify-center text-white">
                EC
              </div>
              {!isCollapsed && (
                <div>
                  <p className="text-white">Dr. Emily Chen</p>
                  <p className="text-brand-100 text-sm">Radiologist</p>
                </div>
              )}
            </div>
            {!isCollapsed && (
              <Button variant="ghost" size="sm" className="text-brand-100 hover:text-white">
                <Settings />
              </Button>
            )}
          </div>
        </div>
      </aside>
      <div
        className={`transition-all duration-300 ${
          isCollapsed ? "ml-20" : "ml-64"
        }`}
      >
        {children}
      </div>
    </>
  );
}
