import { useState } from "react";
import { Search, Loader2 } from "lucide-react";
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
import { useAttendance } from "@/hooks/useAttendance";
import { RecordAttendanceForm } from "@/components/RecordAttendanceForm";

export function AttendancePage() {
  const [classId, setClassId] = useState("");
  const { attendance, isLoading, error, getAttendanceByClass } = useAttendance();

  const handleSearch = () => {
    if (classId) {
      getAttendanceByClass(parseInt(classId));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Class Attendance</h1>
          <p className="text-muted-foreground">
            View attendance records for a specific class
          </p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Record Attendance</CardTitle>
            <CardDescription>
              Mark a student as Present or Absent
            </CardDescription>
          </CardHeader>
          <CardContent>
            <RecordAttendanceForm />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Search Attendance</CardTitle>
            <CardDescription>
              Enter Class ID to view attendance
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex w-full max-w-sm items-center space-x-2">
              <Input
                type="number"
                placeholder="Class ID"
                value={classId}
                onChange={(e) => setClassId(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              />
              <Button onClick={handleSearch} disabled={isLoading || !classId}>
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                <span className="ml-2">Search</span>
              </Button>
            </div>
            {error && <p className="text-destructive mt-2">{error}</p>}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Attendance Records</CardTitle>
          <CardDescription>
            {attendance && attendance.length > 0
              ? `Showing ${attendance.length} records for Class ID: ${classId}`
              : "No records found or search not initiated"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student ID</TableHead>
                <TableHead>Student Name</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-center">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {attendance?.map((record, index) => (
                <TableRow key={`${record.student_id}-${record.visit_date}-${index}`}>
                  <TableCell>{record.student_id}</TableCell>
                  <TableCell>
                    {record.student?.student_name || "N/A"}
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
