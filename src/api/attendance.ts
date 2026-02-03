import { apiClient } from "./client";
import type {
  Attendance,
  RecordVisitDto,
} from "./types";

export const attendanceApi = {
  recordVisit: (data: RecordVisitDto) =>
    apiClient.post<Attendance>("/api/attendance/class", data),

  getByClass: (classId: number) =>
    apiClient.get<Attendance[]>(`/attendance/class/${classId}`),

  getByStudent: (studentId: number) =>
    apiClient.get<Attendance[]>(`/attendance/student/${studentId}`),
};