import { NavLink, useNavigate } from "react-router";
import {
  Users,
  Calendar,
  ClipboardCheck,
  LogOut,
  GraduationCap,
  BookOpen,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

const navItems = [
  {
    title: "Students",
    href: "/dashboard/students",
    icon: Users,
  },
  {
    title: "Class Schedules",
    href: "/dashboard/schedules",
    icon: Calendar,
  },
  {
    title: "Attendance",
    href: "/dashboard/attendance",
    icon: ClipboardCheck,
  },
  {
    title: "Available Courses",
    href: "/dashboard/courses",
    icon: BookOpen,
  },
  {
    title: "Faculty",
    href: "/dashboard/teachers",
    icon: Users,
  },
  {
    title: "Admin",
    href: "/dashboard/admin",
    icon: ClipboardCheck, // Reusing icon for now
  },
];

export function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const getInitials = (email: string) => {
    const name = email.split("@")[0];
    return name.slice(0, 2).toUpperCase();
  };

  return (
    <aside className="flex h-screen w-64 flex-col border-r bg-sidebar text-sidebar-foreground">
      <div className="flex h-16 items-center gap-3 border-b border-sidebar-border px-6">
        <div className="flex h-8 w-8 items-center justify-center rounded-md bg-sidebar-primary text-sidebar-primary-foreground">
          <GraduationCap className="h-5 w-5" />
        </div>
        <span className="text-lg font-bold tracking-tight">UniverPortal</span>
      </div>

      <nav className="flex-1 space-y-0.5 p-4">
        {navItems.map((item) => (
          <NavLink
            key={item.href}
            to={item.href}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-muted-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
              )
            }
          >
            <item.icon className="h-4 w-4" />
            {item.title}
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-sidebar-border p-4">
        <div className="flex items-center gap-3 rounded-md border border-sidebar-border/50 bg-background/50 px-3 py-2">
          <Avatar className="h-8 w-8 rounded-md">
            <AvatarFallback className="rounded-md bg-primary/10 text-primary text-xs font-bold">
              {user?.email ? getInitials(user.email) : "U"}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 overflow-hidden">
            <p className="truncate text-sm font-medium leading-none">
              {user?.email?.split("@")[0]}
            </p>
            <p className="truncate text-xs text-muted-foreground mt-0.5">
              {user?.role || "Student"}
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleLogout}
            className="h-7 w-7 shrink-0 text-muted-foreground hover:text-foreground"
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </aside>
  );
}
