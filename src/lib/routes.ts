import type { User } from "@/api/types";

export function getDashboardPathByRole(user: User | null | undefined) {
  if (!user) return "/dashboard/students";
  if (user.role === "admin") return "/dashboard/admin";
  if (user.role === "teacher") return "/dashboard/teachers";
  return "/dashboard/students";
}
