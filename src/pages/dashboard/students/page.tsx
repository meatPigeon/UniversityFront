import { useState, useEffect } from "react";
import { Search, Loader2, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useStudents } from "@/hooks/useStudents";
import type { Course } from "@/api/types";
import { useAuth } from "@/contexts/AuthContext";
// import type { Student } from "@/api/types"; // Implicitly available via useStudents result if needed

export function StudentsPage() {
  const { user } = useAuth();
  const [studentId, setStudentId] = useState("");
  const [courses, setCourses] = useState<Course[]>([]);

  const {
    student,
    isLoading,
    error,
    getStudent,
    getStudentCourses,
    getMyCourses
  } = useStudents();

  useEffect(() => {
    if (user?.role === 'student') {
      getMyCourses().then(setCourses).catch(console.error);
    }
  }, [user, getMyCourses]);

  const handleSearch = async () => {
    if (!studentId) return;
    try {
      await getStudent(parseInt(studentId));
      const studentCourses = await getStudentCourses(parseInt(studentId));
      setCourses(studentCourses);
    } catch {
      // Error is handled in hook
      setCourses([]);
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Find Student</h1>
          <p className="text-muted-foreground">
            Search for a student by their ID to view details and courses
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Search Student</CardTitle>
          <CardDescription>
            Enter the Student ID to retrieve information
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
            />
            <Button onClick={handleSearch} disabled={isLoading || !studentId}>
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
              <span className="ml-2">Search</span>
            </Button>
          </div>
          {error && <p className="text-destructive mt-2">{error}</p>}
        </CardContent>
      </Card>

      {student && (
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Student Profile</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4 mb-6">
                <Avatar className="h-20 w-20 rounded-md border border-border">
                  <AvatarFallback className="text-2xl rounded-md bg-muted text-foreground font-bold">
                    {getInitials(student.student_name)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="text-2xl font-bold">{student.student_name}</h2>
                  <p className="text-muted-foreground">ID: {student.student_id}</p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Gender</p>
                    <p className="capitalize">{student.gender}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Birth Date</p>
                    <p>{new Date(student.birth_date).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Enrolled Courses</CardTitle>
              <CardDescription>
                Courses currently assigned to this student
              </CardDescription>
            </CardHeader>
            <CardContent>
              {courses.length === 0 ? (
                <p className="text-muted-foreground">No courses found for this student.</p>
              ) : (
                <div className="space-y-4">
                  {courses.map((course) => (
                    <div
                      key={course.course_id}
                      className="flex items-start justify-between rounded-lg border p-4"
                    >
                      <div className="space-y-1">
                        <h4 className="font-semibold flex items-center gap-2">
                          <BookOpen className="h-4 w-4 text-primary" />
                          {course.name}
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          {course.department} • {course.credits} Credits
                        </p>
                        <p className="text-xs text-muted-foreground">{course.description}</p>
                      </div>
                      <Badge variant="secondary">Active</Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}