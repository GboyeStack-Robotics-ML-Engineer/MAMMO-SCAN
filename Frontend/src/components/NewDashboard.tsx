import {
  Activity,
  AlertTriangle,
  ArrowUpRight,
  BookUser,
  FileText,
  TrendingUp,
  Upload,
  Users,
} from "lucide-react";
import { BarChart, Bar, XAxis, YAxis } from "recharts";
import { useNavigate } from "react-router-dom";

import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "./ui/chart";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import NewNavigation from "./NewNavigation";

export default function NewDashboard() {
  const navigate = useNavigate();
  const stats = [
    {
      title: "Total Scans",
      value: "1,247",
      change: "+12.5%",
      icon: FileText,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
      chartData: [
        { month: "January", value: 186 },
        { month: "February", value: 305 },
        { month: "March", value: 237 },
        { month: "April", value: 73 },
        { month: "May", value: 209 },
        { month: "June", value: 214 },
      ],
    },
    {
      title: "Active Patients",
      value: "892",
      change: "+8.2%",
      icon: Users,
      color: "text-green-600",
      bgColor: "bg-green-100",
      chartData: [
        { month: "January", value: 186 },
        { month: "February", value: 305 },
        { month: "March", value: 237 },
        { month: "April", value: 73 },
        { month: "May", value: 209 },
        { month: "June", value: 214 },
      ],
    },
    {
      title: "Pending Reviews",
      value: "23",
      change: "-5.1%",
      icon: AlertTriangle,
      color: "text-orange-600",
      bgColor: "bg-orange-100",
      chartData: [
        { month: "January", value: 186 },
        { month: "February", value: 305 },
        { month: "March", value: 237 },
        { month: "April", value: 73 },
        { month: "May", value: 209 },
        { month: "June", value: 214 },
      ],
    },
    {
      title: "Detection Rate",
      value: "94.8%",
      change: "+2.3%",
      icon: TrendingUp,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
      chartData: [
        { month: "January", value: 186 },
        { month: "February", value: 305 },
        { month: "March", value: 237 },
        { month: "April", value: 73 },
        { month: "May", value: 209 },
        { month: "June", value: 214 },
      ],
    },
  ];

  const recentAnalyses = [
    {
      id: "AN-001",
      patientId: "PT-2847",
      date: "2025-11-12",
      time: "09:15 AM",
      result: "Normal",
      confidence: 98.5,
      status: "Completed",
    },
    {
      id: "AN-002",
      patientId: "PT-2846",
      date: "2025-11-12",
      time: "08:45 AM",
      result: "Suspicious",
      confidence: 87.2,
      status: "Pending Review",
    },
    {
      id: "AN-003",
      patientId: "PT-2845",
      date: "2025-11-11",
      time: "04:30 PM",
      result: "Normal",
      confidence: 96.8,
      status: "Completed",
    },
    {
      id: "AN-004",
      patientId: "PT-2844",
      date: "2025-11-11",
      time: "03:15 PM",
      result: "Abnormal",
      confidence: 91.4,
      status: "Reviewed",
    },
  ];

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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat) => (
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
                  {recentAnalyses.map((analysis) => (
                    <TableRow
                      key={analysis.id}
                      className="hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                      <TableCell className="font-medium text-gray-900 dark:text-white">
                        {analysis.id}
                      </TableCell>
                      <TableCell className="text-gray-900 dark:text-white">
                        {analysis.patientId}
                      </TableCell>
                      <TableCell className="text-gray-600 dark:text-gray-400">
                        {analysis.date} {analysis.time}
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
          </CardContent>
        </Card>
      </main>
    </NewNavigation>
  );
}
