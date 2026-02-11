import type { ReactNode } from "react";
import { Navigate } from "react-router";
import { useAuth } from "@/contexts/auth-context";
import { getDashboardPathByRole } from "@/lib/routes";

interface RequireRoleProps {
  roles: Array<"admin" | "teacher" | "student">;
  children: ReactNode;
}

export function RequireRole({ roles, children }: RequireRoleProps) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!roles.includes(user.role)) {
    return <Navigate to={getDashboardPathByRole(user)} replace />;
  }

  return <>{children}</>;
}
