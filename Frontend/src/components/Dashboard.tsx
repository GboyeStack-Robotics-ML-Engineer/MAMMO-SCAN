import { Activity, Upload, Users, FileText, TrendingUp, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { useNavigate } from 'react-router-dom';
import Navigation from './Navigation';
export default function Dashboard() {
  const navigate = useNavigate()
  const stats = [
    {
      title: 'Total Scans',
      value: '1,247',
      change: '+12.5%',
      icon: FileText,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      title: 'Active Patients',
      value: '892',
      change: '+8.2%',
      icon: Users,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      title: 'Pending Reviews',
      value: '23',
      change: '-5.1%',
      icon: AlertTriangle,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
    },
    {
      title: 'Detection Rate',
      value: '94.8%',
      change: '+2.3%',
      icon: TrendingUp,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
  ];

  const recentAnalyses = [
    {
      id: 'AN-001',
      patientId: 'PT-2847',
      date: '2025-11-12',
      time: '09:15 AM',
      result: 'Normal',
      confidence: 98.5,
      status: 'Completed',
    },
    {
      id: 'AN-002',
      patientId: 'PT-2846',
      date: '2025-11-12',
      time: '08:45 AM',
      result: 'Suspicious',
      confidence: 87.2,
      status: 'Pending Review',
    },
    {
      id: 'AN-003',
      patientId: 'PT-2845',
      date: '2025-11-11',
      time: '04:30 PM',
      result: 'Normal',
      confidence: 96.8,
      status: 'Completed',
    },
    {
      id: 'AN-004',
      patientId: 'PT-2844',
      date: '2025-11-11',
      time: '03:15 PM',
      result: 'Abnormal',
      confidence: 91.4,
      status: 'Reviewed',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-gray-900 mb-2">Dashboard Overview</h1>
          <p className="text-gray-600">Monitor your breast cancer detection analytics and recent activity</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat) => (
            <Card key={stat.title}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                    <stat.icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                  <span className={`text-sm ${stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                    {stat.change}
                  </span>
                </div>
                <h3 className="text-gray-900 mb-1">{stat.value}</h3>
                <p className="text-gray-600">{stat.title}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => navigate('/analyzer')}>
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-4 bg-blue-100 rounded-lg">
                  <Upload className="h-8 w-8 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-gray-900 mb-1">New Analysis</h3>
                  <p className="text-gray-600">Upload and analyze mammograph</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-4 bg-green-100 rounded-lg">
                  <Users className="h-8 w-8 text-green-600" />
                </div>
                <div>
                  <h3 className="text-gray-900 mb-1">Patient Records</h3>
                  <p className="text-gray-600">View all patient data</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-4 bg-purple-100 rounded-lg">
                  <Activity className="h-8 w-8 text-purple-600" />
                </div>
                <div>
                  <h3 className="text-gray-900 mb-1">View Reports</h3>
                  <p className="text-gray-600">Generate detailed reports</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Analyses */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Analyses</CardTitle>
            <CardDescription>Latest mammograph screenings and results</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 text-gray-600">Analysis ID</th>
                    <th className="text-left py-3 px-4 text-gray-600">Patient ID</th>
                    <th className="text-left py-3 px-4 text-gray-600">Date & Time</th>
                    <th className="text-left py-3 px-4 text-gray-600">Result</th>
                    <th className="text-left py-3 px-4 text-gray-600">Confidence</th>
                    <th className="text-left py-3 px-4 text-gray-600">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentAnalyses.map((analysis) => (
                    <tr key={analysis.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4 text-gray-900">{analysis.id}</td>
                      <td className="py-3 px-4 text-gray-900">{analysis.patientId}</td>
                      <td className="py-3 px-4 text-gray-600">
                        {analysis.date} {analysis.time}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full ${
                            analysis.result === 'Normal'
                              ? 'bg-green-100 text-green-800'
                              : analysis.result === 'Suspicious'
                              ? 'bg-orange-100 text-orange-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {analysis.result}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-gray-900">{analysis.confidence}%</td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full ${
                            analysis.status === 'Completed'
                              ? 'bg-blue-100 text-blue-800'
                              : analysis.status === 'Pending Review'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {analysis.status}
                        </span>
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
