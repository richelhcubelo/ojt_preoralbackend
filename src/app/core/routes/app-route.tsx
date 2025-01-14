import { RouterProvider, createBrowserRouter } from "react-router-dom";
import LoginForm from "../../../shared/login/login";
import Dashboard from "../../domain/admin/dashboard/admin-dashboard";
import Overview from "../../domain/admin/dashboard/admin-overview";
import Coordinator from "../../domain/admin/user-management/user-coordinator";
import Student from "../../domain/admin/user-management/user-student";
import Program from "../../domain/admin/program/admin-program";
import CDashboard from "../../domain/coordinator/dashboard/coordinator-1dashb";
import CoordinatorDashboard from "../../domain/coordinator/dashboard/coordinator-dashboard";
import Attendance from "../../domain/coordinator/attendance/cd-attendance";
import CoordinatorStudent from "../../domain/coordinator/students/cd-student";
import CoordinatorCompany from "../../domain/coordinator/company/cd-company";
import CoordinatorReport from "../../domain/coordinator/report/cd-report";
import CoordinatorAnnouncement from "../../domain/coordinator/announcement/cd-announcement";

export function AppRoute() {

  const router = createBrowserRouter([
    {
      path: "/",
      element: <LoginForm />,
    },
    {
      path: "/dashboard",
      element: <Dashboard />,
      children: [
        {
          path: "overview",
          element: <Overview />,
        },
        {
          path: "coordinator",
          element: <Coordinator />,
        },
        {
          path: "students",
          element: <Student />,
        },
        {
          path: "program",
          element: <Program />,
        },
      ],
    },
    {
      path: "/cddashboard",
      element: <CDashboard />,
      children: [
        {
          path: "coordinator-dashboard",
          element: <CoordinatorDashboard />,
        },
        {
          path: "attendance",
          element: <Attendance />,
        },
        {
          path: "coordinator-students",
          element: <CoordinatorStudent />,
        },
        {
          path: "company",
          element: <CoordinatorCompany />,
        },
        {
          path: "report",
          element: <CoordinatorReport />,
        },
        {
          path: "announcement",
          element: <CoordinatorAnnouncement />,
        },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
}
