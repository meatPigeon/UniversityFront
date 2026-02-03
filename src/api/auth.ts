import { apiClient } from "./client";
import type { AuthResponse, LoginDto, RegisterDto, UserResponse } from "./types";

export const authApi = {
  login: (data: LoginDto) =>
    apiClient.post<AuthResponse>("/api/auth/login", data),

  register: (data: RegisterDto) =>
    apiClient.post<AuthResponse>("/api/auth/register", data),

  me: () => apiClient.get<UserResponse>("/api/users/me"),
};