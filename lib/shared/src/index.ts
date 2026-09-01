export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
}

export interface SafeUser {
  id: string;
  email: string;
  name: string;
  username: string;
  bio: string | null;
  headline: string | null;
  location: string | null;
  avatarUrl: string | null;
  githubUrl: string | null;
  linkedinUrl: string | null;
  portfolioUrl: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface ProfileUpdateRequest {
  name?: string;
  bio?: string | null;
  headline?: string | null;
  location?: string | null;
  avatarUrl?: string | null;
  githubUrl?: string | null;
  linkedinUrl?: string | null;
  portfolioUrl?: string | null;
}

export type AuthResponse = ApiResponse<SafeUser>;