import { Loader2, Calendar, Clock, MapPin, User } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useSchedules } from "@/hooks/useSchedules";

import { useAuth } from "@/contexts/AuthContext";
import { useEffect } from "react";

export function SchedulesPage() {
  const { user } = useAuth();
  const { schedules, isLoading, error, getStudentSchedule, refetch } = useSchedules();

  useEffect(() => {
    if (user?.role === 'student' && user.student_id) {
      getStudentSchedule(user.student_id);
    } else {
      refetch(); // Default to all
    }
  }, [user, getStudentSchedule, refetch]);

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="text-center">
          <p className="text-destructive">{error}</p>
          <p className="text-sm text-muted-foreground mt-2">
            Make sure the backend server is running
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Class Schedules</h1>
          <p className="text-muted-foreground">
            View all scheduled classes
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {schedules.map((schedule) => (
          <Card key={schedule.class_id} className="hover:border-primary/50 transition-colors cursor-default">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg font-bold truncate pr-2">
                  {schedule.class_name}
                </CardTitle>
                <Badge variant="outline">ID: {schedule.class_id}</Badge>
              </div>
              <CardDescription className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {new Date(schedule.class_date).toLocaleDateString()}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span>
                  {new Date(schedule.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} -{" "}
                  {new Date(schedule.end_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span>Room: {schedule.room}</span>
              </div>
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <span>{schedule.teacher?.full_name || `Teacher ID: ${schedule.teacher_id}`}</span>
              </div>
            </CardContent>
          </Card>
        ))}
        {schedules.length === 0 && (
          <div className="col-span-full flex flex-col items-center justify-center py-12 text-center">
            <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold">No schedules found</h3>
            <p className="text-muted-foreground">Check back later for updated class times.</p>
          </div>
        )}
      </div>
    </div>
  );
}