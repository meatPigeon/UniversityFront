import { Navigate } from "react-router";
import { useAuth } from "@/contexts/auth-context";
import { getDashboardPathByRole } from "@/lib/routes";

export function RoleIndexRedirect() {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <Navigate to={getDashboardPathByRole(user)} replace />;
}
