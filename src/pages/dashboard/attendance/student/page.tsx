import { useEffect, useState } from "react";
import { Search, Loader2 } from "lucide-react";
import { useAttendance } from "@/hooks/useAttendance";
import { useAuth } from "@/contexts/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

export function StudentAttendancePage() {
  const { user } = useAuth();
  const { attendance, isLoading, error, getAttendanceByStudent } = useAttendance();
  const [studentId, setStudentId] = useState("");

  useEffect(() => {
    if (user?.role === "student" && user.student_id) {
      getAttendanceByStudent(user.student_id);
    }
  }, [user, getAttendanceByStudent]);

  const handleSearch = () => {
    if (studentId) {
      getAttendanceByStudent(parseInt(studentId));
    }
  };

  const searchDisabled =
    isLoading || (user?.role === "student" && !!user.student_id);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Student Attendance</h1>
          <p className="text-muted-foreground">
            View attendance records by student ID
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Search Attendance</CardTitle>
          <CardDescription>
            {user?.role === "student"
              ? "Your attendance is loaded automatically."
              : "Enter Student ID to view attendance records."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex w-full max-w-sm items-center space-x-2">
            <Input
              type="number"
              placeholder="Student ID"
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              disabled={searchDisabled}
            />
            <Button onClick={handleSearch} disabled={searchDisabled || !studentId}>
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Search className="h-4 w-4" />
              )}
              <span className="ml-2">Search</span>
            </Button>
          </div>
          {user?.role === "student" && !user.student_id && (
            <p className="text-sm text-muted-foreground mt-2">
              No student ID linked to your account.
            </p>
          )}
          {error && <p className="text-destructive mt-2">{error}</p>}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Attendance Records</CardTitle>
          <CardDescription>
            {attendance && attendance.length > 0
              ? `Showing ${attendance.length} records`
              : "No records found or search not initiated"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Class ID</TableHead>
                <TableHead>Class Name</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-center">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {attendance?.map((record, index) => (
                <TableRow key={`${record.class_id}-${record.visit_date}-${index}`}>
                  <TableCell>{record.class_id}</TableCell>
                  <TableCell>
                    {record.class_schedule?.class_name || "N/A"}
                  </TableCell>
                  <TableCell>
                    {new Date(record.visit_date).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-center">
                    {record.present ? (
                      <div className="flex justify-center">
                        <Badge variant="default" className="bg-green-600 hover:bg-green-700">
                          Present
                        </Badge>
                      </div>
                    ) : (
                      <div className="flex justify-center">
                        <Badge variant="destructive">Absent</Badge>
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              ))}
              {(!attendance || attendance.length === 0) && !isLoading && (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-muted-foreground">
                    No records found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
