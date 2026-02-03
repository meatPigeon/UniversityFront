import { useState, useEffect } from "react";
import { Mail, Users, Search, Loader2 } from "lucide-react";

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import type { Teacher, ClassSchedule, Student, Course } from "@/api/types";
import { useAuth } from "@/contexts/AuthContext";
import { schedulesApi, teachersApi, coursesApi } from "@/api";

export function TeachersPage() {
    const { user } = useAuth();

    // Search State (Directory Replacement)
    const [searchId, setSearchId] = useState("");
    const [searchedTeacher, setSearchedTeacher] = useState<Teacher | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Teacher View State
    const [myCourses, setMyCourses] = useState<{ course: Course, schedule: ClassSchedule[] }[]>([]);
    const [selectedCourseId, setSelectedCourseId] = useState<number | null>(null);
    const [courseStudents, setCourseStudents] = useState<Student[]>([]);

    // Default mode is directory unless teacher
    const viewMode = user?.role === 'teacher' ? 'my-classes' : 'directory';

    const handleSearch = async () => {
        if (!searchId) return;
        setIsLoading(true);
        setError(null);
        try {
            const data = await teachersApi.getById(parseInt(searchId));
            setSearchedTeacher(data);
        } catch (e) {
            setSearchedTeacher(null);
            setError("Teacher not found");
        } finally {
            setIsLoading(false);
        }
    };

    // Load Teacher's Own Classes
    useEffect(() => {
        if (user?.role === 'teacher' && user.teacher_id && viewMode === 'my-classes') {
            const loadMyClasses = async () => {
                try {
                    // 1. Get all schedules
                    const allSchedules = await schedulesApi.getAll();
                    // 2. Filter by my teacher_id
                    const mySchedules = allSchedules.filter(s => s.teacher_id === user.teacher_id);

                    // 3. Group by Course (we need course details)
                    // Since schedule has course_id, we can group.
                    // We might need to fetch course details if not embedded.
                    // Let's fetch all courses to map names if needed, or rely on schedule.class_name if accurate enough (it's not course name).
                    const allCourses = await coursesApi.getAll();

                    const grouped = new Map<number, { course: Course, schedule: ClassSchedule[] }>();

                    mySchedules.forEach(sched => {
                        if (!grouped.has(sched.course_id)) {
                            const course = allCourses.find(c => c.course_id === sched.course_id);
                            if (course) {
                                grouped.set(sched.course_id, { course, schedule: [] });
                            }
                        }
                        grouped.get(sched.course_id)?.schedule.push(sched);
                    });

                    setMyCourses(Array.from(grouped.values()));
                } catch {
                    // console.error(e);
                }
            };
            loadMyClasses();
        }
    }, [user, viewMode]);

    // Load Students for Selected Course
    useEffect(() => {
        if (selectedCourseId) {
            teachersApi.getCourseStudents(selectedCourseId)
                .then(setCourseStudents)
                .catch(() => setCourseStudents([]));
        }
    }, [selectedCourseId]);

    const getInitials = (name: string) => name.split(" ").map(n => n[0]).join("").toUpperCase();

    // Teacher Dashboard View
    if (user?.role === 'teacher' && viewMode === 'my-classes') {
        return (
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">My Classes</h1>
                        <p className="text-muted-foreground">Manage your courses and view enrolled students</p>
                    </div>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                    {myCourses.map(({ course, schedule }) => (
                        <Card
                            key={course.course_id}
                            className="hover:border-primary/50 cursor-pointer transition-colors"
                            onClick={() => setSelectedCourseId(course.course_id)}
                        >
                            <CardHeader>
                                <CardTitle className="flex justify-between">
                                    {course.name}
                                    <Badge>{course.department}</Badge>
                                </CardTitle>
                                <CardDescription>{course.description}</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="text-sm text-muted-foreground mb-4">
                                    {schedule.length} Upcoming Sessions
                                </div>
                                <div className="flex items-center gap-2 text-primary font-medium">
                                    <Users className="h-4 w-4" /> View Enrolled Students
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                    {myCourses.length === 0 && <p>No classes assigned.</p>}
                </div>

                <Dialog open={!!selectedCourseId} onOpenChange={(open) => !open && setSelectedCourseId(null)}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Enrolled Students</DialogTitle>
                            <DialogDescription>
                                Students registered for this course
                            </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-3 mt-4">
                            {courseStudents.length > 0 ? (
                                courseStudents.map(student => (
                                    <div key={student.student_id} className="flex items-center justify-between p-2 border rounded-md">
                                        <div className="flex items-center gap-3">
                                            <Avatar className="h-8 w-8">
                                                <AvatarFallback>{getInitials(student.student_name)}</AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <div className="font-medium">{student.student_name}</div>
                                                <div className="text-xs text-muted-foreground">{student.email}</div>
                                            </div>
                                        </div>
                                        <div className="text-xs text-muted-foreground">ID: {student.student_id}</div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-muted-foreground">No students found.</p>
                            )}
                        </div>
                    </DialogContent>
                </Dialog>
            </div>
        );
    }

    // Default Faculty/Admin View (Find Teacher)
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Find Teacher</h1>
                    <p className="text-muted-foreground">
                        Search for a teacher by their ID
                    </p>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Search Teacher</CardTitle>
                    <CardDescription>
                        Enter Teacher ID to view details
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex w-full max-w-sm items-center space-x-2">
                        <Input
                            type="number"
                            placeholder="Teacher ID"
                            value={searchId}
                            onChange={(e) => setSearchId(e.target.value)}
                        />
                        <Button onClick={handleSearch} disabled={isLoading || !searchId}>
                            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                            <span className="ml-2">Search</span>
                        </Button>
                    </div>
                    {error && <p className="text-destructive mt-2">{error}</p>}
                </CardContent>
            </Card>

            {searchedTeacher && (
                <Card>
                    <CardHeader className="flex flex-row items-center gap-4">
                        <Avatar className="h-20 w-20 rounded-md border">
                            <AvatarFallback className="rounded-md bg-muted text-2xl font-bold">
                                {getInitials(searchedTeacher.full_name)}
                            </AvatarFallback>
                        </Avatar>
                        <div>
                            <CardTitle className="text-2xl">{searchedTeacher.full_name}</CardTitle>
                            <CardDescription className="text-lg">{searchedTeacher.department}</CardDescription>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="flex items-center text-muted-foreground">
                                <Mail className="h-5 w-5 mr-3" />
                                {searchedTeacher.email}
                            </div>
                            <div className="flex items-center text-muted-foreground">
                                <Users className="h-5 w-5 mr-3" />
                                ID: {searchedTeacher.teacher_id}
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
