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
import { ProfilePage } from "./pages/dashboard/profile/page";
import { StudentAttendancePage } from "./pages/dashboard/attendance/student/page";
import { RoleIndexRedirect } from "./components/routes/RoleIndexRedirect";
import { RequireRole } from "./components/routes/RequireRole";

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
        element: <RoleIndexRedirect />,
      },
      {
        path: "students",
        element: <StudentsPage />,
      },
      {
        path: "profile",
        element: <ProfilePage />,
      },
      {
        path: "students/add",
        element: (
          <RequireRole roles={["admin"]}>
            <AddStudentPage />
          </RequireRole>
        ),
      },
      {
        path: "schedules",
        element: <SchedulesPage />,
      },
      {
        path: "attendance",
        element: (
          <RequireRole roles={["admin", "teacher"]}>
            <AttendancePage />
          </RequireRole>
        ),
      },
      {
        path: "attendance/student",
        element: <StudentAttendancePage />,
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
        element: (
          <RequireRole roles={["admin"]}>
            <AdminPage />
          </RequireRole>
        ),
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
