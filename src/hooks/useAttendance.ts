import { useState, useCallback } from "react";
import {
  attendanceApi,
  type Attendance,
  type RecordVisitDto,
} from "@/api";

export function useAttendance() {
  const [attendance, setAttendance] = useState<Attendance[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getAttendanceByClass = useCallback(async (classId: number) => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await attendanceApi.getByClass(classId);
      setAttendance(data);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch attendance");
      setAttendance([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getAttendanceByStudent = useCallback(async (studentId: number) => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await attendanceApi.getByStudent(studentId);
      setAttendance(data);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch attendance");
      setAttendance([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const recordVisit = async (data: RecordVisitDto) => {
    try {
      setIsLoading(true);
      await attendanceApi.recordVisit(data);
      // Optimistically update or refetch
      // For now, let's just refetch if we know the context, but simpler to just return success
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to record visit");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    attendance,
    isLoading,
    error,
    getAttendanceByClass,
    getAttendanceByStudent,
    recordVisit,
  };
}