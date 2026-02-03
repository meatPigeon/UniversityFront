import { apiClient } from "./client";
import type { Course } from "./types";

export const coursesApi = {
  getAll: () => apiClient.get<Course[]>("/courses"),
};
