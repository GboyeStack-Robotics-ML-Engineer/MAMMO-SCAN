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
import NewNavigation from "./NewNavigation";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Badge } from "./ui/badge";

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
      avatar: "/avatars/01.png",
    },
    {
      id: "PT-2846",
      name: "Maria Garcia",
      age: 48,
      lastScan: "2025-11-12",
      totalScans: 3,
      status: "Pending Review",
      riskLevel: "Moderate",
      avatar: "/avatars/02.png",
    },
    {
      id: "PT-2845",
      name: "Jennifer Lee",
      age: 61,
      lastScan: "2025-11-11",
      totalScans: 8,
      status: "Active",
      riskLevel: "Low",
      avatar: "/avatars/03.png",
    },
    {
      id: "PT-2844",
      name: "Patricia Martinez",
      age: 45,
      lastScan: "2025-11-11",
      totalScans: 2,
      status: "Follow-up Required",
      riskLevel: "High",
      avatar: "/avatars/04.png",
    },
    {
      id: "PT-2843",
      name: "Linda Brown",
      age: 58,
      lastScan: "2025-11-10",
      totalScans: 6,
      status: "Active",
      riskLevel: "Low",
      avatar: "/avatars/05.png",
    },
  ];

  const filteredPatients = patients.filter(
    (patient) =>
      patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <NewNavigation>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Patient Records
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Manage and view patient information and screening history.
              </p>
            </div>
            <Button>
              <UserPlus className="h-4 w-4 mr-2" />
              Add New Patient
            </Button>
          </div>
        </div>

        <Card className="shadow-lg">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>All Patients</CardTitle>
                <CardDescription>
                  {filteredPatients.length} patients found.
                </CardDescription>
              </div>
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search patients..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Button variant="outline">
                  <Filter className="h-4 w-4 mr-2" />
                  Filters
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Patient</TableHead>
                  <TableHead>Risk Level</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Last Scan</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPatients.map((patient) => (
                  <TableRow key={patient.id}>
                    <TableCell>
                      <div className="flex items-center space-x-4">
                        <Avatar>
                          <AvatarImage src={patient.avatar} />
                          <AvatarFallback>
                            {patient.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium text-gray-900 dark:text-white">
                            {patient.name}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {patient.id}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          patient.riskLevel === "Low"
                            ? "default"
                            : patient.riskLevel === "Moderate"
                            ? "secondary"
                            : "destructive"
                        }
                      >
                        {patient.riskLevel}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          patient.status === "Active"
                            ? "default"
                            : "secondary"
                        }
                      >
                        {patient.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{patient.lastScan}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon">
                        <FileText className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <Calendar className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </main>
    </NewNavigation>
  );
}
