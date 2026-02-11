import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { adminApi } from "@/api/admin";
import { getErrorMessage } from "@/lib/errors";
// import { useAuth } from "@/contexts/AuthContext";
// import { useNavigate } from "react-router";

export function AdminPage() {
    // const { user } = useAuth();
    // const navigate = useNavigate();

    // If strict RBAC was needed, we'd redirect here.
    // if (user?.role !== 'admin') { ... }

    return (
        <div className="flex-1 space-y-4 p-8 pt-6">
            <div className="flex items-center justify-between space-y-2">
                <h2 className="text-3xl font-bold tracking-tight">Admin Dashboard</h2>
            </div>
            <Tabs defaultValue="students" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="students">Manage Students</TabsTrigger>
                    <TabsTrigger value="teachers">Manage Teachers</TabsTrigger>
                    <TabsTrigger value="courses">Manage Courses</TabsTrigger>
                </TabsList>
                <TabsContent value="students" className="space-y-4">
                    <CreateStudentForm />
                </TabsContent>
                <TabsContent value="teachers" className="space-y-4">
                    <CreateTeacherForm />
                </TabsContent>
                <TabsContent value="courses" className="space-y-4">
                    <CreateCourseForm />
                </TabsContent>
            </Tabs>
        </div>
    );
}

function CreateStudentForm() {
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");
        const formData = new FormData(e.currentTarget);
        try {
            await adminApi.createStudent({
                student_name: formData.get("name") as string,
                email: formData.get("email") as string,
                birth_date: new Date(formData.get("dob") as string).toISOString(),
                gender: formData.get("gender") as string,
            });
            setMessage("Student created successfully!");
            (e.target as HTMLFormElement).reset();
        } catch (err: unknown) {
            setMessage("Error: " + getErrorMessage(err, "Failed to create student"));
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Add New Student</CardTitle>
                <CardDescription>
                    Create a new student profile in the database.
                </CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
                <CardContent className="space-y-2">
                    <div className="space-y-1">
                        <Label htmlFor="s-name">Full Name</Label>
                        <Input id="s-name" name="name" required placeholder="John Doe" />
                    </div>
                    <div className="space-y-1">
                        <Label htmlFor="s-email">Email</Label>
                        <Input id="s-email" name="email" type="email" required placeholder="john@example.com" />
                    </div>
                    <div className="space-y-1">
                        <Label htmlFor="s-dob">Date of Birth</Label>
                        <Input id="s-dob" name="dob" type="date" required />
                    </div>
                    <div className="space-y-1">
                        <Label htmlFor="s-gender">Gender</Label>
                        <select
                            id="s-gender"
                            name="gender"
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>
                    {message && <p className="text-sm text-blue-600 mt-2">{message}</p>}
                </CardContent>
                <CardFooter>
                    <Button type="submit" disabled={loading}>
                        {loading ? "Creating..." : "Create Student"}
                    </Button>
                </CardFooter>
            </form>
        </Card>
    );
}

function CreateTeacherForm() {
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");
        const formData = new FormData(e.currentTarget);
        try {
            await adminApi.createTeacher({
                full_name: formData.get("name") as string,
                email: formData.get("email") as string,
                department: formData.get("department") as string,
            });
            setMessage("Teacher created successfully!");
            (e.target as HTMLFormElement).reset();
        } catch (err: unknown) {
            setMessage("Error: " + getErrorMessage(err, "Failed to create teacher"));
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Add New Teacher</CardTitle>
                <CardDescription>
                    Create a new teacher profile in the database.
                </CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
                <CardContent className="space-y-2">
                    <div className="space-y-1">
                        <Label htmlFor="t-name">Full Name</Label>
                        <Input id="t-name" name="name" required placeholder="Dr. Smith" />
                    </div>
                    <div className="space-y-1">
                        <Label htmlFor="t-email">Email</Label>
                        <Input id="t-email" name="email" type="email" required placeholder="smith@university.edu" />
                    </div>
                    <div className="space-y-1">
                        <Label htmlFor="t-dept">Department</Label>
                        <Input id="t-dept" name="department" required placeholder="Computer Science" />
                    </div>
                    {message && <p className="text-sm text-blue-600 mt-2">{message}</p>}
                </CardContent>
                <CardFooter>
                    <Button type="submit" disabled={loading}>
                        {loading ? "Creating..." : "Create Teacher"}
                    </Button>
                </CardFooter>
            </form>
        </Card>
    );
}

function CreateCourseForm() {
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");
        const formData = new FormData(e.currentTarget);
        try {
            await adminApi.createCourse({
                name: formData.get("name") as string,
                description: formData.get("description") as string,
                department: formData.get("department") as string,
                credits: parseInt(formData.get("credits") as string),
            });
            setMessage("Course created successfully!");
            (e.target as HTMLFormElement).reset();
        } catch (err: unknown) {
            setMessage("Error: " + getErrorMessage(err, "Failed to create course"));
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Add New Course</CardTitle>
                <CardDescription>
                    Create a new course in the catalog.
                </CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
                <CardContent className="space-y-2">
                    <div className="space-y-1">
                        <Label htmlFor="c-name">Course Name</Label>
                        <Input id="c-name" name="name" required placeholder="Intro to Programming" />
                    </div>
                    <div className="space-y-1">
                        <Label htmlFor="c-desc">Description</Label>
                        <Input id="c-desc" name="description" required placeholder="Basic concepts..." />
                    </div>
                    <div className="space-y-1">
                        <Label htmlFor="c-dept">Department</Label>
                        <Input id="c-dept" name="department" required placeholder="CS" />
                    </div>
                    <div className="space-y-1">
                        <Label htmlFor="c-credits">Credits</Label>
                        <Input id="c-credits" name="credits" type="number" required placeholder="3" />
                    </div>
                    {message && <p className="text-sm text-blue-600 mt-2">{message}</p>}
                </CardContent>
                <CardFooter>
                    <Button type="submit" disabled={loading}>
                        {loading ? "Creating..." : "Create Course"}
                    </Button>
                </CardFooter>
            </form>
        </Card>
    );
}
