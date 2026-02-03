import { createBrowserRouter, Navigate, RouterProvider } from "react-router";
import { LoginPage } from "./pages/login/page";
import { RegisterPage } from "./pages/register/page";
import { DashboardLayout } from "./components/layout/DashboardLayout";
import { StudentsPage } from "./pages/dashboard/students/page";
import { SchedulesPage } from "./pages/dashboard/schedules/page";
import { AttendancePage } from "./pages/dashboard/attendance/page";
import { AddStudentPage } from "./pages/dashboard/students/add/page";
import { CoursesPage } from "./pages/dashboard/courses/page";
import { TeachersPage } from "./pages/dashboard/teachers/page";
import { AdminPage } from "./pages/dashboard/admin/page";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/login" replace />,
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/register",
    element: <RegisterPage />,
  },
  {
    path: "/dashboard",
    element: <DashboardLayout />,
    children: [
      {
        index: true,
        element: <Navigate to="/dashboard/students" replace />,
      },
      {
        path: "students",
        element: <StudentsPage />,
      },
      {
        path: "students/add",
        element: <AddStudentPage />,
      },
      {
        path: "schedules",
        element: <SchedulesPage />,
      },
      {
        path: "attendance",
        element: <AttendancePage />,
      },
      {
        path: "courses",
        element: <CoursesPage />,
      },
      {
        path: "teachers",
        element: <TeachersPage />,
      },
      {
        path: "admin",
        element: <AdminPage />,
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
