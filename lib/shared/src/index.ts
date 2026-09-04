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

export interface ProjectOwner {
  id: string;
  name: string;
  username: string;
  avatarUrl: string | null;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  techStack: string[];
  githubUrl: string | null;
  liveUrl: string | null;
  imageUrl: string | null;
  ownerId: string;
  owner?: ProjectOwner;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProjectRequest {
  title: string;
  description: string;
  techStack: string[];
  githubUrl?: string | null;
  liveUrl?: string | null;
  imageUrl?: string | null;
}

export type UpdateProjectRequest = Partial<CreateProjectRequest>;

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

export interface BlogAuthor {
  id: string;
  name: string;
  username: string;
  avatarUrl: string | null;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string | null;
  published: boolean;
  authorId: string;
  author: BlogAuthor;
  createdAt: string;
  updatedAt: string;
}

export interface CreateBlogRequest {
  title: string;
  content: string;
  excerpt?: string | null;
  published?: boolean;
}

export type UpdateBlogRequest = Partial<CreateBlogRequest>;

export interface PublicDeveloper {
  id: string;
  name: string;
  username: string;
  avatarUrl: string | null;
  headline: string | null;
  bio: string | null;
  location: string | null;
  githubUrl: string | null;
  linkedinUrl: string | null;
  portfolioUrl: string | null;
  skills: string[];
  projects: PublicProject[];
}

export interface PublicProject {
  id: string;
  title: string;
  description: string;
  techStack: string[];
  githubUrl: string | null;
  liveUrl: string | null;
  imageUrl: string | null;
}