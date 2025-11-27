import { MammographAnalyzer } from "./components/MammographAnalyzer";
import { PatientList } from "./components/PatientList";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Homepage from "./components/homepage";
import NewDashboard from './components/NewDashboard'

const router = createBrowserRouter([
  {
    path: "/",
    children: [
      { index: true, element: <Homepage /> },
      { path: "dashboard", element: <NewDashboard /> },
      { path: "analyzer", element: <MammographAnalyzer /> },
      {path: "patients", element: <PatientList/>}
    ],
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
