import { Mail, Shield, IdCard } from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function ProfilePage() {
  const { user } = useAuth();

  const initials = user?.email
    ? user.email.split("@")[0].slice(0, 2).toUpperCase()
    : "U";

  if (!user) {
    return null;
  }

  const roleLabel = user.role.charAt(0).toUpperCase() + user.role.slice(1);
  const primaryId =
    user.role === "student"
      ? user.student_id
      : user.role === "teacher"
      ? user.teacher_id
      : user.user_id;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Profile</h1>
          <p className="text-muted-foreground">
            Account details and access role
          </p>
        </div>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center gap-4">
          <Avatar className="h-16 w-16 rounded-md border border-border">
            <AvatarFallback className="rounded-md bg-muted text-xl font-bold">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="space-y-1">
            <CardTitle className="text-2xl">{user.email}</CardTitle>
            <CardDescription className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              <span>{roleLabel} Access</span>
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="flex items-center gap-3 rounded-md border p-3">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <div className="flex-1 overflow-hidden">
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="truncate font-medium">{user.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-md border p-3">
              <IdCard className="h-4 w-4 text-muted-foreground" />
              <div className="flex-1 overflow-hidden">
                <p className="text-sm text-muted-foreground">Primary ID</p>
                <p className="font-medium">{primaryId ?? "N/A"}</p>
              </div>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            <Badge variant="secondary">User ID: {user.user_id}</Badge>
            {user.student_id && (
              <Badge variant="outline">Student ID: {user.student_id}</Badge>
            )}
            {user.teacher_id && (
              <Badge variant="outline">Teacher ID: {user.teacher_id}</Badge>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
