import type { RequestHandler } from "express";
import type { ApiResponse, BlogPost, CreateBlogRequest, UpdateBlogRequest } from "@workspace/shared";
import { z } from "zod";
import { createBlog, deleteBlog, getBlog, listBlogs, updateBlog } from "../services/blogService";
import { AppError } from "../utils/appError";

const blogSchema = z.object({
  title: z.string().trim().min(2).max(160),
  content: z.string().trim().min(1).max(100000),
  excerpt: z.string().trim().max(400).nullable().optional(),
  published: z.boolean().optional(),
});
const updateSchema = blogSchema.partial();
const id = z.string().uuid();
const parseId = (value: unknown) => { const result = id.safeParse(value); if (!result.success) throw new AppError(400, "Invalid blog ID"); return result.data; };
const requireUser = (req: Parameters<RequestHandler>[0]) => { if (!req.user) throw new AppError(401, "Authentication required"); return req.user.id; };

export const list: RequestHandler = async (req, res) => {
  const blogs = await listBlogs(req.user?.id);
  res.json({ success: true, data: blogs, message: "Blogs retrieved successfully" } satisfies ApiResponse<BlogPost[]>);
};
export const detail: RequestHandler = async (req, res) => {
  const blog = await getBlog(parseId(req.params.id), req.user?.id);
  res.json({ success: true, data: blog, message: "Blog retrieved successfully" } satisfies ApiResponse<BlogPost>);
};
export const create: RequestHandler = async (req, res) => {
  const blog = await createBlog(requireUser(req), blogSchema.parse(req.body) as CreateBlogRequest);
  res.status(201).json({ success: true, data: blog, message: "Blog created successfully" } satisfies ApiResponse<BlogPost>);
};
export const update: RequestHandler = async (req, res) => {
  const blog = await updateBlog(parseId(req.params.id), requireUser(req), updateSchema.parse(req.body) as UpdateBlogRequest);
  res.json({ success: true, data: blog, message: "Blog updated successfully" } satisfies ApiResponse<BlogPost>);
};
export const remove: RequestHandler = async (req, res) => {
  await deleteBlog(parseId(req.params.id), requireUser(req));
  res.json({ success: true, data: null, message: "Blog deleted successfully" });
};