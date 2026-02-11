import { useMemo, useState } from "react";
import { Plus, Pencil, Trash2, BookOpen } from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import { useCourses } from "@/hooks/useCourses";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
    CardFooter
} from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { CreateCourseDto, UpdateCourseDto, Course } from "@/api/types";

export function CoursesPage() {
    const { user } = useAuth();
    const { courses, isLoading, error, createCourse, updateCourse, deleteCourse } = useCourses();
    const [isAdmin] = useState(user?.role === "admin");
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingCourse, setEditingCourse] = useState<Course | null>(null);
    const [filter, setFilter] = useState("");

    // Form State
    const [formData, setFormData] = useState<CreateCourseDto>({
        name: "",
        description: "",
        department: "",
        credits: 3,
    });

    const resetForm = () => {
        setFormData({
            name: "",
            description: "",
            department: "",
            credits: 3,
        });
        setEditingCourse(null);
    };

    const handleOpenChange = (open: boolean) => {
        setIsDialogOpen(open);
        if (!open) resetForm();
    };

    const handleEditClick = (course: Course) => {
        setEditingCourse(course);
        setFormData({
            name: course.name,
            description: course.description,
            department: course.department,
            credits: course.credits,
        });
        setIsDialogOpen(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editingCourse) {
                await updateCourse(editingCourse.course_id, formData as UpdateCourseDto);
            } else {
                await createCourse(formData);
            }
            setIsDialogOpen(false);
        } catch (e) {
            console.error(e);
        }
    };

    const handleDelete = async (id: number) => {
        if (confirm("Are you sure you want to delete this course?")) {
            await deleteCourse(id);
        }
    };

    const filteredCourses = useMemo(() => {
        if (!filter.trim()) return courses;
        const term = filter.trim().toLowerCase();
        return courses.filter((course) =>
            `${course.course_id} ${course.name} ${course.department} ${course.description}`
                .toLowerCase()
                .includes(term)
        );
    }, [courses, filter]);

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Courses</h1>
                    <p className="text-muted-foreground">
                        Explore available courses and curriculum
                    </p>
                </div>
                {isAdmin && (
                    <Dialog open={isDialogOpen} onOpenChange={handleOpenChange}>
                        <DialogTrigger asChild>
                            <Button className="gap-2">
                                <Plus className="h-4 w-4" /> Add Course
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                                <DialogTitle>{editingCourse ? "Edit Course" : "Add New Course"}</DialogTitle>
                                <DialogDescription>
                                    {editingCourse ? "Update the course details below." : "Enter the details for the new course."}
                                </DialogDescription>
                            </DialogHeader>
                            <form onSubmit={handleSubmit}>
                                <div className="grid gap-4 py-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="name">Course Name</Label>
                                        <Input
                                            id="name"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            placeholder="e.g. Intro to Computer Science"
                                            required
                                        />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="department">Department</Label>
                                        <Input
                                            id="department"
                                            value={formData.department}
                                            onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                                            placeholder="e.g. Computer Science"
                                            required
                                        />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="credits">Credits</Label>
                                        <Input
                                            id="credits"
                                            type="number"
                                            value={formData.credits}
                                            onChange={(e) => setFormData({ ...formData, credits: parseInt(e.target.value) })}
                                            required
                                            min={1}
                                        />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="description">Description</Label>
                                        <Input
                                            id="description"
                                            value={formData.description}
                                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                            placeholder="Course description..."
                                        />
                                    </div>
                                </div>
                                <DialogFooter>
                                    <Button type="submit">{editingCourse ? "Save Changes" : "Create Course"}</Button>
                                </DialogFooter>
                            </form>
                        </DialogContent>
                    </Dialog>
                )}
            </div>
            {error && (
                <div className="rounded-md border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                    {error}
                </div>
            )}

            <Tabs defaultValue="available" className="w-full">
                <TabsList className="grid w-full grid-cols-2 max-w-[400px]">
                    <TabsTrigger value="available">Available Courses</TabsTrigger>
                    {isAdmin && <TabsTrigger value="manage">Manage Courses</TabsTrigger>}
                </TabsList>

                <TabsContent value="available" className="mt-6">
                    <div className="mb-4 flex w-full max-w-sm items-center space-x-2">
                        <Input
                            placeholder="Filter by name, department, or ID"
                            value={filter}
                            onChange={(e) => setFilter(e.target.value)}
                        />
                    </div>
                    {isLoading && courses.length === 0 ? (
                        <div className="flex items-center justify-center py-12">
                            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
                        </div>
                    ) : (
                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {filteredCourses.map((course) => (
                                <Card key={course.course_id} className="flex flex-col">
                                    <CardHeader>
                                        <div className="flex justify-between items-start">
                                            <Badge variant="outline" className="mb-2">{course.department}</Badge>
                                            <Badge variant="secondary" className="ml-2">{course.credits} Credits</Badge>
                                        </div>
                                        <CardTitle className="line-clamp-2">{course.name}</CardTitle>
                                        <CardDescription className="line-clamp-3 mt-2">
                                            {course.description || "No description provided."}
                                        </CardDescription>
                                    </CardHeader>
                                    <CardFooter className="mt-auto pt-4 border-t">
                                        <div className="flex w-full items-center text-sm text-muted-foreground">
                                            <BookOpen className="h-4 w-4 mr-2" />
                                            Course ID: {course.course_id}
                                        </div>
                                    </CardFooter>
                                </Card>
                            ))}
                            {filteredCourses.length === 0 && !isLoading && (
                                <div className="col-span-full text-center py-12 text-muted-foreground">
                                    No courses match your filter.
                                </div>
                            )}
                        </div>
                    )}
                </TabsContent>

                {isAdmin && (
                    <TabsContent value="manage" className="mt-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Course Management</CardTitle>
                                <CardDescription>
                                    View and manage all courses in the system.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>ID</TableHead>
                                            <TableHead>Name</TableHead>
                                            <TableHead>Department</TableHead>
                                            <TableHead>Credits</TableHead>
                                            <TableHead className="text-right">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {courses.map((course) => (
                                            <TableRow key={course.course_id}>
                                                <TableCell>{course.course_id}</TableCell>
                                                <TableCell className="font-medium">{course.name}</TableCell>
                                                <TableCell>{course.department}</TableCell>
                                                <TableCell>{course.credits}</TableCell>
                                                <TableCell className="text-right">
                                                    <div className="flex justify-end gap-2">
                                                        <Button variant="ghost" size="icon" onClick={() => handleEditClick(course)}>
                                                            <Pencil className="h-4 w-4" />
                                                        </Button>
                                                        <Button variant="ghost" size="icon" onClick={() => handleDelete(course.course_id)} className="text-destructive hover:text-destructive">
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                    </TabsContent>
                )}
            </Tabs>
        </div>
    );
}
