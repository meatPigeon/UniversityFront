import { useState, useEffect, useCallback } from "react";
import { coursesApi } from "@/api/courses";
import { adminApi } from "@/api/admin";
import type { Course, CreateCourseDto, UpdateCourseDto } from "@/api/types";

export function useCourses() {
    const [courses, setCourses] = useState<Course[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const getAllCourses = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await coursesApi.getAll();
            setCourses(data);
        } catch (err: any) {
            setError(err.message || "Failed to fetch courses");
        } finally {
            setIsLoading(false);
        }
    }, []);

    const createCourse = async (data: CreateCourseDto) => {
        setIsLoading(true);
        try {
            await adminApi.createCourse(data);
            await getAllCourses(); // Refresh list
        } catch (err: any) {
            setError(err.message || "Failed to create course");
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    const updateCourse = async (id: number, data: UpdateCourseDto) => {
        setIsLoading(true);
        try {
            await adminApi.updateCourse(id, data);
            await getAllCourses(); // Refresh list
        } catch (err: any) {
            setError(err.message || "Failed to update course");
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    const deleteCourse = async (id: number) => {
        setIsLoading(true);
        try {
            await adminApi.deleteCourse(id);
            await getAllCourses(); // Refresh list
        } catch (err: any) {
            setError(err.message || "Failed to delete course");
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    // Initial fetch
    useEffect(() => {
        getAllCourses();
    }, [getAllCourses]);

    return {
        courses,
        isLoading,
        error,
        getAllCourses,
        createCourse,
        updateCourse,
        deleteCourse,
    };
}
