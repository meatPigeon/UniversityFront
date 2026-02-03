import { apiClient } from "./client";
import type { Teacher, Student } from "./types";

export const teachersApi = {
  // Public view
  getById: (id: number) => apiClient.get<Teacher>(`/api/teacher/${id}`),

  // Teacher view of students in their course
  getCourseStudents: (courseId: number) =>
    apiClient.get<Student[]>(`/api/teacher/courses/${courseId}/students`),
};
