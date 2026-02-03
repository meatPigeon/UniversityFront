import { apiClient } from "./client";
import type { ClassSchedule } from "./types";

export const schedulesApi = {
  getAll: () => apiClient.get<ClassSchedule[]>("/all_class_schedule"),
  getStudentSchedule: (studentId: number) =>
    apiClient.get<ClassSchedule[]>(`/student/${studentId}/schedule`),
};