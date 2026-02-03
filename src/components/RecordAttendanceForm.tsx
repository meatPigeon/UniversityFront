import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAttendance } from "@/hooks/useAttendance";
import { Loader2, CheckCircle2 } from "lucide-react";

export function RecordAttendanceForm() {
    const { recordVisit } = useAttendance();
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);

        const formData = new FormData(e.currentTarget);
        const studentId = parseInt(formData.get("studentId") as string);
        const classId = parseInt(formData.get("classId") as string);
        const present = formData.get("status") === "present";

        try {
            await recordVisit({
                student_id: studentId,
                class_id: classId,
                visit_date: new Date().toISOString(),
                present,
            });
            setMessage({ type: 'success', text: "Attendance recorded successfully" });
            (e.target as HTMLFormElement).reset();
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : "Failed to record attendance";
            setMessage({ type: 'error', text: errorMessage });
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
                <Label htmlFor="classId">Class ID</Label>
                <Input id="classId" name="classId" type="number" required placeholder="e.g. 101" />
            </div>
            <div className="space-y-1">
                <Label htmlFor="studentId">Student ID</Label>
                <Input id="studentId" name="studentId" type="number" required placeholder="e.g. 50" />
            </div>
            <div className="space-y-1">
                <Label htmlFor="status">Status</Label>
                <select
                    id="status"
                    name="status"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                    <option value="present">Present</option>
                    <option value="absent">Absent</option>
                </select>
            </div>

            {message && (
                <div className={`text-sm flex items-center gap-2 ${message.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>
                    {message.type === 'success' && <CheckCircle2 className="h-4 w-4" />}
                    {message.text}
                </div>
            )}

            <Button type="submit" disabled={loading} className="w-full">
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Record Attendance
            </Button>
        </form>
    );
}
