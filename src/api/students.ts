import { apiClient } from "./client";
import type { Student, Course } from "./types";

export const studentsApi = {
  getAll: () => apiClient.get<Student[]>("/students"),

  getById: (id: number) => apiClient.get<Student>(`/student/${id}`),

  // Public/Admin or Teacher view of a student's courses
  getCourses: (id: number) => apiClient.get<Course[]>(`/student/${id}/courses`),

  // Logged-in student's own courses
  getMyCourses: () => apiClient.get<Course[]>("/api/student/courses"),
};
