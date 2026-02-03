// Auth Types
export interface LoginDto {
  email: string;
  password: string;
}

export interface RegisterDto {
  email: string;
  password: string;
  role?: string;
}

export interface UserResponse {
  user_id: number;
  email: string;
  role: string;
  student_id?: number; // Backend provided reference
  teacher_id?: number; // Backend provided reference
}

export interface AuthResponse {
  token: string; // "token" based on standard JWT responses (was access_token)
  user?: UserResponse;
}

// User Types
export interface User {
  user_id: number;
  email: string;
  role: 'admin' | 'teacher' | 'student';
  student_id?: number;
  teacher_id?: number;
}

// Student Types
export interface Student {
  student_id: number;
  user_id?: number;
  student_name: string;
  birth_date: string; // ISO Date string
  gender: string;
  email?: string;
}

export interface CreateStudentDto {
  student_name: string;
  birth_date: string;
  gender: string;
  email: string; // Required for registration
  password?: string; // Optional if created with default
}

export interface UpdateStudentDto {
  student_name?: string;
  birth_date?: string;
  gender?: string;
}

// Teacher Types
export interface Teacher {
  teacher_id: number;
  user_id?: number;
  full_name: string;
  email: string;
  department: string;
}

export interface CreateTeacherDto {
  full_name: string;
  email: string;
  department: string;
  password?: string;
}

// Class Schedule Types
export interface ClassSchedule {
  class_id: number;
  course_id: number; // Linked to Course
  class_name: string;
  class_date: string; // ISO Date string
  start_time: string; // ISO Date string
  end_time: string; // ISO Date string
  room: string;
  teacher_id: number;
  teacher?: Teacher;
  course?: Course; // Optional embedded
}

export interface CreateClassScheduleDto {
  course_id: number;
  class_name: string;
  class_date: string;
  start_time: string;
  end_time: string;
  room: string;
  teacher_id: number;
}

// Attendance Types
export interface Attendance {
  student_id: number;
  class_id: number;
  visit_date: string;
  present: boolean;
  student?: Student;
  class_schedule?: ClassSchedule;
}

export interface RecordVisitDto {
  student_id: number;
  class_id: number;
  visit_date: string;
  present: boolean;
}

// Course Types
export interface Course {
  course_id: number;
  name: string;
  description: string;
  department: string;
  credits: number;
}

export interface CreateCourseDto {
  name: string;
  description: string;
  department: string;
  credits: number;
}

export interface UpdateCourseDto {
  name?: string;
  description?: string;
  department?: string;
  credits?: number;
}

// Course Registration
export interface CourseRegistration {
  student_id: number;
  course_id: number;
  registered_at: string;
}