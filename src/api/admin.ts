import { apiClient } from "./client";
import type {
    Course,
    CreateCourseDto,
    CreateStudentDto,
    CreateTeacherDto,
    Student,
    Teacher,
    UpdateCourseDto,
} from "./types";

export const adminApi = {
    createStudent: (data: CreateStudentDto) =>
        apiClient.post<Student>("/api/admin/students", data),

    createTeacher: (data: CreateTeacherDto) =>
        apiClient.post<Teacher>("/api/admin/teachers", data),

    createCourse: (data: CreateCourseDto) =>
        apiClient.post<Course>("/api/admin/courses", data),

    updateCourse: (id: number, data: UpdateCourseDto) =>
        apiClient.put<Course>(`/api/admin/courses/${id}`, data),

    deleteCourse: (id: number) => apiClient.delete<void>(`/api/admin/courses/${id}`),
};
