import Dashboard from "./components/Dashboard";
import { MammographAnalyzer } from "./components/MammographAnalyzer";
import { PatientList } from "./components/PatientList";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Homepage from "./components/homepage";

const router = createBrowserRouter([
  {
    path: "/",
    children: [
      { index: true, element: <Homepage /> },
      { path: "dashboard", element: <Dashboard /> },
      { path: "analyzer", element: <MammographAnalyzer /> },
      {path: "patients", element: <PatientList/>}
    ],
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
