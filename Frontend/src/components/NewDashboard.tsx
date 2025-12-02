import {
  Activity,
  AlertTriangle,
  FileText,
  TrendingUp,
  Upload,
  Users,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

import { Badge } from "./ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import NewNavigation from "./NewNavigation";

const statDetails = {
  "Total Scans": {
    icon: FileText,
    color: "text-blue-600",
    bgColor: "bg-blue-100",
  },
  "Active Patients": {
    icon: Users,
    color: "text-green-600",
    bgColor: "bg-green-100",
  },
  "Pending Reviews": {
    icon: AlertTriangle,
    color: "text-orange-600",
    bgColor: "bg-orange-100",
  },
  "Detection Rate": {
    icon: TrendingUp,
    color: "text-purple-600",
    bgColor: "bg-purple-100",
  },
};

export default function NewDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState([]);
  const [recentAnalyses, setRecentAnalyses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch stats
        const statsResponse = await fetch("/api/stats");
        if (!statsResponse.ok) {
          throw new Error(`Failed to fetch stats: ${statsResponse.statusText}`);
        }
        const statsData = await statsResponse.json();
        const enhancedStats = statsData.map((stat: any) => ({
          ...stat,
          ...statDetails[stat.title as keyof typeof statDetails],
        }));
        setStats(enhancedStats);

        // Fetch recent analyses
        const analysesResponse = await fetch("/api/recent-analyses");
        if (!analysesResponse.ok) {
          throw new Error(`Failed to fetch analyses: ${analysesResponse.statusText}`);
        }
        const analysesData = await analysesResponse.json();
        setRecentAnalyses(analysesData);
      } catch (err) {
        console.error("Dashboard fetch error:", err);
        setError(err instanceof Error ? err.message : "Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <NewNavigation>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Dashboard Overview
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Monitor your breast cancer detection analytics and recent activity
          </p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <Activity className="h-12 w-12 text-brand-600 animate-spin mx-auto mb-4" />
              <p className="text-gray-600">Loading dashboard...</p>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-8">
            <div className="flex items-center gap-3 mb-2">
              <AlertTriangle className="h-6 w-6 text-red-600" />
              <h3 className="text-lg font-semibold text-red-900">Error Loading Dashboard</h3>
            </div>
            <p className="text-red-700 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Retry
            </button>
          </div>
        )}

        {/* Dashboard Content */}
        {!loading && !error && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {stats.map((stat: any) => (
                <Card
                  key={stat.title}
                  className="bg-white dark:bg-gray-800 shadow-lg rounded-lg"
                >
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                        <stat.icon className={`h-6 w-6 ${stat.color}`} />
                      </div>
                      <span
                        className={`text-sm font-semibold ${
                          stat.change.startsWith("+")
                            ? "text-green-500"
                            : "text-red-500"
                        }`}
                      >
                        {stat.change}
                      </span>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                      {stat.value}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      {stat.title}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card
            className="cursor-pointer hover:shadow-xl transition-shadow bg-white dark:bg-gray-800 rounded-lg"
            onClick={() => navigate("/analyzer")}
          >
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-4 bg-blue-100 rounded-lg">
                  <Upload className="h-8 w-8 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                    New Analysis
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Upload and analyze mammograph
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-xl transition-shadow bg-white dark:bg-gray-800 rounded-lg">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-4 bg-green-100 rounded-lg">
                  <Users className="h-8 w-8 text-green-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                    Patient Records
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    View all patient data
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-xl transition-shadow bg-white dark:bg-gray-800 rounded-lg">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-4 bg-purple-100 rounded-lg">
                  <Activity className="h-8 w-8 text-purple-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                    View Reports
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Generate detailed reports
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        <Card className="bg-white dark:bg-gray-800 shadow-lg rounded-lg">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-gray-900 dark:text-white">
              Recent Analyses
            </CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-400">
              Latest mammograph screenings and results
            </CardDescription>
          </CardHeader>
          <CardContent>
            {recentAnalyses.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 dark:text-gray-400">No recent analyses found</p>
                <button
                  onClick={() => navigate("/analyzer")}
                  className="mt-4 px-4 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition-colors"
                >
                  Start New Analysis
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-gray-600 dark:text-gray-400">
                        Analysis ID
                      </TableHead>
                      <TableHead className="text-gray-600 dark:text-gray-400">
                        Patient ID
                      </TableHead>
                      <TableHead className="text-gray-600 dark:text-gray-400">
                        Date & Time
                      </TableHead>
                      <TableHead className="text-gray-600 dark:text-gray-400">
                        Result
                      </TableHead>
                      <TableHead className="text-gray-600 dark:text-gray-400">
                        Confidence
                      </TableHead>
                      <TableHead className="text-gray-600 dark:text-gray-400">
                        Status
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentAnalyses.map((analysis: any) => (
                    <TableRow
                      key={analysis.id}
                      className="hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                      <TableCell className="font-medium text-gray-900 dark:text-white">
                        {`AN-${analysis.id}`}
                      </TableCell>
                      <TableCell className="text-gray-900 dark:text-white">
                        {`PT-${analysis.patient_id}`}
                      </TableCell>
                      <TableCell className="text-gray-600 dark:text-gray-400">
                        {new Date(analysis.date).toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            analysis.result === "Normal"
                              ? "default"
                              : analysis.result === "Suspicious"
                              ? "secondary"
                              : "destructive"
                          }
                        >
                          {analysis.result}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-gray-900 dark:text-white">
                        {analysis.confidence}%
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            analysis.status === "Completed"
                              ? "default"
                              : analysis.status === "Pending Review"
                              ? "secondary"
                              : "outline"
                          }
                        >
                          {analysis.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            )}
          </CardContent>
        </Card>
        </>
        )}
      </main>
    </NewNavigation>
  );
}
