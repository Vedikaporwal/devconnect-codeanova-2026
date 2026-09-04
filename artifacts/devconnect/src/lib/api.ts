import type {
  ApiResponse,
  CreateProjectRequest,
  LoginRequest,
  Project,
  ProfileUpdateRequest,
  RegisterRequest,
  SafeUser,
  UpdateProjectRequest,
  BlogPost,
  CreateBlogRequest,
  UpdateBlogRequest,
  PublicDeveloper,
  Connection,
  ConnectionsResponse,
  Endorsement,
  Skill,
  UserEndorsementsResponse,
  UserSkill,
  NotificationsResponse,
  DashboardData,
} from "@workspace/shared";

const API_ROOT = import.meta.env.VITE_API_URL || "/api";

export class ApiError extends Error {
  readonly status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_ROOT}${path}`, {
    ...init,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...init?.headers,
    },
  });

  const payload = (await response.json()) as ApiResponse<T>;
  if (!response.ok || !payload.success) {
    throw new ApiError(payload.message || "Something went wrong", response.status);
  }

  return payload.data;
}

export const authApi = {
  register: (input: RegisterRequest) =>
    request<SafeUser>("/auth/register", {
      method: "POST",
      body: JSON.stringify(input),
    }),
  login: (input: LoginRequest) =>
    request<SafeUser>("/auth/login", {
      method: "POST",
      body: JSON.stringify(input),
    }),
  me: () => request<SafeUser>("/auth/me"),
  logout: () =>
    request<null>("/auth/logout", {
      method: "POST",
    }),
  getProfile: () => request<SafeUser>("/users/me"),
  updateProfile: (input: ProfileUpdateRequest) =>
    request<SafeUser>("/users/me", {
      method: "PUT",
      body: JSON.stringify(input),
    }),
};

export const projectsApi = {
  list: () => request<Project[]>("/projects"),
  get: (id: string) => request<Project>(`/projects/${id}`),
  create: (input: CreateProjectRequest) =>
    request<Project>("/projects", {
      method: "POST",
      body: JSON.stringify(input),
    }),
  update: (id: string, input: UpdateProjectRequest) =>
    request<Project>(`/projects/${id}`, {
      method: "PUT",
      body: JSON.stringify(input),
    }),
  remove: (id: string) =>
    request<null>(`/projects/${id}`, {
      method: "DELETE",
    }),
};

export const blogsApi = {
  list: () => request<BlogPost[]>("/blogs"),
  get: (id: string) => request<BlogPost>(`/blogs/${id}`),
  create: (input: CreateBlogRequest) => request<BlogPost>("/blogs", { method: "POST", body: JSON.stringify(input) }),
  update: (id: string, input: UpdateBlogRequest) => request<BlogPost>(`/blogs/${id}`, { method: "PUT", body: JSON.stringify(input) }),
  remove: (id: string) => request<null>(`/blogs/${id}`, { method: "DELETE" }),
};

export const discoveryApi = {
  list: (params: { search?: string; skill?: string; location?: string }) => {
    const query = new URLSearchParams(Object.entries(params).filter(([, value]) => value?.trim()) as string[][]).toString();
    return request<PublicDeveloper[]>(`/users/discover${query ? `?${query}` : ""}`);
  },
  get: (id: string) => request<PublicDeveloper>(`/users/${id}`),
};

export const connectionsApi = {
  list: () => request<ConnectionsResponse>("/connections"),
  create: (userId: string) => request<Connection>(`/connections/${userId}`, { method: "POST" }),
  accept: (id: string) => request<Connection>(`/connections/${id}/accept`, { method: "PATCH" }),
  reject: (id: string) => request<Connection>(`/connections/${id}/reject`, { method: "PATCH" }),
  remove: (id: string) => request<null>(`/connections/${id}`, { method: "DELETE" }),
};

export const skillsApi = {
  list: () => request<Skill[]>("/skills"),
  listForUser: (userId: string) => request<UserSkill[]>(`/users/${userId}/skills`),
  add: (skillId: string) => request<UserSkill>("/users/me/skills", { method: "POST", body: JSON.stringify({ skillId }) }),
  remove: (skillId: string) => request<null>(`/users/me/skills/${skillId}`, { method: "DELETE" }),
};

export const endorsementsApi = {
  list: (userId: string) => request<UserEndorsementsResponse>(`/users/${userId}/endorsements`),
  add: (userId: string, skillId: string) => request<Endorsement>(`/users/${userId}/endorsements`, { method: "POST", body: JSON.stringify({ skillId }) }),
  remove: (userId: string, skillId: string) => request<null>(`/users/${userId}/endorsements/${skillId}`, { method: "DELETE" }),
};

export const notificationsApi = {
  list: () => request<NotificationsResponse>("/notifications"),
  markRead: (id: string) => request<null>(`/notifications/${id}/read`, { method: "PATCH" }),
  markAllRead: () => request<null>("/notifications/read-all", { method: "PATCH" }),
};

export const dashboardApi = { get: () => request<DashboardData>("/dashboard") };