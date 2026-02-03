import { useState, useCallback } from "react";
import { studentsApi, type Student } from "@/api";

export function useStudents() {
  const [student, setStudent] = useState<Student | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getStudent = useCallback(async (id: number) => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await studentsApi.getById(id);
      setStudent(data);
      return data;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to fetch student";
      setError(message);
      setStudent(null);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getStudentCourses = useCallback(async (id: number) => {
    try {
      setIsLoading(true);
      setError(null);
      return await studentsApi.getCourses(id);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to fetch courses";
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getMyCourses = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      return await studentsApi.getMyCourses();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to fetch courses";
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    student,
    isLoading,
    error,
    getStudent,
    getStudentCourses,
    getMyCourses,
  };
}