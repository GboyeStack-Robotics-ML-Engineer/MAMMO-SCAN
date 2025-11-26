import { useState } from "react";
import { Search, Filter, UserPlus, FileText, Calendar } from "lucide-react";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "./ui/card";
import { Input } from "./ui/input";
import Navigation from "./Navigation";

export function PatientList() {
  const [searchTerm, setSearchTerm] = useState("");

  const patients = [
    {
      id: "PT-2847",
      name: "Sarah Johnson",
      age: 52,
      lastScan: "2025-11-12",
      totalScans: 5,
      status: "Active",
      riskLevel: "Low",
    },
    {
      id: "PT-2846",
      name: "Maria Garcia",
      age: 48,
      lastScan: "2025-11-12",
      totalScans: 3,
      status: "Pending Review",
      riskLevel: "Moderate",
    },
    {
      id: "PT-2845",
      name: "Jennifer Lee",
      age: 61,
      lastScan: "2025-11-11",
      totalScans: 8,
      status: "Active",
      riskLevel: "Low",
    },
    {
      id: "PT-2844",
      name: "Patricia Martinez",
      age: 45,
      lastScan: "2025-11-11",
      totalScans: 2,
      status: "Follow-up Required",
      riskLevel: "High",
    },
    {
      id: "PT-2843",
      name: "Linda Brown",
      age: 58,
      lastScan: "2025-11-10",
      totalScans: 6,
      status: "Active",
      riskLevel: "Low",
    },
    {
      id: "PT-2842",
      name: "Elizabeth Davis",
      age: 54,
      lastScan: "2025-11-09",
      totalScans: 4,
      status: "Active",
      riskLevel: "Moderate",
    },
  ];

  const filteredPatients = patients.filter(
    (patient) =>
      patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-gray-900 mb-2">Patient Records</h1>
              <p className="text-gray-600">
                Manage and view patient information and screening history
              </p>
            </div>
            <Button>
              <UserPlus className="h-4 w-4 mr-2" />
              Add Patient
            </Button>
          </div>
        </div>

        {/* Search and Filter */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex space-x-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search by patient name or ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button variant="outline">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Patient List */}
        <Card>
          <CardHeader>
            <CardTitle>All Patients ({filteredPatients.length})</CardTitle>
            <CardDescription>
              Complete list of registered patients
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 text-gray-600">
                      Patient ID
                    </th>
                    <th className="text-left py-3 px-4 text-gray-600">Name</th>
                    <th className="text-left py-3 px-4 text-gray-600">Age</th>
                    <th className="text-left py-3 px-4 text-gray-600">
                      Last Scan
                    </th>
                    <th className="text-left py-3 px-4 text-gray-600">
                      Total Scans
                    </th>
                    <th className="text-left py-3 px-4 text-gray-600">
                      Status
                    </th>
                    <th className="text-left py-3 px-4 text-gray-600">
                      Risk Level
                    </th>
                    <th className="text-left py-3 px-4 text-gray-600">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPatients.map((patient) => (
                    <tr key={patient.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4 text-gray-900">{patient.id}</td>
                      <td className="py-3 px-4 text-gray-900">
                        {patient.name}
                      </td>
                      <td className="py-3 px-4 text-gray-600">{patient.age}</td>
                      <td className="py-3 px-4 text-gray-600">
                        {patient.lastScan}
                      </td>
                      <td className="py-3 px-4 text-gray-600">
                        {patient.totalScans}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full ${
                            patient.status === "Active"
                              ? "bg-green-100 text-green-800"
                              : patient.status === "Pending Review"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {patient.status}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full ${
                            patient.riskLevel === "Low"
                              ? "bg-blue-100 text-blue-800"
                              : patient.riskLevel === "Moderate"
                              ? "bg-orange-100 text-orange-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {patient.riskLevel}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex space-x-2">
                          <Button variant="ghost" size="sm">
                            <FileText className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Calendar className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
